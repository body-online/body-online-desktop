"use server";

import { currentUser } from "@/lib/auth";
import { GeneticSchema } from "../lib/types";
import axios from "axios";

export async function createGenetic(genetic: GeneticSchema): Promise<{
 data?: string;
 error?: string;
}> {
 try {
  const user = await currentUser();

  if (!user?.farmId || !genetic?.name)
   return {
    error: "Error al encontrar la organización",
   };

  await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/genetic`,
   data: {
    name: genetic.name,
    description: genetic.description,
    bodyRanges: [genetic.minRange, genetic?.maxRange],
    farmId: user.farmId,
   },
  });

  return { data: "Genética creada correctamente" };
 } catch (err: any) {
  console.log(err?.response?.data);
  return {
   error:
    err?.response?.data?.message ?? "Ha ocurrido un error al crear la genética",
  };
 }
}
export async function deleteGenetic(
 geneticId: string
): Promise<{ error?: string; data?: string }> {
 try {
  const { data } = await axios({
   method: "patch",
   url: `${process.env.API_URL}/api/ranchi/genetic/delete/${geneticId}`,
  });
  console.log(data);

  return { data: "success" };
 } catch (err: any) {
  const errorMessage: string =
   err?.message ??
   err?.response?.data?.message ??
   `Ha ocurrido un error al eliminar la genética`;

  return { error: errorMessage };
 }
}
