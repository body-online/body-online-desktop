"use server";

import { currentUser } from "@/lib/auth";
import { GeneticProps, GeneticSchema } from "../lib/types";
import axios from "axios";

export async function createGenetic(genetic: GeneticSchema): Promise<{
 data?: GeneticProps;
 error?: string;
}> {
 try {
  const user = await currentUser();

  if (user?.type != "owner") return { error: "Error de permisos" };
  if (!user?.farmId || !genetic?.name)
   return {
    error: "Error al encontrar la organización",
   };

  const { data } = await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/genetic`,
   data: {
    name: genetic.name,
    description: genetic.description,
    bodyRanges: [genetic.minRange, genetic?.maxRange],
    farmId: user.farmId,
   },
  });
  console.log(data);
  return { data };
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
  const user = await currentUser();

  if (user?.type != "owner") return { error: "Error de permisos" };
  const { data } = await axios({
   method: "patch",
   url: `${process.env.API_URL}/api/ranchi/genetic/delete/${geneticId}`,
  });

  return { data: "success" };
 } catch (err: any) {
  const errorMessage: string =
   err?.response?.data?.message ??
   err?.message ??
   `Ha ocurrido un error al eliminar la genética`;

  return { error: errorMessage };
 }
}
