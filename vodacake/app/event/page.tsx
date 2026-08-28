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
        <div className="grid gap-6 md:grid-cols-2">
            {events.map((e) => {
                const registeredTeams = e.teams[0]?.count ?? 0;
                const isFull = registeredTeams >= e.max_teams;

                return (
                    <div
                        key={e.id}
                        className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm"
                    >
                        <h2 className="text-2xl font-semibold text-stone-900">
                            {e.title}
                        </h2>

                        {e.description && (
                            <p className="mt-2 text-sm leading-6 text-stone-500">
                                {e.description}
                            </p>
                        )}

                        <div className="space-y-2 border-t border-stone-100 py-5 text-sm text-stone-600">
                            <p>
                                <span className="font-medium text-stone-900">
                                    Date:
                                </span>{" "}
                                {new Date(e.event_date).toLocaleString()}
                            </p>

                            <p>
                                <span className="font-medium text-stone-900">
                                    Location:
                                </span>{" "}
                                {e.location}
                            </p>

                            <p>
                                <span className="font-medium text-stone-900">
                                    Registration deadline:
                                </span>{" "}
                                {new Date(e.registration_deadline).toLocaleString()}
                            </p>

                            <p>
                                <span className="font-medium text-stone-900">
                                    Teams:
                                </span>{" "}
                                {registeredTeams} / {e.max_teams}
                            </p>
                        </div>

                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-600">
                            {e.status}
                        </span>

                        <div className="mt-4">
                            {isFull ? (
                                <p className="rounded-xl bg-stone-100 px-4 py-3 text-center text-sm font-medium text-stone-500">
                                    Registration Is Full
                                </p>
                            ) : (
                                <Link
                                    href={`/event/${e.id}/register-form`}
                                    className="block rounded-xl bg-stone-900 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-stone-700"
                                >
                                    Register Form
                                </Link>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Event;