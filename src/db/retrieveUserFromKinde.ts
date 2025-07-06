import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import retrieveUser from "./retrieveUser";

export default async function retrieveUserFromKinde() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser || kindeUser?.username == null) {
    return;
  }
  return retrieveUser(kindeUser?.username);
}
