"use server";

import { currentFarm, currentUser } from "@/lib/auth";
import { PendingMeasureProps, TaskProps } from "@/lib/types";
import { ExtendedUser } from "@/next-auth";
import axios from "axios";

export async function getTasks({
 page,
 limit,
 assignedTo,
 dueSoon,
 completed,
 search,
}: {
 page: number;
 limit: number;
 assignedTo?: string[];
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
    assignedTo,
    dueSoon,
    // completed,
   },
  });

  return { data };
 } catch (error) {
  console.log(error);
  return { error: "No hemos podido obtener las tareas" };
 }
}

// fetch the user pending uncompleted taskss to save in oflline mode...
export async function getPendingMeasures() {
 try {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const { data: userTasks } = await getTasks({
   page: 1,
   limit: 50,
   assignedTo: [user.id],
   completed: false,
  });
  if (!userTasks) return [];

  // parse the tasks as "pending measures"
  const formattedTasks: PendingMeasureProps[] = [];
  userTasks?.tasks?.map((task, indexTask) => {
   const {
    _id: taskId,
    cattleIds: cattlesAssignedToThisTask,
    expirationDate,
    measuredCattles,
   } = task;
   // (cattlesIds is an array of the cattles assigned to this task)

   const notMeasuredCattles = cattlesAssignedToThisTask?.filter(
    (cattle) => !measuredCattles.includes(cattle.caravan)
   );

   // only not measured cattles are required to create pending measures
   return notMeasuredCattles?.map((cattle, indexCattle) => {
    const pendingMeasure: PendingMeasureProps = {
     _id: `PM-${taskId}-${cattle._id}-${indexTask}-${indexCattle}`,
     // id of the new pending measure as object of IndexDB (offline purpouses)
     expirationDate,
     taskId: taskId,
     cattle,
    };

    // # 3
    return formattedTasks.push(pendingMeasure);
   });
  });

  return formattedTasks;
 } catch (error: any) {
  console.log("Error: fetching pending measures");
  console.log(error);

  throw new Error(error?.response?.data?.message ?? "Unauthorized");
 }
}
