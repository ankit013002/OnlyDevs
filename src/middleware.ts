import { withAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export default withAuth(async (req) => {}, {
  publicPaths: ["/"],
});

export const config = {
  matcher: ["/((?!_next|api/auth|favicon.ico).*)"],
};
