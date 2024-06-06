"use server";

import axios from "axios";
import { GeneticProps } from "@/lib/types";
import { currentUser } from "@/lib/auth";

export async function getGenetics(): Promise<{
 error?: string;
 data?: GeneticProps[];
}> {
 try {
  const user = await currentUser();

  if (!user?.farmId) return { error: "No hemos encontrado su organización" };

  const { data } = await axios({
   method: "GET",
   url: `${process.env.API_URL}/api/ranchi/genetic/${user.farmId}`,
  });
  return { data };
 } catch (error: any) {
  // console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un error al buscar las genéticas.",
  };
 }
}
