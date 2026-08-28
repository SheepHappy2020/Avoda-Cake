"use client";
import { useState, } from "react";

export default function CreateEventPage() {
    type EventData = {
        title: string;
        description: string | null;
        eventDate: string;
        registrationDeadline: string;
        location: string;
        maxTeams: number;
        status: string;
    }

    const [eventForm, setEventForm] = useState <EventData>({
        title: "",
        description: "",
        eventDate: "",
        registrationDeadline: '',
        location: '',
        maxTeams: 8,
        status: 'open',
    });

    const[registeredSuccessful, setRegisteredSuccessful] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setEventForm((prevEvent) => ({
            ...prevEvent,
            [name]: name === "maxTeams" ? Number(value) : value,
        }));
    };

    const handleOnSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault()

        const newEvent: {
            title: string;
            description: string | null;
            eventDate: string;
            registrationDeadline: string;
            location: string;
            maxTeams: number;
            status: string;
        } = {
            title: eventForm.title,
            description: eventForm.description,
            eventDate: eventForm.eventDate,
            registrationDeadline: eventForm.registrationDeadline,
            location: eventForm.location,
            maxTeams: eventForm.maxTeams,
            status: eventForm.status,
        }

        const response = await fetch('/api/organizer', {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newEvent)
        })

        const createResult = await response.json()
        console.log("Server response:", createResult)
        if (response.ok) {
            setRegisteredSuccessful(true)
            setErrorMessage("")
        } else {
            setRegisteredSuccessful(false)
            setErrorMessage(createResult.error || "Failed to create event")
        }
    }
    return (
        <main className="min-h-screen bg-[#FAF8F5] px-6 py-16">
            <div className="mx-auto max-w-2xl">

                {/* Page title */}
                <div className="mb-8">
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                        Organizer
                    </p>

                    <h1 className="text-3xl font-semibold text-stone-900">
                        Create Event
                    </h1>

                    <p className="mt-2 text-sm text-stone-500">
                        Create a new cake party and open registration.
                    </p>
                </div>

                {/* Success message */}
                {registeredSuccessful && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        Event Created Successfully
                    </div>
                )}

                {/* Error message */}
                {errorMessage && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                {/* Form card */}
                <form
                    onSubmit={handleOnSubmit}
                    className="space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
                >
                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-stone-700">
                            Title
                        </span>

                        <input
                            required
                            type="text"
                            name="title"
                            value={eventForm.title}
                            onChange={handleInputChange}
                            placeholder="August Cake Party"
                            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-stone-700">
                            Description
                        </span>

                        <input
                            type="text"
                            name="description"
                            value={eventForm.description ?? ""}
                            onChange={handleInputChange}
                            placeholder="Tell guests about this event..."
                            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                        />
                    </label>

                    {/* Dates */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-stone-700">
                                Event Date
                            </span>

                            <input
                                required
                                type="datetime-local"
                                name="eventDate"
                                value={eventForm.eventDate}
                                onChange={handleInputChange}
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-stone-700">
                                Registration Deadline
                            </span>

                            <input
                                required
                                type="datetime-local"
                                name="registrationDeadline"
                                value={eventForm.registrationDeadline}
                                onChange={handleInputChange}
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-stone-700">
                            Location
                        </span>

                        <input
                            required
                            type="text"
                            name="location"
                            value={eventForm.location}
                            onChange={handleInputChange}
                            placeholder="Santa Clara, CA"
                            className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                        />
                    </label>

                    {/* Max teams + status */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-stone-700">
                                Maximum Teams
                            </span>

                            <input
                                required
                                type="number"
                                min={1}
                                name="maxTeams"
                                value={eventForm.maxTeams}
                                onChange={handleInputChange}
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-stone-700">
                                Status
                            </span>

                            <select
                                name="status"
                                value={eventForm.status}
                                onChange={(e) =>
                                    setEventForm((prev) => ({
                                        ...prev,
                                        status: e.target.value,
                                    }))
                                }
                                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-700"
                    >
                        Create Event
                    </button>
                </form>
            </div>
        </main>
    );
}