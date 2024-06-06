"use server";

import { currentUser } from "@/lib/auth";
import { FarmSchema } from "@/lib/types";
import axios from "axios";

export async function createFarm(farm: FarmSchema): Promise<{
 data?: string;
 error?: string;
}> {
 try {
  const user = await currentUser();
  if (!user?.id) return { error: "Sesión inválida" };

  await axios({
   method: "post",
   url: `${process.env.API_URL}/api/ranchi/farm`,
   data: {
    ...farm,
    userId: user.id,
   },
  });

  return { data: "Individuo creado correctamente" };
 } catch (err: any) {
  console.log(err);
  return {
   error:
    err?.response?.data?.message ??
    "Ha ocurrido un error al cargar la información",
  };
 }
}

// export async function getFarm(farmId: string): Promise<{
//   data?: string;
//   error?: string;
// }> {
//   try {
//     if (!farmId) return { error: "Sesión inválida" };

//     const { data: farms } = await axios({
//       method: "get",
//       url: `${process.env.API_URL}/api/ranchi/farm`,
//     });

//     if (!farms || farms.length <= 0) return { data: null };
//     const existentFarm = farms.filter((farm) => {
//       return farm._id == farmId
//     })

//     return { data:  };
//   } catch (err: any) {
//     console.log(err);
//     return {
//       error:
//         err?.response?.data?.message ??
//         "Ha ocurrido un error en el servidor al buscar las organizacións",
//     };
//   }
// }
