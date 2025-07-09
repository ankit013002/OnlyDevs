import postings from "@/db/postings";
import { SelectPosting } from "@/db/schema";
import { redirect } from "next/navigation";

interface PostPropsType {
  params: {
    slug: number;
  };
}

const page = async ({ params }: PostPropsType) => {
  const { slug } = await params;
  const postData = (await postings(slug)) as SelectPosting;

  if (!postData) {
    redirect("/");
  }

  return (
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
  );
};

export default page;
