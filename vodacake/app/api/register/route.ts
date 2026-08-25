import {supabase} from "@/lib/supabase"
import { resend } from "@/lib/resend"


export async function GET(){
    const {data, error} = await supabase
    .from("events")
    .select("*")

    if(error){
        return Response.json({error : error.message}, {status: 500})
    }

    return Response.json(data)
}

export async function POST(request: Request){
    try{
        const body = await request.json()
        const {eventId, teamLeader, email, teamName, dessertName, dessertType, dessertDescription, allergyInfo, numberOfPeople } = body

        if(!eventId || !teamName || !dessertName || !teamLeader || !numberOfPeople || !email){
            return Response.json(
                {
                    error: "eventId, teamName, email, dessertName, teamLeader and numberOfPeople are required fields "
                },
                {status: 400}
            )
        }

        if(numberOfPeople < 1 || numberOfPeople > 4){
            return Response.json(
                {error: "number of people must be between 1 and 4"},
                {status: 400}   
            )
        }

        const {data: eventData, error: eventError} = await supabase
            .from("events")
            .select("id, registration_deadline, max_teams, status")
            .eq("id", eventId)
            .single()

        if(eventError || !eventData){
            return Response.json(
                {error: "Event not found"},
                {status: 404}
            )
        }

        if(eventData.status !== "open"){
            return Response.json(
                {error: "Event is not open for registration"},
                {status: 403}
            )
        }

        const now =new Date()
        const deadline = new Date(eventData.registration_deadline);

        if(now > deadline){
            return Response.json(
                {error: "Registration deadline has passed"},
                {status: 403}
            )
        }

        const {count, error: countError} = await supabase
            .from("teams")
            .select("*", {count: "exact", head: true})
            .eq("event_id", eventId)
            .eq("status", "confirmed")

        if(countError){
            console.error("Failed to count teams:", countError)
            return Response.json(
                {error: "Failed to check event capacity"},
                {status: 500}
            )
        }
        
        if(count !==null && count >= eventData.max_teams){
            return Response.json(
                {error: "This event is full"},
                {status: 409}
            )
        }

        const {data, error} = await supabase
            .from("teams")
            .insert({
                event_id:eventId,
                team_leader: teamLeader,
                email: email,
                team_name: teamName,
                dessert_name: dessertName,
                dessert_type: dessertType,
                dessert_description: dessertDescription,
                allergy_info: allergyInfo,
                number_of_people: numberOfPeople
            })
            .select()
            .single()
        if(error){
            console.error("Supabase insert error:", error)

            return Response.json(
                {
                    error: error.message
                },{
                    status:500
                }
            )
        }

        const { data: emailData, error: emailError } =
            await resend.emails.send({
                from: "Avoda Cake <registration@avodacake.com>",
                to: [email],
                subject: "Cake Party Registration Confirmed",
                html: `
                        <h1>Registration Confirmed!</h1>
                        <p>Your team has successfully registered.</p>
                     `
            });
            return Response.json(
            {
                message: "Team registered successfully",
                team: data,
                emailSent: !emailError
            },
            {
                status: 201
            }
            )
    }catch(error){
        console.error("POST /api/register error:", error)

        return Response.json(
            {
                error: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
}
