import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ContactFields from "@/app/components/contactFields";
import { db } from "@/db/database";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { LiaLinkSolid } from "react-icons/lia";

async function updateProfile(formData: FormData) {
  "use server";

  const { getUser } = getKindeServerSession();
  const authUser = await getUser();
  if (!authUser?.email) redirect("/");

  let types = formData.getAll("contactType") as string[];
  let links = formData.getAll("contactLink") as string[];

  links = links.filter((link) => link !== "");
  types = types.filter((type, index) => index < links.length);

  const contact = types
    .map((type, i) => ({
      type: type.trim(),
      link: links[i].trim(),
    }))
    .filter(({ type, link }) => type && link);

  const [dbUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, authUser.email));

  if (!dbUser) notFound();

  const name = (formData.get("name") as string).trim();
  const bio = (formData.get("bio") as string | null) ?? null;
  const techTagsRaw = (formData.get("techTags") as string) ?? "";
  const techTags = techTagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await db
    .update(usersTable)
    .set({ name, bio, techTags, contact })
    .where(eq(usersTable.id, dbUser.id));

  revalidatePath(`/profile/${dbUser.username}`);
  redirect(`/profile/${dbUser.username}`);
}

export default async function ProfileSettingsPage() {
  const { getUser } = getKindeServerSession();
  const authUser = await getUser();
  if (!authUser?.email) redirect("/");

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, authUser.email));

  if (!user) notFound();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10 space-y-10">
      <h1 className="text-3xl font-semibold">Profile settings</h1>

      <form action={updateProfile} className="space-y-6">
        <div>
          <label className="label">Username</label>
          <input
            name="username"
            type="text"
            disabled
            defaultValue={user.username}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Display name</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={user.name}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Bio</label>
          <textarea
            name="bio"
            rows={4}
            defaultValue={user.bio ?? ""}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            Tech tags <span className="opacity-60">(comma-separated)</span>
          </label>
          <input
            name="techTags"
            type="text"
            defaultValue={user.techTags.join(", ")}
            className="input input-bordered w-full"
          />
        </div>

        <ContactFields initial={user.contact} />

        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary">
            Save changes
          </button>
          <Link href={`/profile/${user.username}`} className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
