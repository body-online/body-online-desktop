"use server";

import axios from "axios";
import { PendingMeasureProps } from "@/lib/types";
import { currentFarm } from "@/lib/auth";

export async function getPendingMeasures({
 name,
 page,
 limit,
}: {
 name?: string;
 page?: string;
 limit?: string;
}): Promise<{
 error?: string;
 data?: {
  totalNotifications: number;
  totalPages: number;
  notifications: PendingMeasureProps[];
 };
}> {
 try {
  const farmId = await currentFarm();

  if (!farmId) return { error: "No hemos encontrado su organización" };
  const params = { page, limit, name };

  const {
   data: { notifications, totalPages, totalNotifications },
  } = await axios({
   method: "GET",
   url: `${process.env.API_URL}/api/ranchi/notification/${farmId}`,
   params: { page: params?.page, limit: params?.limit },
   data: { name: params?.name },
  });

  var parsedNotifications: PendingMeasureProps[] = [];
  notifications?.map((doc: any) => {
   parsedNotifications.push({
    ...doc?.["_doc"],
    isExpired: doc?.isExpired,
    cattleId: doc?.["_doc"].cattleId?.["_id"],
    caravan: doc?.["_doc"]?.cattleId?.caravan,
   });
  });

  return {
   data: { notifications: parsedNotifications, totalPages, totalNotifications },
  };
  // return { data };
 } catch (error: any) {
  console.log(error);
  return {
   error:
    error?.response?.data?.message ??
    "Ha ocurrido un error al buscar los individuos.",
  };
 }
}
