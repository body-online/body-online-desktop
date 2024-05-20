"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import axios from "axios";

export async function registerUser(values: z.infer<typeof RegisterSchema>) {
 const validatedFields = RegisterSchema.safeParse(values);
 if (!validatedFields.success) return { error: "Campos inválidos" };

 const { email, password, name } = validatedFields.data;
 const hashedPassword = await bcrypt.hash(password, 10);

 const newUser = {
  email: email,
  name,
  type: "owner",
  password: hashedPassword,
 };

 try {
  // insert and send the verification token via email
  const { data } = await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/user`,
   data: newUser,
  });
  if (data.error)
   return { error: "Ha ocurrido un error al registar el usuario" };
 } catch (error: any) {
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un error al registar el usuario",
  };
 }

 return { success: "Usuario registrado con éxito" };
}
