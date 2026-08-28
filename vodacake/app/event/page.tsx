"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EventItem = {
    id: string;
    title: string;
    description: string | null;
    location: string;
    event_date: string;
    registration_deadline: string;
    max_teams: number;
    status: string;
    teams: {
        count: number;
    }[];
};

const Event = () => {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
      const getEvents = async () => {
          const response = await fetch("/api/events",
              {
                  method: "GET",
                  headers: { "Content-Type": "application/json" }
              })
          const result = await response.json()
          if (response.ok) {
              setEvents(result.events)
          }
      }
      getEvents()
          
  }, []);

  return (
    <div>
          {events.map((e) => (
              <div key={e.id }>
                <h2>{e.title}</h2>

                <p>{e.description}</p>

                <p>Location: {e.location}</p>

                <p>
                    Event Date:
                    {new Date(e.event_date).toLocaleString()}
                </p>

                <p>
                    Registration Deadline:
                    {new Date(e.registration_deadline).toLocaleString()}
                </p>

                <p>Registration: {e.teams[0]?.count ?? 0} / {e.max_teams}</p>

                <p>Status: {e.status}</p>
                  
                  {(e.teams[0]?.count ?? 0) >= e.max_teams ?
                      (<p>Registration Has Full</p>)
                      :
                      (<Link href={`/event/${e.id}/register-form`} className="text-blue-600 hover:underline">
                          Register Form
                      </Link>)
                }
            </div>
      ))}
    </div>
  );
};

export default Event;