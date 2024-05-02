import type { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";

import { LoginSchema } from "@/schemas";
import { validateUser } from "./data/user";

export default {
  providers: [
    credentials({
      async authorize(userCredentials) {
        const validatedFields = LoginSchema.safeParse(userCredentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // validate the user credentials
          const { user, error } = await validateUser({
            email,
            password,
          });

          if (!user || error) return null;
          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
