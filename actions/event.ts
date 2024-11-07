"use server";

import { currentFarm, currentUser } from "@/lib/auth";
import { EventSchema } from "../lib/types";
import axios from "axios";

interface UpdateEventProps extends EventSchema {
 caravan?: string;
}
export async function createEvent(event: UpdateEventProps): Promise<{
 data?: string;
 error?: string;
}> {
 try {
  const user = await currentUser();

  if (!user?.farmId) return { error: "No hemos encontrado organización" };

  const { data } = await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/event`,
   data: {
    ...event,
    farmId: user.farmId,
    userId: user.id,
    userType: user.type,
   },
  });
  console.log(data);

  return { data };
 } catch (err: any) {
  console.log(err);
  return {
   error:
    err?.response?.data?.message ?? "Ha ocurrido un error al crear el evento",
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
