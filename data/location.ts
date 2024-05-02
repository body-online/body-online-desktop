"use server";

import axios from "axios";
import { LocationProps } from "@/lib/types";
import { currentUser } from "@/lib/auth";

export async function getAllLocations(): Promise<{
 error?: string;
 data?: LocationProps[];
}> {
 try {
  const user = await currentUser();

  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/location/${user?.farmId}`
  );

  return { data };
 } catch (error: any) {
  // console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un erorr al buscar las ubicaciones.",
  };
 }
}
