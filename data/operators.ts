"use server";

import { currentFarm, currentUser } from "@/lib/auth";
import { ExtendedUser } from "@/next-auth";
import axios from "axios";

export async function getOperators({
 page,
 limit,
 search,
}: {
 page: number;
 limit: number;
 search?: any;
}): Promise<{
 data?: {
  totalUsers: number;
  totalPages: number;
  users: ExtendedUser[];
 };
 error?: string;
}> {
 try {
  const farmId = await currentFarm();
  if (!farmId)
   return {
    error: "No hemos podido encontrar los usuarios",
   };

  const { data } = await axios({
   method: "get",
   url: `${process.env.API_URL}/api/ranchi/user/farm/${farmId}`,
   params: { page, limit },
   data: search,
  });

  data.users = data.users.map((user: any) => {
   return {
    ...user,
    id: user._id,
   };
  });

  return { data };
 } catch (error: any) {
  console.log(error);
  return {
   error:
    error?.response?.data?.message ?? "No hemos podido encontrar los usuarios",
  };
 }
}
