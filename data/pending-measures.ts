"use server";

import axios from "axios";
import { PendingMeasureProps } from "@/lib/types";
import { currentFarm } from "@/lib/auth";

export async function getPendingMeasures(): Promise<{
 error?: string;
 data?: PendingMeasureProps[];
}> {
 try {
  const farm = await currentFarm();
  if (!farm) return { error: "No hemos encontrado organización" };

  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/notification/${farm}`
  );

  return {
   data: data.map((doc: any) => {
    return doc?.["_doc"];
   }),
  };
 } catch (error: any) {
  console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un error al buscar las mediciones pendientes.",
  };
 }
}
