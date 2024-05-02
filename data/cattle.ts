"use server";

import axios from "axios";
import { CattleProps } from "@/lib/types";
import { currentFarm } from "@/lib/auth";

export async function getAllCattles(): Promise<{
 error?: string;
 data?: CattleProps[];
}> {
 try {
  const farm = await currentFarm();
  if (!farm) return { error: "No hemos encontrado organización" };

  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/cattle/${farm}`
  );

  return {
   data: data.filter((obj: CattleProps) => obj.createdAt == obj.updatedAt),
  };
 } catch (error: any) {
  // console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un erorr al buscar las genéticas.",
  };
 }
}
