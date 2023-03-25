import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTHENTICATED_REDIRECTS = ["/sign-in*", "/sign-up*"];
const PRIVATE_REDIRECTS = ["/profile*"];

const urlMatches = (path: string, checks: string[]) => {
  return checks.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
};

export default withClerkMiddleware((req: NextRequest) => {
  const path = req.nextUrl.pathname;

  // No Redirect needed
  if (!urlMatches(path, [...AUTHENTICATED_REDIRECTS, ...PRIVATE_REDIRECTS]))
    return NextResponse.next();

  const { userId } = getAuth(req);

  // Unauthenticated user tries to hit private route
  if (!userId && urlMatches(path, PRIVATE_REDIRECTS)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // authenticated user tries to hit authentication routes
  if (userId && urlMatches(path, AUTHENTICATED_REDIRECTS)) {
    const profileUrl = new URL("/profile", req.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
});

// Stop Middleware running on static files
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};
