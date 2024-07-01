"use server";

import axios from "axios";
import { PendingMeasureProps } from "@/lib/types";
import { currentFarm } from "@/lib/auth";

export async function getNotifications({ page, limit }: {
  page: number; limit: number;
}): Promise<{
  data?: {
    totalNotifications: number;
    totalPages: number | null;
    notifications: PendingMeasureProps[];
  };
  error?: string;
}> {
  try {
    const farmId = await currentFarm();

    if (!farmId) return { error: "No hemos encontrado su organización" };
    
    const { data } = await axios({
      method: "GET",
      url: `${process.env.API_URL}/api/ranchi/notification/${farmId}`,
      params: { page, limit },
    });

    data.notifications = data?.notifications.map((doc: any) => {
      return (
        {
          ...doc?.["_doc"],
          isExpired: doc?.isExpired,
          cattleId: doc?.["_doc"].cattleId?.["_id"],
          caravan: doc?.["_doc"]?.cattleId?.caravan,
        }
      );
    });

    console.log(`page ${page} of notifications`)
    console.log(`${data?.notifications?.length} of ${data?.totalNotifications} results`)
    console.log(`${data?.totalPages} pages`)


    return { data };
  } catch (error: any) {
    console.log(error);
    return {
      error:
        error?.response?.data?.message ??
        "Ha ocurrido un error al buscar las notificaciones.",
    };
  }
}
