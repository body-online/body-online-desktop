"use server";

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export async function login(values: z.infer<typeof LoginSchema>) {
 const validatedFields = LoginSchema.safeParse(values);
 if (!validatedFields.success) return { error: "Campos inválidos" };

 const { email, password } = validatedFields.data;

 try {
  await signIn("credentials", {
   email,
   password,
   redirectTo: DEFAULT_LOGIN_REDIRECT,
  });
  return { success: "Credenciales válidas" };
 } catch (error) {
  if (error instanceof AuthError)
   switch (error.type) {
    case "CredentialsSignin":
     return { error: "Credenciales inválidas" };
    default:
     return { error: "Algo ha salido mal" };
   }

  throw error;
 }
}
