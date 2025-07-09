import InsertPost from "@/db/insertPosting";
import retrieveUser from "@/db/retrieveUser";
import { InsertPosting } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.json();

  const user = await retrieveUser(formData.username);

  const postData: InsertPosting = {
    ownerId: user.id,
    title: formData.title,
    description: formData.description,
    techTags: formData.techTags,
    rolesNeeded: formData.rolesNeeded,
    status: formData.status,
  };

  try {
    await InsertPost(postData);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Unknown server error" },
        { status: 500 }
      );
    }
  }
}
