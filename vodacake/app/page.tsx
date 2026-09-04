import Link from "next/link";

export default function HomePage() {

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">
          欢迎参加我们的烘焙局
        </h1>

        <p>
          <Link
            href="/organizer/login"
            className="text-blue-600 hover:underline"
          >
            Organizer Login
          </Link>
        </p>

        <p>
          <Link href="/event">
            Events
          </Link>
        </p>
      </div>
    </main>
  );
}