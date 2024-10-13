"use server";

import { currentUser } from "@/lib/auth";
import { LocationSchema } from "../lib/types";
import axios from "axios";

export async function createLocation(location: LocationSchema): Promise<{
 data?: string;
 error?: string;
}> {
 try {
  const user = await currentUser();

  if (user?.type != "owner") return { error: "Error de permisos" };
  if (!user?.farmId || !location?.name)
   return {
    error: "Error al encontrar la organización",
   };

  await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/location`,
   data: {
    name: location.name,
    description: location.description,
    farmId: user.farmId,
   },
  });

  return { data: "Ubicación creada correctamente" };
 } catch (err: any) {
  console.log(err?.response?.data);
  return {
   error:
    err?.response?.data?.message ??
    "Ha ocurrido un error al crear la ubicación",
  };
 }
}

export async function deleteLocation(
 locationId: string
): Promise<{ error?: string; data?: string }> {
 try {
  const user = await currentUser();

  if (user?.type != "owner") return { error: "Error de permisos" };
  const { data } = await axios({
   method: "patch",
   url: `${process.env.API_URL}/api/ranchi/location/delete/${locationId}`,
  });

  return { data: "success" };
 } catch (err: any) {
  const errorMessage: string =
   err?.response?.data?.message ??
   `Ha ocurrido un error al eliminar la ubicación`;

  return { error: errorMessage };
 }
}
