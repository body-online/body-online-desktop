"use server";

import { currentFarm } from "@/lib/auth";
import { CattleSchema } from "../lib/types";
import axios from "axios";

export async function createCattle(cattle: CattleSchema): Promise<{
 data?: string;
 error?: string;
}> {
 try {
  const farm = await currentFarm();
  if (!farm) return { error: "No hemos encontrado organización" };
  await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/cattle`,
   data: {
    ...cattle,
    farmId: farm,
   },
  });

  return { data: "Individuo creado correctamente" };
 } catch (err: any) {
  return {
   error:
    err?.response?.data?.message ??
    "Ha ocurrido un error al crear el individuo",
  };
 }
}
export async function deleteCattle(cattleId: string): Promise<{
 data?: string;
 error?: string;
}> {
 try {
  const { data } = await axios({
   method: "patch",
   url: `${process.env.API_URL}/api/ranchi/cattle/delete/${cattleId}`,
  });

  if (!data?.success) {
   const errorMessage = data?.message ?? "Error al eliminar el individuo";
   return { error: errorMessage };
  }

  return data;
 } catch (err: any) {
  const errorMessage: string =
   err?.message ??
   err?.response?.data?.message ??
   `Ha ocurrido un error al eliminar el individuo`;

  return { error: errorMessage };
 }
}
