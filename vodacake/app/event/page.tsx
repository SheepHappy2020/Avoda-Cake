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
          <ul key={e.id }>
              <li>{e.title}</li>
              <li>{e.description}</li>
              <li>{e.event_date}</li>
              <li>{e.registration_deadline}</li>
              <Link href={`/event/${e.id}/register-form`} className="text-blue-600 hover:underline">
                  Register Form
              </Link>
        </ul>
      ))}
    </div>
  );
};

export default Event;