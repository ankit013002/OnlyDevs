import { ContactType } from "@/app/components/applicationCard";
import InsertApplicationStatusIntoDB from "@/db/insertApplicationStatusIntoDB";
import { InsertApplicationStatus } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.json();

  const { postId, applicationId, status, contactMethod, postUser } = formData;

  console.log(postId);
  console.log(applicationId);
  console.log(status);
  console.log(contactMethod);
  console.log(postUser);

  const contactLink = postUser.contact.find(
    (contact: ContactType) => contact.type === contactMethod
  )?.link;

  if (!contactLink) {
    return NextResponse.json({
      status: 404,
      error: "No existing link for mode of contact",
    });
  }

  const payload: InsertApplicationStatus = {
    postId: postId,
    applicationId: applicationId,
    status: status,
    contactMethod: {
      type: contactMethod,
      link: contactLink,
    },
  };
  try {
    const res = await InsertApplicationStatusIntoDB(payload);
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
