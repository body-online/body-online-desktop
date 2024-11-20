"use server";

import { currentUser } from "@/lib/auth";
import { CreateTaskSchema } from "@/lib/types";
import axios from "axios";

export const createTask = async (data: CreateTaskSchema) => {
 try {
  const user = await currentUser();

  if (user?.type != "owner") return { error: "Error de permisos" };
  if (!user?.farmId) return { error: "No hemos encontrado organización" };

  const { data: response } = await axios({
   method: "POST",
   url: `${process.env.API_URL}/ranchi/task`,
   data: {
    ...data,
    taskType: "body_measure",
    farmId: user.farmId,
   },
  });

  return { data: response };
 } catch (err: any) {
  return {
   error:
    err?.response?.data?.message ?? "Ha ocurrido un error al crear la tarea",
  };
 }
};
