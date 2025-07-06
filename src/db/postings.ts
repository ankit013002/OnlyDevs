import { db } from "./database";
import { postingsTable } from "./schema";

export default async function postings() {
  const postings = await db.select().from(postingsTable);

  return postings;
}
