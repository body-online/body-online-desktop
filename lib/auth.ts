import { auth } from "@/auth";

export const currentUser = async () => {
 const session = await auth();
 return session?.user;
};

export const currentFarm = async () => {
 const session = await auth();

 return session?.user?.farmId;
};
