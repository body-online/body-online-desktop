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
}: {
 name?: string;
 page?: number;
 limit?: number;
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

  const params = { page, limit, name };
  const { data } = await axios({
   method: "GET",
   url: `${process.env.API_URL}/api/ranchi/cattle/${farmId}`,
   params: { page: params?.page, limit: params?.limit },
   data: { caravan: params?.name },
  });

  return { data };
 } catch (error: any) {
  console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un error al buscar los individuos.",
  };
 }
}

// export async function getAllCattles(): Promise<{
//  error?: string;
//  data?: CattleProps[];
// }> {
//  try {
//   const filteredCattles: CattleProps[] = [];
//   const farm = await currentFarm();
//   if (!farm) return { error: "No hemos encontrado organización" };

//   const { data } = await axios.get(
//    `${process.env.API_URL}/api/ranchi/cattle/${farm}`
//   );
//   // console.log(`getting ${data?.length} cattles for ${farm}`);

//   data.map((obj: CattleProps) => {
//    const notDeleted = obj.createdAt == obj.updatedAt;

//    if (notDeleted) {
//     filteredCattles.push({
//      ...obj,
//      state: obj.state == "" || obj.state == null ? "not_pregnant" : obj.state,
//     });
//    }
//   });

//   return { data: filteredCattles };
//  } catch (error: any) {
//   console.log(error);
//   return {
//    error:
//     error?.response?.data?.message ??
//     "Ha ocurrido un erorr al buscar las genéticas.",
//   };
//  }
// }
