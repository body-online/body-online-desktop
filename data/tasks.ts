"use server";

import { currentFarm, currentUser } from "@/lib/auth";
import { TaskProps } from "@/lib/types";
import { ExtendedUser } from "@/next-auth";
import axios from "axios";

export async function getTasks({
 page,
 limit,
 filterAssignedTo,
 dueSoon,
 completed,
 search,
}: {
 page: number;
 limit: number;
 filterAssignedTo?: string;
 dueSoon?: boolean;
 completed?: boolean;
 search?: string;
}): Promise<{
 error?: string;
 data?: {
  tasks: TaskProps[];
  totalTask: number;
  totalPages: number;
 };
}> {
 try {
  const user = await currentUser();
  if (!user?.farmId) return { error: "No hemos encontrado organización" };

  const { data } = await axios({
   method: "GET",
   url: `${process.env.API_URL}/ranchi/task/${user.farmId}`,
   params: {
    page,
    limit,
   },
   data: {
    caravan: search,
    assignedTo:
     filterAssignedTo?.length && filterAssignedTo.length >= 1
      ? filterAssignedTo
      : undefined,
    dueSoon,
    // completed,
   },
  });

  console.log(data);

  return { data };
 } catch (error) {
  console.log(error);
  return { error: "No hemos podido obtener las tareas" };
 }
}
