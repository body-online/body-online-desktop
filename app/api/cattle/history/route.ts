import { currentFarm } from "@/lib/auth";
import { EventProps } from "@/lib/types";
import axios from "axios";

export async function GET(request: Request) {
 try {
  const farm = await currentFarm();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const { data } = await axios.get(
   `${process.env.API_URL}/api/ranchi/event/${id}/${farm}`
  );

  const sortedData = data.sort((a: EventProps, b: EventProps) => {
   // Turn your strings into dates, and then subtract them
   // to get a value that is either negative, positive, or zero.
   return (new Date(b.eventDate) as any) - (new Date(a.eventDate) as any);
  });

  return Response.json(sortedData);
 } catch (error) {
  console.log(error);
 }
}
