"use server";

import axios from "axios";
import { GeneticProps } from "@/lib/types";
import { currentUser } from "@/lib/auth";

export async function getAllGenetics(): Promise<{
  error?: string;
  data?: GeneticProps[];
}> {
  try {
    const user = await currentUser();

    const { data } = await axios.get(
      `${process.env.API_URL}/api/ranchi/genetic/${user?.farmId}`
    );

    return { data };
  } catch (error: any) {
    // console.log(error);
    return {
      error:
        error?.response?.data?.message ??
        "Ha ocurrido un erorr al buscar las genéticas.",
    };
  }
}
