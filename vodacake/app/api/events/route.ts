import { supabase } from "@/lib/supabase";

export const GET = async (request: Request) => {
    try {
        const { data, error } = await supabase
            .from("events")
            .select("id, title, description, event_date, registration_deadline, location, max_teams, status")
            .order("event_date", { ascending: true })
        if (error) {
            console.error("Get whole events supabase error")
            return Response.json(
                {error: error.message},
                {status:500}
            )
        }

        return Response.json(
            { events: data },
            {status: 200}
        )
    } catch (error) {
        console.error("Get event error: ", error)

        return Response.json(
            {error: "Failed to get all events"},
            {status: 500}
        )
    }
}
