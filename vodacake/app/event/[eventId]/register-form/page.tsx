"use client";

import { useState, useEffect, } from "react";
import {useParams} from "next/navigation"

export default function RegisterFormPage() {
    type RegisterState = {
        teamLeader: string; // limited 2-4
        email: string;
        teamName: string; // WeChat ID
        dessertName: string;
        dessertType: string;
        dessertDescription: string;
        allergyInfo: string;
        numberOfPeople: number;
    }

    type EventData = {
        id: string;
        title: string;
        description: string | null;
        event_date: string;
        registration_deadline: string;
        location: string;
        max_teams: number;
        status: string;
    }
    const params = useParams();
    const eventId = params.eventId as string;
    
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [registeredTeams, setRegisteredTeams] = useState(0)
    const [registeredSuccess, setRegisteredSuccess] = useState(false)

    useEffect(()=>{
        const getEvent = async () =>{
            const response = await fetch(`/api/events/${eventId}`, {method: "GET"});

            const eventResult = await response.json()

            if(response.ok){
                setEventData(eventResult.event)
                setRegisteredTeams(eventResult.registeredTeams)
            }

            setLoading(false)
        }
        getEvent()
    }, [eventId])

    const [register, setRegister] = useState<RegisterState>({
        teamLeader: "",
        email: "",
        teamName: "",
        dessertName: "",
        dessertType: "",
        dessertDescription: "",
        allergyInfo: "",
        numberOfPeople: 1,
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const fieldName: string = event.target.getAttribute('name') || '';
        const fieldValue: string | number = fieldName === "numberOfPeople"
            ? Number(event.target.value)
            : event.target.value;
        const newFormData = {...register, [fieldName]: fieldValue}
        setRegister(newFormData)
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newTeam:{
            eventId: string;
            teamLeader: string;
            email: string;
            teamName: string;
            dessertName: string;
            dessertType: string;
            dessertDescription: string;
            allergyInfo: string;
            numberOfPeople: number;
        } = {
            eventId,
            teamLeader: register.teamLeader,
            email: register.email,
            teamName: register.teamName,
            dessertName: register.dessertName,
            dessertType: register.dessertType,
            dessertDescription: register.dessertDescription,
            allergyInfo: register.allergyInfo,
            numberOfPeople: register.numberOfPeople,
        }

        const response = await fetch('/api/register', {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(newTeam),
        })

        const registrationResult  = await response.json()
        console.log("Server reponse:", registrationResult )
        setRegisteredSuccess(true)

    };

    if(loading){
        return (
            <div>Loading...</div>
        )
    }
    
    if(!eventData){
        return(
            <div>Event not found</div>
        )
    }
    
    return (
        <div>
            <h1>{eventData.title}</h1>

            <p>{eventData.description}</p>
            <p>Registration: {`${registeredTeams} / ${eventData.max_teams}`}</p>
            {registeredTeams >= eventData.max_teams &&(
                <p>This event is full</p>
            )}
            <p>Date: {new Date(eventData.event_date).toLocaleString()}</p>
            
            <p>Location: {eventData.location}</p>

            <p>Registration Deadline:
                {new Date(eventData.registration_deadline).toLocaleString()}
            </p>

            {registeredSuccess && <h2>Team {register.teamName} has registered successful</h2>}
            <h1>Register Form</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Team Name
                    <input
                        type="text"
                        value={register.teamName}
                        name='teamName'
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                <label>
                    Team Leader (WeChat ID)
                    <input
                        type="text"
                        value={register.teamLeader}
                        name='teamLeader'
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                <label>
                    Email Address
                    <input
                        type="text"
                        value={register.email}
                        name='email'
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                <label>
                    numberOfPeople
                    <input
                        type="number"
                        value={register.numberOfPeople}
                        name='numberOfPeople'
                        min={1}
                        max={4}
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                <label>
                    dessertName
                    <input
                        type="text"
                        value={register.dessertName}
                        name='dessertName'
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                <label>
                    dessertType
                    <input
                        type="text"
                        value={register.dessertType}
                        name='dessertType'
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                <label>
                    dessertDescription
                    <textarea
                        value={register.dessertDescription}
                        name='dessertDescription'
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                <label>
                    Allergy Information
                    <textarea
                        value={register.allergyInfo}
                        name='allergyInfo'
                        onChange={(e) => handleInputChange(e)}
                    />
                </label>
                <button type='submit'>Submit Register Form</button>
            </form>
        </div>
    );
}
