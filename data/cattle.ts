"use server";

import axios from "axios";
import { CattleProps } from "@/lib/types";
import { currentFarm } from "@/lib/auth";

export async function getAllCattles(): Promise<{
 error?: string;
 data?: CattleProps[];
}> {
 try {
  const filteredCattles: CattleProps[] = [];
  const farm = await currentFarm();
  if (!farm) return { error: "No hemos encontrado organización" };

  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/cattle/${farm}`
  );
  // console.log(`getting ${data?.length} cattles for ${farm}`);

  data.map((obj: CattleProps) => {
   const notDeleted = obj.createdAt == obj.updatedAt;

   if (notDeleted) {
    filteredCattles.push({
     ...obj,
     state: obj.state == "" || obj.state == null ? "not_pregnant" : obj.state,
    });
   }
  });

  return { data: filteredCattles };
 } catch (error: any) {
  console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un erorr al buscar las genéticas.",
  };
 }
}
