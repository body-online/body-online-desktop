"use server";

import axios from "axios";
import { EventProps } from "@/lib/types";
import { currentFarm } from "@/lib/auth";

export async function getEvents({
 page,
 limit,
}: {
 page: number;
 limit: number;
}): Promise<{
 error?: string;
 data?: {
  events: EventProps[];
  totalPages: number;
  totalEvents: number;
 };
}> {
 try {
  const farmId = await currentFarm();

  if (!farmId) return { error: "No hemos encontrado su organización" };

  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/event/farm/get/${farmId}`,
   { params: { page, limit } }
  );

  console.log("eventos:::");
  console.log(data?.totalEvents);

  return { data };
 } catch (error: any) {
  console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un error al buscar los eventos de la organización.",
  };
 }
}

// export async function getAllEvents(): Promise<{
//  error?: string;
//  data?: EventProps[];
// }> {
//  try {
//   const filteredEvents: EventProps[] = [];
//   const farm = await currentFarm();
//   if (!farm) return { error: "No hemos encontrado organización" };

//   const { data } = await axios.get(
//    `${process.env.API_URL}/api/ranchi/Event/${farm}`
//   );
//   // console.log(`getting ${data?.length} Events for ${farm}`);

//   data.map((obj: EventProps) => {
//    const notDeleted = obj.createdAt == obj.updatedAt;

//    if (notDeleted) {
//     filteredEvents.push({
//      ...obj,
//      state: obj.state == "" || obj.state == null ? "not_pregnant" : obj.state,
//     });
//    }
//   });

//   return { data: filteredEvents };
//  } catch (error: any) {
//   console.log(error);
//   return {
//    error:
//     error?.response?.data?.message ??
//     "Ha ocurrido un erorr al buscar las genéticas.",
//   };
//  }
// }
