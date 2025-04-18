"use server";

import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { ExtendedUser } from "@/next-auth";
import axios from "axios";
import { currentUser } from "@/lib/auth";

export async function getUserById(id: string): Promise<{
 error?: string;
 user?: ExtendedUser;
}> {
 try {
  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/user/${id}`
  );

  if (!data)
   return {
    error: "No hemos encontrado usuarios registrados con ese correo.",
   };

  return { user: data };
 } catch (error) {
  console.log(error);
  return { error: "Ha ocurrido un erorr al buscar su usuario." };
 }
}

export async function validateUser(
 values: z.infer<typeof LoginSchema>
): Promise<{ error?: string; user?: ExtendedUser }> {
 try {
  const {
   data: { user: existentUser },
  } = await axios.post(`${process.env.API_URL}/api/ranchi/user/login`, values);
  if (!existentUser) {
   return {
    error: "No hemos encontrado usuarios registrados con ese correo.",
   };
  }

  return {
   user: {
    id: existentUser._id,
    email: existentUser.email,
    type: existentUser?.type,
    name: existentUser.name,
   },
  };
 } catch (error) {
  console.log(error);
  return { error: "Ha ocurrido un error al validar su correo." };
 }
}

export async function getUserByEmail(
 email: string
): Promise<ExtendedUser | null> {
 try {
  const { data } = await axios({
   method: "get",
   url: `${process.env.API_URL}/api/ranchi/user/email/${email}`,
  });

  data.id = data?._id;
  data.name = data?.name;

  return data;
 } catch (error) {
  return null;
 }
}
