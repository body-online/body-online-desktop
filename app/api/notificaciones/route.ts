import { getPendingMeasures } from "@/data/pending-measures";

export async function GET(request: Request) {
 try {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") ?? undefined;
  const page = searchParams.get("page") ?? undefined;

  const { data, error } = await getPendingMeasures({
   page,
   limit,
   name: searchParams.get("name") ?? undefined,
  });
  if (error)
   return Response.json({
    error: "Ha ocurrido un error al encontrar las notificaciones",
   });

  return Response.json(data);
 } catch (error) {
  console.log(error);
  return Response.json({
   error: "Ha ocurrido un error al encontrar las notificaciones",
  });
 }
}
