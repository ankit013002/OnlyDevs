import { eq } from "drizzle-orm";
import { db } from "./database";
import { usersTable } from "./schema";

export default async function retrieveUser(username: string) {
  console.log(username);

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));

  return user[0];
}
