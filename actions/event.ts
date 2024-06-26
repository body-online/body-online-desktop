"use server";

import { currentFarm } from "@/lib/auth";
import { EventSchema } from "../lib/types";
import axios from "axios";

export async function createEvent(event: EventSchema): Promise<{
 data?: string;
 error?: string;
}> {
 try {
  const farm = await currentFarm();
  if (!farm) return { error: "No hemos encontrado organización" };

  await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/event`,
   data: {
    ...event,
    farmId: farm,
   },
  });

  return { data: "Individuo creado correctamente" };
 } catch (err: any) {
  console.log(err);
  return {
   error:
    err?.response?.data?.message ??
    "Ha ocurrido un error al crear el individuo",
  };
 }
}
export async function deleteEvent(eventId: string): Promise<string> {
 return new Promise(async (res, rej) => {
  try {
   const { data } = await axios({
    method: "patch",
    url: `${process.env.API_URL}/api/ranchi/event/delete/${eventId}`,
   });
   //  console.log(data);
   // if (!data?.success) {
   //   const errorMessage = data?.message ?? "Error al eliminar el individuo";
   //   return rej(errorMessage);
   // }

   res("Individuo eliminado correctamente");
  } catch (err: any) {
   const errorMessage: string =
    err?.message ??
    err?.response?.data?.message ??
    `Ha ocurrido un error al eliminar el individuo`;

   return rej(errorMessage);
  }
 });
}
