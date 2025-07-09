"use client";

import React, { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

interface FormState {
  username: string;
  title: string;
  description: string;
  techTags: string;
  rolesNeeded: number;
  status: "open" | "in_progress" | "closed";
}

export default function NewPostingPage() {
  const { getUser } = useKindeAuth();
  const user = getUser();

  if (!user || !user.username) {
    redirect("/");
  }

  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    username: user.username,
    title: "",
    description: "",
    techTags: "",
    rolesNeeded: 1,
    status: "open",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm(
      (f) =>
        ({
          ...f,
          [name]: name === "rolesNeeded" ? parseInt(value, 10) : value,
        } as FormState)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      ...form,
      techTags: form.techTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    };

    const res = await fetch("/api/postings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "Failed to create posting");
    } else {
      // on success, redirect to your postings list
      router.push("/postings");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl mb-4">Create a New Posting</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}

        <div>
          <label className="block font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded h-24"
          />
        </div>

        <div>
          <label className="block font-medium">
            Tech Tags (comma-separated)
          </label>
          <input
            name="techTags"
            value={form.techTags}
            onChange={handleChange}
            placeholder="Next.js, TypeScript, GraphQL"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Roles Needed</label>
          <input
            name="rolesNeeded"
            type="number"
            min={1}
            value={form.rolesNeeded}
            onChange={handleChange}
            className="w-20 border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Posting
        </button>
      </form>
    </div>
  );
}
