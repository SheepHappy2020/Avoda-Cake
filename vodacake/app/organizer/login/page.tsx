"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

const OrganizerLoginPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async(
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setErrorMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setErrorMessage(error.message)
            return
        }

        router.push("/organizer/events")
    }

    return (
        <main className="min-h-screen bg-[#FAF8F5] px-6 py-16">
            <div className="mx-auto max-w-md">
                <h1 className="mb-8 text-3xl font-bold text-stone-900">
                    Organizer Login
                </h1>

                <form
                    onSubmit={handleLogin}
                    className="space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
                >
                    {errorMessage && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-stone-700">
                            Email
                        </span>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-500"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-stone-700">
                            Password
                        </span>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-stone-500"
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-700"
                    >
                        Login
                    </button>
                </form>
            </div>
        </main>
    )
}

export default OrganizerLoginPage