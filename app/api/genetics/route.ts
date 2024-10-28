import { getGenetics } from "@/data/genetic";

export async function GET(request: Request) {
 try {
  const { data, error } = await getGenetics();

  if (error)
   return Response.json({
    error: "Ha ocurrido un error al encontrar las ubicaciones",
   });

  return Response.json(data);
 } catch (error) {
  console.log(error);
  return Response.json({
   error: "Ha ocurrido un error al encontrar las ubicaciones",
  });
 }
}
