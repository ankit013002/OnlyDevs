import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "./database";
import { usersTable } from "./schema";

export default async function insertUserIntoDB() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log(user);

  if (!user || user.email == null || user.username == null) {
    return;
  }

  const name = `${user.given_name ?? ""} ${user.family_name ?? ""}`.trim();

  console.log(user);

  const response = await db
    .insert(usersTable)
    .values({
      username: user.username,
      name: name,
      email: user.email,
      bio: "",
      techTags: [],
    })
    .onConflictDoNothing();

  return response;
}
