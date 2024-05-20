"use server";

import axios from "axios";
import { GeneticProps } from "@/lib/types";
import { currentFarm, currentUser } from "@/lib/auth";

export async function getAllGenetics(): Promise<{
 error?: string;
 data?: GeneticProps[];
}> {
 try {
  const farm = await currentFarm();
  if (!farm) return { error: "No hemos encontrado organización" };

  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/genetic/${farm}`
  );
  console.log(`getting ${data?.length} genetics for ${farm}`);

  return { data };
 } catch (error: any) {
  // console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un erorr al buscar las genéticas.",
  };
 }
}
