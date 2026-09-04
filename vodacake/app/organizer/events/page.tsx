"use client"

import { useState, useEffect } from "react";
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

const EventsPage = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("/api/events");

                const result = await response.json();

                if (!response.ok) {
                    setErrorMessage(result.error || "Failed to fetch events");
                    return;
                }

                setEvents(result.events);
            } catch (error) {
                console.error("Failed to fetch events:", error);
                setErrorMessage("Something went wrong while loading events.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);
    
    return (
        <main className="min-h-screen bg-[#FAF8F5] px-6 py-12">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900">
                            Recent Events
                        </h1>

                        <p className="mt-2 text-stone-600">
                            View and manage your events.
                        </p>
                    </div>

                    <Link
                        href="/organizer/create-event"
                        className="rounded-xl bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-700"
                    >
                        Create Event
                    </Link>
                </div>

                {loading && (
                    <p className="text-stone-600">
                        Loading events...
                    </p>
                )}

                {errorMessage && (
                    <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
                        {errorMessage}
                    </div>
                )}

                {!loading && !errorMessage && events.length === 0 && (
                    <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
                        <p className="text-stone-600">
                            No events found.
                        </p>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {events.map((e) => {
                        const registeredTeams = e.teams[0]?.count ?? 0;

                        return (
                            <div
                                key={e.id}
                                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-stone-900">
                                        {e.title}
                                    </h2>

                                    <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">
                                        {e.status}
                                    </span>
                                </div>

                                {e.description && (
                                    <p className="mb-5 text-stone-600">
                                        {e.description}
                                    </p>
                                )}

                                <div className="space-y-2 text-sm text-stone-700">
                                    <p>
                                        <span className="font-medium">Location:</span>{" "}
                                        {e.location}
                                    </p>

                                    <p>
                                        <span className="font-medium">Date:</span>{" "}
                                        {new Date(e.event_date).toLocaleString()}
                                    </p>

                                    <p>
                                        <span className="font-medium">
                                            Registration Deadline:
                                        </span>{" "}
                                        {new Date(
                                            e.registration_deadline
                                        ).toLocaleString()}
                                    </p>

                                    <p>
                                        <span className="font-medium">Teams:</span>{" "}
                                        {registeredTeams} / {e.max_teams}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    )
}
 
export default EventsPage