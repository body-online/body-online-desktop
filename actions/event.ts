"use server";

import axios from "axios";

import { EventInterface, EventSchema } from "@/lib/types";
import { currentUser } from "@/lib/auth";

interface UpdateEventInterface extends EventSchema {
 caravan?: string;
}
export async function createEvent(event: UpdateEventInterface): Promise<{
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

  return { data };
 } catch (err: any) {
  console.log(err);
  return {
   error:
    err?.response?.data?.message ?? "Ha ocurrido un error al crear el evento",
  };
 }
}

export async function uploadEventList({
 events,
}: {
 events: EventSchema[];
}): Promise<{
 uploadResults?: { events: EventInterface[]; errors: EventInterface[] };
 error?: string;
}> {
 try {
  if (!events.length) return { uploadResults: { events: [], errors: [] } };

  const user = await currentUser();

  if (!user?.farmId) return { error: "No hemos encontrado organización" };
  const formattedEvents = events?.map((i) => {
   return {
    cattleId: i.cattleId,
    eventDate: i.eventDate,
    eventType: i.eventType,
    eventDetail: i.eventDetail,
    measure: i.measure,
    taskId: i.taskId,
    userId: user.id,
    farmId: user.farmId,
   };
  });

  const { data }: any = await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/event/massive`,
   data: formattedEvents,
  });

  return { uploadResults: data };
 } catch (err: any) {
  console.log(err);
  return {
   error: "Ha ocurrido un error al cargar los eventos",
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
