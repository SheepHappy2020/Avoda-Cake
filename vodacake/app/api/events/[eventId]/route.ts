import {supabase} from "@/lib/supabase";

export async function GET(
    request: Request,
    {params}: {params: Promise<{eventId: string}>}
){
    try{
        const{ eventId} = await params;

        const {data, error} = await supabase
            .from('events')
            .select("id, title, description, event_date, registration_deadline, location, max_teams, status ")
            .eq("id", eventId)
            .single()
        
        const {count, error: countError} = await supabase
            .from("teams")
            .select("*", {count: "exact"})
            .eq("event_id", eventId)

        if(error){
            console.error("GET event supabase error:", error)

            return Response.json(
                {error: error.message},
                {status: 500}
            )
        }

        if(!data){
            return Response.json(
                {error:"Event not found"},
                {status: 404}
            )
        }

        if(countError){
            console.error("Failed to count teams: ", countError)
            return Response.json(
                {error: "Failed to get team count"},
                {status: 500}
            )
        }

        return Response.json(
            {
                event: data,
                registeredTeams: count
            },
            {status: 200}
        )
        
        
    }catch(error){
        console.error("GET event error:", error)

        return Response.json(
            {error: "Failed to get event"},
            {status: 500}
        )
    }
    

}