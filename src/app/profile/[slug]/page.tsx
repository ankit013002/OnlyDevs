import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import retrieveUser from "@/db/retrieveUser";
import { db } from "@/db/database";
import {
  applicationsTable,
  postingsTable,
  postingStatusEnum,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import retrieveUserFromKinde from "@/db/retrieveUserFromKinde";

interface PageProps {
  params: { slug: string };
}

export default async function ProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const user = await retrieveUser(slug);
  if (!user) notFound();
  const currUser = await retrieveUserFromKinde();

  const postings = await db
    .select()
    .from(postingsTable)
    .where(eq(postingsTable.ownerId, user.id))
    .orderBy(desc(postingsTable.createdAt));

  const applications = await db
    .select({
      id: applicationsTable.id,
      introText: applicationsTable.introText,
      portfolioUrl: applicationsTable.portfolioUrl,
      status: applicationsTable.status,
      appliedAt: applicationsTable.appliedAt,
      post: {
        id: postingsTable.id,
        title: postingsTable.title,
        techTags: postingsTable.techTags,
        status: postingsTable.status,
      },
    })
    .from(applicationsTable)
    .leftJoin(postingsTable, eq(postingsTable.id, applicationsTable.postId))
    .where(eq(applicationsTable.applicantId, user.id))
    .orderBy(desc(applicationsTable.appliedAt));

  return (
    <main className="container mx-auto px-4 py-10 space-y-10 min-h-[100vh]">
      <header className="w-full flex flex-col sm:flex-row">
        <div className="flex items-center avatar avatar-placeholder mx-2">
          <div className="text-neutral-content w-30 h-30 rounded-full bg-red-500">
            <span className="text-3xl">D</span>
          </div>
        </div>

        <div className="mx-5">
          <h1 className="text-3xl font-semibold leading-tight">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.bio && <p className="mt-4 max-w-prose">{user.bio}</p>}

          {user.techTags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {user.techTags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-secondary text-secondary-content px-3 py-1 text-sm font-medium"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        {currUser?.id == user.id && (
          <div className="flex ml-auto items-center">
            <Link href="/profileSettings" className="btn btn-primary">
              Edit profile
            </Link>
          </div>
        )}
      </header>

      <div className="grid sm:grid-rows-2 lg:grid-cols-2">
        <div className="px-5">
          <h2 className="text-2xl font-semibold mb-6 justify-self-center">
            Projects
          </h2>

          {postings.length === 0 ? (
            <p className="text-muted-foreground">No postings yet.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-6">
              {postings.map((post) => (
                <li key={post.id}>
                  <article className="card bg-base-100 shadow hover:shadow-lg transition-shadow h-full">
                    <div className="card-body space-y-2">
                      <h3 className="card-title line-clamp-1">{post.title}</h3>
                      <p className="line-clamp-3 text-sm">{post.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {post.techTags.map((t) => (
                          <span
                            key={t}
                            className="badge badge-outline text-xs py-1 px-2 bg-"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex justify-between items-end pt-4">
                        <span
                          className={`badge ${
                            post.status === postingStatusEnum.enumValues[0]
                              ? "badge-success"
                              : post.status === postingStatusEnum.enumValues[1]
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {post.status.replace("_", " ")}
                        </span>

                        <Link
                          href={`/post/${post.id}`}
                          className="btn btn-primary"
                        >
                          View&nbsp;details →
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="px-5">
          <h2 className="text-2xl font-semibold mb-6">Applications</h2>

          {applications.length === 0 ? (
            <p className="text-muted-foreground">No applications yet.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-6">
              {applications.map(
                (app) =>
                  app.post?.id && (
                    <li key={app.id}>
                      <article className="card bg-base-100 shadow hover:shadow-lg transition-shadow h-full">
                        <div className="card-body space-y-2">
                          <h3 className="card-title line-clamp-1">
                            {app.post.title}
                          </h3>

                          <p className="line-clamp-3 text-sm">
                            {app.introText}
                          </p>

                          {app.portfolioUrl && (
                            <a
                              href={app.portfolioUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link link-primary text-sm"
                            >
                              View portfolio
                            </a>
                          )}

                          <div className="mt-auto flex justify-between items-end pt-4">
                            <span
                              className={`badge ${
                                app.status === "pending"
                                  ? "badge-warning"
                                  : app.status === "accepted"
                                  ? "badge-success"
                                  : "badge-error"
                              }`}
                            >
                              {app.status.replace("_", " ")}
                            </span>

                            <Link
                              href={`/post/${app.post.id}`}
                              className="btn btn-primary"
                            >
                              View&nbsp;post →
                            </Link>
                          </div>
                        </div>
                      </article>
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
