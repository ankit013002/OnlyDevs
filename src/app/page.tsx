"use server";

import postings from "@/db/postings";
import {
  getKindeServerSession,
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import DevPost from "./components/devPost";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

// Define mock data type matching your schema
interface Posting {
  id: number;
  title: string;
  description: string;
  techTags: string[];
  rolesNeeded: number;
  status: "open" | "in_progress" | "closed";
  createdAt: string;
  ownerName: string;
}

// Mock postings array
const mockPostings: Posting[] = [
  {
    id: 1,
    title: "Realtime Chat App",
    description:
      "Build a chat application with WebSocket integration and Redis Pub/Sub.",
    techTags: ["Next.js", "WebSocket", "Redis", "TypeScript"],
    rolesNeeded: 2,
    status: "open",
    createdAt: "2025-06-25T10:00:00Z",
    ownerName: "Alice",
  },
  {
    id: 2,
    title: "E-commerce Backend",
    description:
      "Develop a scalable backend for an e-commerce platform using Node.js and PostgreSQL.",
    techTags: ["Node.js", "PostgreSQL", "Docker"],
    rolesNeeded: 1,
    status: "in_progress",
    createdAt: "2025-06-20T14:30:00Z",
    ownerName: "Bob",
  },
  {
    id: 3,
    title: "Mobile Game UI",
    description:
      "Design and implement UI components for a mobile game using React Native.",
    techTags: ["React Native", "UI/UX"],
    rolesNeeded: 3,
    status: "open",
    createdAt: "2025-06-30T08:15:00Z",
    ownerName: "Carol",
  },
];

export default async function Home() {
  const data = await postings();
  const loggedIn = false;
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  console.log(isUserAuthenticated);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Dev Collaborations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Find projects, join teams, and build together.
        </p>
      </header>

      <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((post) => (
          <DevPost key={post.id} post={post} />
        ))}
      </main>
    </div>
  );
}
