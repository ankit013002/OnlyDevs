import retrieveApplicationStatuses from "@/db/retrieveApplicationStatuses";
import retrieveUser from "@/db/retrieveUser";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  if (!username) {
    return NextResponse.json(
      { success: false, error: "User does not exist" },
      { status: 401 }
    );
  }
  const user = await retrieveUser(username);

  try {
    const applicationStatuses = await retrieveApplicationStatuses(user.id);
    console.log(applicationStatuses);
    return NextResponse.json({ success: true, data: applicationStatuses });
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
