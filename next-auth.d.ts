import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
 id: string;
 name: string;
 type: "owner" | "operator";
 farmId?: string;
 farmName?: string;
};

declare module "next-auth" {
 interface Session {
  user: ExtendedUser;
 }
}

export type OriginalJWT = JWT;

declare module "next-auth/jwt" {
 interface JWT extends OriginalJWT {
  type: "owner" | "operator";
  farmName?: string;
  farmId?: string;
  id?: string;
  name?: string;
 }
}
