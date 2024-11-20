import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
 DEFAULT_LOGIN_REDIRECT,
 apiAuthPrefix,
 authRoutes,
 publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
 const { nextUrl, auth } = req;
 const isLoggedIn = !!auth;
 const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
 const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
 const isAuthRoute = authRoutes.includes(nextUrl.pathname);

 if (nextUrl.pathname === "/") {
  return;
 }

 if (isApiAuthRoute) {
  return;
 }

 if (isAuthRoute) {
  if (isLoggedIn) {
   return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }
  return;
 }

 if (!isLoggedIn && !isPublicRoute) {
  return Response.redirect(new URL("/auth/login", nextUrl));
 }

 return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
 matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
