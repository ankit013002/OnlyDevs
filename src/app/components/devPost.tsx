"use client";

import { SelectPosting } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

interface PostingsListProps {
  post: SelectPosting;
}

async function handleRedirect(postId: number) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log(user);
}

const DevPost = ({ post }: PostingsListProps) => {
  return (
    <button
      key={post.id}
      onClick={() => handleRedirect(post.id)}
      className="block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition"
    >
      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {post.title}
      </h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        {post.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.techTags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Roles: {post.rolesNeeded}</span>
        <span>Status: {post.status.replace("_", " ")}</span>
      </div>
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-600">
        Posted by {post.ownerId} on{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
    </button>
  );
};

export default DevPost;
