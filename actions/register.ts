"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import axios from "axios";
import { currentFarm } from "@/lib/auth";

export async function registerUser(values: z.infer<typeof RegisterSchema>) {
 const validatedFields = RegisterSchema.safeParse(values);
 if (!validatedFields.success) return { error: "Campos inválidos" };

 const { email, password, name } = validatedFields.data;
 const hashedPassword = await bcrypt.hash(password, 10);

 const newUser = {
  email: email,
  name,
  farmId: await currentFarm(),
  type: values?.type,
  password: hashedPassword,
 };

 try {
  // insert and send the verification token via email
  const { data } = await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/user`,
   data: newUser,
  });

  if (data?.error)
   return { error: "Ha ocurrido un error al registar el usuario" };

  return { data };
 } catch (error: any) {
  console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un error al registar el usuario",
  };
 }

 return { success: "Usuario registrado con éxito" };
}
