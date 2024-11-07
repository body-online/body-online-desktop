"use server";

import axios from "axios";

export async function searchCities({
 country,
}: {
 country: string;
}): Promise<string[] | null> {
 try {
  const { data } = await axios({
   method: "post",
   url: "https://countriesnow.space/api/v0.1/countries/cities",
   data: { country: country.toLowerCase() },
  });

  return data.data;
 } catch (error) {
  console.log("error");
  return null;
 }
}
