import ApplicationCard from "@/app/components/applicationCard";
import { db } from "@/db/database";
import postings from "@/db/postings";
import retrieveApplicationsByPostId, {
  ApplicationWithUser,
} from "@/db/retrieveApplicationsByPostId";
import retrieveUser from "@/db/retrieveUser";
import { applicationsTable, SelectPosting } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PostPropsType {
  params: {
    slug: number;
  };
}

const page = async ({ params }: PostPropsType) => {
  const { slug } = await params;
  const postData = (await postings(slug)) as SelectPosting;
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!postData || !kindeUser?.username) redirect("/");

  const user = await retrieveUser(kindeUser.username);
  let applications: ApplicationWithUser[] = [];
  const isOwner = postData.ownerId === user.id;
  if (isOwner) {
    applications = await retrieveApplicationsByPostId(postData.id);
  } else {
    const already = await db
      .selectDistinct()
      .from(applicationsTable)
      .where(
        sql`${applicationsTable.postId} = ${postData.id} and ${applicationsTable.applicantId} = ${user.id}`
      );
    const userAlreadyApplied = already.length > 0;
    console.log(userAlreadyApplied);
    return (
      <div className="max-w-3xl mx-auto p-6 h-full min-h-[100vh]">
        <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
        <p className="text-gray-700 mb-6">{postData.description}</p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <div>
            <span className="font-semibold">Roles Needed:</span>{" "}
            {postData.rolesNeeded}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`capitalize ${
                postData.status === "open"
                  ? "text-green-600"
                  : postData.status === "in_progress"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {postData.status.replace("_", " ")}
            </span>
          </div>
          <div>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(postData.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Updated At:</span>{" "}
            {new Date(postData.updatedAt).toLocaleString()}
          </div>
        </div>

        <div className="mb-4">
          <span className="font-semibold">Tech Tags:</span>{" "}
          {postData.techTags.map((tag, i) => (
            <span
              key={i}
              className="inline-block bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="px-6">
          {userAlreadyApplied ? (
            <p className="italic text-gray-500">You have already applied.</p>
          ) : (
            <Link
              href={{
                pathname: "/application",
                query: { postId: postData.id },
              }}
              className="btn btn-secondary"
            >
              Apply
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[100vh]">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
        <p className="text-gray-700 mb-6">{postData.description}</p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <div>
            <span className="font-semibold">Roles Needed:</span>{" "}
            {postData.rolesNeeded}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`capitalize ${
                postData.status === "open"
                  ? "text-green-600"
                  : postData.status === "in_progress"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {postData.status.replace("_", " ")}
            </span>
          </div>
          <div>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(postData.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Updated At:</span>{" "}
            {new Date(postData.updatedAt).toLocaleString()}
          </div>
        </div>

        <div className="mb-4">
          <span className="font-semibold">Tech Tags:</span>{" "}
          {postData.techTags.map((tag, i) => (
            <span
              key={i}
              className="inline-block bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6 justify-self-center">
          Applications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app: ApplicationWithUser) => (
            <div className="relative" key={app.applications_table.id}>
              <ApplicationCard application={app} currUser={user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
