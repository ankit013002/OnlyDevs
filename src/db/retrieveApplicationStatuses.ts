import { eq } from "drizzle-orm";
import { db } from "./database";
import {
  applicationsTable,
  applicationStatusTable,
  postingsTable,
  usersTable,
} from "./schema";

export interface ApplicationStatus {
  id: number;
  postId: number;
  applicationId: number;
  status: "pending" | "accepted" | "declined";
  changedAt: Date;
  contactMethod: { type: string; link: string } | null;
  postTitle: string;
  ownerUsername: string;
}

export default async function retrieveApplicationStatuses(userId: number) {
  const data = await db
    .select({
      id: applicationStatusTable.id,
      postId: applicationStatusTable.postId,
      applicationId: applicationStatusTable.applicationId,
      status: applicationStatusTable.status,
      changedAt: applicationStatusTable.changedAt,
      contactMethod: applicationStatusTable.contactMethod,
      postTitle: postingsTable.title,
      ownerUsername: usersTable.username,
    })
    .from(applicationStatusTable)
    .innerJoin(
      applicationsTable,
      eq(applicationStatusTable.applicationId, applicationsTable.id)
    )
    .innerJoin(
      postingsTable,
      eq(applicationStatusTable.postId, postingsTable.id)
    )
    .innerJoin(usersTable, eq(postingsTable.ownerId, usersTable.id))
    .where(eq(applicationsTable.applicantId, userId));

  return data;
}
