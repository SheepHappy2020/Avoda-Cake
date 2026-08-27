import { supabase } from "@/lib/supabase";

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        const {
            title,
            description,
            eventDate,
            registrationDeadline,
            location,
            maxTeams,
            status,
        } = body
        console.log(body)
        if (!title || !eventDate || !registrationDeadline || !location || maxTeams < 1 || !status) {
            return Response.json(
                {
                    error: "Title, eventDate, registrationDeadline, location, maxTeams, status are required fields"
                },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from("events")
            .insert({
                title: title,
                description: description,
                event_date: eventDate,
                registration_deadline: registrationDeadline,
                location: location,
                max_teams: maxTeams,
                status: status,
            })
            .select()
            .single()
        
        if (error) {
            console.error("Supabase create event error:", error);

            return Response.json(
                {
                    error: error.message
                },
                {
                    status: 500
                }
            );
        }
        if (registrationDeadline >= eventDate) {
            return Response.json(
                {
                    error: "Registration deadline must be before event date"
                },
                {
                    status: 400
                }
            );
        }
        return Response.json(
            {
                message: "Event create successful",
                event: data
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("POST /api/organizer error: ", error)
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}