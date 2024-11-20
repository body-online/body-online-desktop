"use server";

import axios from "axios";
import { CattleProps } from "@/lib/types";
import { currentFarm, currentUser } from "@/lib/auth";

export async function getSingleCattle(id: string): Promise<{
 error?: string;
 data?: CattleProps;
}> {
 try {
  const farm = await currentFarm();
  if (!farm) return { error: "No hemos encontrado organización" };

  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/cattle/id/${id}`
  );

  return { data };
 } catch (error: any) {
  console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un erorr al buscar las genéticas.",
  };
 }
}

export async function getCattles({
 name,
 page,
 limit,
 state,
}: {
 name?: string;
 page?: number;
 limit?: number;
 state?: string[];
}): Promise<{
 error?: string;
 data?: {
  cattles: CattleProps[];
  totalPages: number;
  totalCattles: number;
 };
}> {
 try {
  const farmId = await currentFarm();
  if (!farmId) return { error: "No hemos encontrado su organización" };

  const { data } = await axios({
   method: "GET",
   url: `${process.env.API_URL}/api/ranchi/cattle/${farmId}`,
   params: { page, limit },
   data: { caravan: name, state },
  });

  const cattless = {
   ...data,
   cattles: data?.cattles?.map((cattle: CattleProps) => {
    return {
     ...cattle,
     state: ["PREGNANT", "EMPTY", "MATERNITY", "DEAD"].includes(
      cattle?.state.toUpperCase()
     )
      ? cattle?.state
      : "EMPTY",
    };
   }),
  };
  return {
   data: cattless,
  };
 } catch (error: any) {
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un error al buscar los individuos.",
  };
 }
}
