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
        <main className="min-h-screen bg-[#FAF8F5] px-6 py-16">
            <div className="mx-auto max-w-2xl">

                {/* Event Information */}
                <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
                    <div className="mb-6">
                        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                            Cake Party
                        </p>

                        <h1 className="text-3xl font-semibold text-stone-900">
                            {eventData.title}
                        </h1>

                        {eventData.description && (
                            <p className="mt-3 leading-7 text-stone-500">
                                {eventData.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 border-t border-stone-100 pt-6 text-sm text-stone-600">
                        <p>
                            <span className="font-medium text-stone-900">
                                Date:
                            </span>{" "}
                            {new Date(eventData.event_date).toLocaleString()}
                        </p>

                        <p>
                            <span className="font-medium text-stone-900">
                                Location:
                            </span>{" "}
                            {eventData.location}
                        </p>

                        <p>
                            <span className="font-medium text-stone-900">
                                Registration Deadline:
                            </span>{" "}
                            {new Date(
                                eventData.registration_deadline
                            ).toLocaleString()}
                        </p>

                        <p>
                            <span className="font-medium text-stone-900">
                                Registration:
                            </span>{" "}
                            {registeredTeams} / {eventData.max_teams} teams
                        </p>
                    </div>

                    {registeredTeams >= eventData.max_teams && (
                        <div className="mt-6 rounded-xl bg-stone-100 px-4 py-3 text-center text-sm font-medium text-stone-600">
                            This event is full
                        </div>
                    )}
                </div>

                {/* Successful Registration */}
                {registeredSuccess && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        Team{" "}
                        <span className="font-semibold">
                            {register.teamName}
                        </span>{" "}
                        has registered successfully!
                    </div>
                )}

                {/* Registration Form */}
                <div>
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-stone-900">
                            Register Your Team
                        </h2>

                        <p className="mt-2 text-sm text-stone-500">
                            Tell us about your team and the dessert you are bringing.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
                    >
                        {/* Team Name */}
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-stone-700">
                                Team Name
                            </span>

                            <input
                                required
                                type="text"
                                value={register.teamName}
                                name="teamName"
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Your team name"
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                            />
                        </label>

                        {/* Team Leader */}
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-stone-700">
                                Team Leader
                            </span>

                            <span className="mb-2 block text-xs text-stone-400">
                                WeChat ID
                            </span>

                            <input
                                required
                                type="text"
                                value={register.teamLeader}
                                name="teamLeader"
                                onChange={(e) => handleInputChange(e)}
                                placeholder="WeChat ID"
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                            />
                        </label>

                        {/* Email */}
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-stone-700">
                                Email Address
                            </span>

                            <input
                                required
                                type="email"
                                value={register.email}
                                name="email"
                                onChange={(e) => handleInputChange(e)}
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                            />
                        </label>

                        {/* Number of People */}
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-stone-700">
                                Number of People
                            </span>

                            <input
                                required
                                type="number"
                                value={register.numberOfPeople}
                                name="numberOfPeople"
                                min={1}
                                max={4}
                                onChange={(e) => handleInputChange(e)}
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                            />

                            <span className="mt-2 block text-xs text-stone-400">
                                Each team may have 1–4 people.
                            </span>
                        </label>

                        {/* Dessert section */}
                        <div className="border-t border-stone-100 pt-6">
                            <h3 className="mb-1 text-lg font-semibold text-stone-900">
                                Dessert Information
                            </h3>

                            <p className="mb-6 text-sm text-stone-500">
                                Tell us what your team plans to bring.
                            </p>

                            <div className="space-y-6">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-stone-700">
                                        Dessert Name
                                    </span>

                                    <input
                                        required
                                        type="text"
                                        value={register.dessertName}
                                        name="dessertName"
                                        onChange={(e) => handleInputChange(e)}
                                        placeholder="e.g. Matcha Strawberry Tart"
                                        className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-stone-700">
                                        Dessert Type
                                    </span>

                                    <input
                                        type="text"
                                        value={register.dessertType}
                                        name="dessertType"
                                        onChange={(e) => handleInputChange(e)}
                                        placeholder="e.g. Tart, Cheesecake, Choux"
                                        className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-stone-700">
                                        Dessert Description
                                    </span>

                                    <textarea
                                        value={register.dessertDescription}
                                        name="dessertDescription"
                                        onChange={(e) => handleInputChange(e)}
                                        rows={4}
                                        placeholder="Describe your dessert..."
                                        className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-stone-700">
                                        Allergy Information
                                    </span>

                                    <textarea
                                        value={register.allergyInfo}
                                        name="allergyInfo"
                                        onChange={(e) => handleInputChange(e)}
                                        rows={3}
                                        placeholder="Please list any common allergens..."
                                        className="w-full resize-none rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
                                    />
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={
                                registeredTeams >= eventData.max_teams
                            }
                            className="w-full rounded-xl bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
                        >
                            {registeredTeams >= eventData.max_teams
                                ? "Registration Full"
                                : "Submit Registration"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
