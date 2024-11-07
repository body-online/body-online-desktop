"use server";

import axios from "axios";
import { EventProps } from "@/lib/types";
import { currentFarm, currentUser } from "@/lib/auth";

export async function getEvents({
 page,
 limit,
 caravan,
}: {
 page: number;
 limit: number;
 caravan?: string;
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

  const { data } = await axios({
   url: `${process.env.API_URL}/api/ranchi/event/farm/get/${farmId}`,
   method: "get",
   params: { page, limit, caravan },
  });

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

export async function getHistoricalEvents({
 cattleId,
}: {
 cattleId: string;
}): Promise<{
 error?: string;
 data?: {
  events: EventProps[];
  totalPages: number;
  totalEvents: number;
 };
}> {
 try {
  const user = await currentUser();

  if (!user?.farmId) {
   return { error: "Error de permisos" };
  }
  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/event/${cattleId}/${user?.farmId}`
  );

  const sortedData = data?.sort((a: EventProps, b: EventProps) => {
   // Turn your strings into dates, and then subtract them
   // to get a value that is either negative, positive, or zero.
   return (new Date(b?.eventDate) as any) - (new Date(a?.eventDate) as any);
  });

  return { data: sortedData };
 } catch (error) {
  console.log(error);

  return { error: "Ha ocurrido un error al encontrar el historial" };
 }
}
