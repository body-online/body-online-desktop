"use server";

import axios from "axios";
import { LocationProps } from "@/lib/types";
import { currentUser } from "@/lib/auth";

export async function getLocations({
 name,
 page,
 limit,
}: {
 name?: string;
 page?: number;
 limit?: number;
}): Promise<{
 error?: string;
 data?: {
  locations: LocationProps[];
  totalPages: number;
  totalLocations: number;
 };
}> {
 try {
  const user = await currentUser();

  if (!user?.farmId) return { error: "No hemos encontrado su organización" };
  const params = { page, limit, name };

  const { data } = await axios({
   method: "GET",
   url: `${process.env.API_URL}/api/ranchi/location/${user.farmId}`,
   params,
  });

  return { data };
 } catch (error: any) {
  // console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un error al buscar las ubicaciones.",
  };
 }
}
