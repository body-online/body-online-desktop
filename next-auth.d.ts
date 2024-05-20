import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
 id: string;
 type: "owner" | "user";
 farmId?: string;
 minIdeal?: string;
 maxIdeal?: string;
};

declare module "next-auth" {
 interface Session {
  user: ExtendedUser;
 }
}

export type OriginalJWT = JWT;

declare module "next-auth/jwt" {
 interface JWT extends OriginalJWT {
  type: "owner" | "user";
  farmId?: string;
  id?: string;
  minIdeal?: string;
  maxIdeal?: string;
 }
}
