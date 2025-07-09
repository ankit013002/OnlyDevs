import postings from "@/db/postings";
import retrieveUser from "@/db/retrieveUser";
import { SelectPosting, applicationsTable } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db/database";
import { redirect } from "next/navigation";

interface ApplicationPageProps {
  searchParams: {
    postId?: string;
  };
}

export default async function ApplicationPage({
  searchParams,
}: ApplicationPageProps) {
  const postId = searchParams.postId ? parseInt(searchParams.postId, 10) : NaN;
  if (isNaN(postId)) {
    redirect("/");
  }

  const postData = (await postings(postId)) as SelectPosting;
  if (!postData) {
    redirect("/");
  }

  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser?.username) {
    redirect("/");
  }
  const user = await retrieveUser(kindeUser.username);

  if (postData.ownerId === user.id) {
    redirect(`/post/${postData.id}`);
  }

  async function applyAction(formData: FormData) {
    "use server";
    const introText = formData.get("introText")?.toString().trim() ?? "";
    const portfolioUrl = formData.get("portfolioUrl")?.toString().trim() ?? "";

    await db.insert(applicationsTable).values({
      postId: postData.id,
      applicantId: user.id,
      introText,
      portfolioUrl,
    });

    redirect(`/post/${postData.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Apply to: {postData.title}</h1>
      <p className="text-gray-700 mb-6">{postData.description}</p>

      <form action={applyAction} className="flex flex-col">
        <label className="font-semibold mb-2">
          Introduction
          <textarea
            name="introText"
            required
            className="w-full mt-1 p-2 border rounded"
            placeholder="Tell us about yourself and why you’re a good fit"
          />
        </label>

        <label className="font-semibold mb-2">
          Portfolio URL
          <input
            type="url"
            name="portfolioUrl"
            className="w-full mt-1 p-2 border rounded"
            placeholder="https://your-portfolio.example.com"
          />
        </label>

        <button type="submit" className="mt-4 btn btn-primary">
          Submit Application
        </button>
      </form>
    </div>
  );
}
