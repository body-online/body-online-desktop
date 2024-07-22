import { getCattles } from "@/data/cattle";

export async function GET(request: Request) {
 try {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? undefined;
  const page = searchParams.get("page") ?? undefined;
  const limit = searchParams.get("limit") ?? undefined;

  const { data, error } = await getCattles({ page, limit, name });
  //   console.log(data);
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
