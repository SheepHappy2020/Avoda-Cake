import Link from "next/link";

export default function HomePage() {

  const eventId = "c53e74d4-e343-42f4-91da-6f60a24f5f3f";

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>
      <ul className="space-y-3">
        <li>
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </li>
        <li>
          <Link href={`/event/${eventId}/register-form`} className="text-blue-600 hover:underline">
            Register Form
          </Link>
        </li>
      </ul>
    </main>
  );
}