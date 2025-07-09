import { eq } from "drizzle-orm";
import { db } from "./database";
import { postingsTable } from "./schema";

export default async function postings(postId?: number) {
  if (postId) {
    const postings = await db
      .select()
      .from(postingsTable)
      .where(eq(postingsTable.id, postId));
    return postings[0];
  } else {
    return await db.select().from(postingsTable);
  }
}
