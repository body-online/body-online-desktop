"use server";

import { currentUser } from "@/lib/auth";
import { ExtendedUser } from "@/next-auth";
import axios from "axios";

export async function getOperators({
 page,
 limit,
}: {
 page: number;
 limit: number;
}): Promise<{
 data?: {
  totalUsers: number;
  totalPages: number | null;
  users: ExtendedUser[];
 };
 error?: string;
}> {
 try {
  const user = await currentUser();
  const { data } = await axios({
   method: "get",
   url: `${process.env.API_URL}/api/ranchi/user/farm/${user?.farmId}`,
   params: { page, limit },
  });

  console.log("operators:::");
  console.log(data?.users?.length);

  return { data };
 } catch (error: any) {
  console.log(error);
  return {
   error:
    error?.response?.data?.message ?? "No hemos podido encontrar los usuarios",
  };
 }
}
