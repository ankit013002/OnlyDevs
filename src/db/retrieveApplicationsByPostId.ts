import { eq } from "drizzle-orm";
import { db } from "./database";
import {
  applicationsTable,
  SelectApplication,
  SelectUser,
  usersTable,
} from "./schema";

export type ApplicationWithUser = {
  applications_table: SelectApplication;
  users_table: SelectUser | null;
};

export default async function retrieveApplicationsByPostId(postId: number) {
  const data = await db
    .select()
    .from(applicationsTable)
    .leftJoin(usersTable, eq(applicationsTable.applicantId, usersTable.id))
    .where(eq(applicationsTable.postId, postId));
  return data;
}
