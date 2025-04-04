"use server";

import axios from "axios";
import { LocationProps } from "@/lib/types";
import { currentUser } from "@/lib/auth";

// Definir interfaces para mejor tipado
interface LocationParams {
 name?: string;
 page?: number;
 limit?: number;
}

interface LocationResponse {
 locations: LocationProps[];
 totalPages: number;
 totalLocations: number;
}

interface ApiResponse {
 error?: string;
 data?: LocationResponse;
}

export async function getLocations({
 name,
 page = 1,
 limit = 10,
}: LocationParams): Promise<ApiResponse> {
 try {
  const user = await currentUser();

  if (!user?.farmId) {
   return { error: "No hemos encontrado su organización" };
  }

  // Validar parámetros
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100;

  const params = {
   page,
   limit,
   ...(name && { name: name.trim() }), // Solo incluir name si existe y eliminar espacios
  };

  const { data } = await axios<LocationResponse>({
   method: "GET",
   url: `${process.env.API_URL}/api/ranchi/location/${user.farmId}`,
   params,
   headers: {
    "Content-Type": "application/json",
   },
  });
  console.log(data);

  return { data };
 } catch (error) {
  if (axios.isAxiosError(error)) {
   return {
    error:
     error.response?.data?.message ||
     "Ha ocurrido un error al buscar las ubicaciones.",
   };
  }

  return {
   error: "Ha ocurrido un error al buscar las ubicaciones.",
  };
 }
}
