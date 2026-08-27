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
        <div>
            {registeredSuccessful && <h1>Event Create Successful</h1>}
            {errorMessage && <p>{errorMessage}</p>}
            <form onSubmit={handleOnSubmit}>
                <label>
                    Title
                    <input required type="text" name='title' value={eventForm.title} onChange={(event)=>handleInputChange(event)} />
                </label>
                <label>
                    Description
                    <input type="text" name='description' value={eventForm.description ?? ""} onChange={(event) => handleInputChange(event)} />
                </label>
                <label>
                    Event Date
                    <input type="datetime-local" name='eventDate' value={eventForm.eventDate} onChange={(event) => handleInputChange(event)} />
                </label>
                <label>
                    Register Dead Line
                    <input type="datetime-local" name='registrationDeadline' value={eventForm.registrationDeadline} onChange={(event) => handleInputChange(event)} />
                </label>
                <label>
                    Location
                    <input type="text" name='location' value={eventForm.location} onChange={(event) => handleInputChange(event)} />
                </label>
                <label>
                    Max Teams
                    <input type="number" min={1} name='maxTeams' value={eventForm.maxTeams} onChange={(event) => handleInputChange(event)} />
                </label>
                <select
                    name="status"
                    value={eventForm.status}
                    onChange={(e) =>
                        setEventForm((prev) => ({
                            ...prev,
                            status: e.target.value,
                        }))
                    }
                >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
                <button type='submit'>Create Event</button>
            </form>
        </div>
    );
}