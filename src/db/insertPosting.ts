import { db } from "./database";
import { InsertPosting, postingsTable } from "./schema";

export default async function InsertPost(postData: InsertPosting) {
  const response = await db.insert(postingsTable).values(postData);
  return response;
}
