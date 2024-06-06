import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getUserByEmail } from "./data/user";

export const {
 handlers: { GET, POST },
 auth,
 signIn,
 signOut,
} = NextAuth({
 pages: {
  signIn: "/auth/login",
  error: "/auth/error",
 },
 callbacks: {
  async session({ token, session }) {
   if (token?.farmId) session.user.farmId = token.farmId;
   if (token?.name) session.user.name = token.name;
   if (token?.type) session.user.type = token.type;
   if (token?.id) session.user.id = token.id;

   return session;
  },
  async jwt({ token }) {
   if (!token?.email) return token;

   const existingUser = await getUserByEmail(token.email);
   if (!existingUser) return null;

   token.id = existingUser?.id;
   token.farmId = existingUser?.farmId;
   token.type = existingUser?.type;
   token.name = existingUser?.name;

   return token;
  },
 },
 session: { strategy: "jwt" },
 ...authConfig,
});
