// app/api/events/route.ts
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// Definir el esquema de validación para los query params con Zod
const querySchema = z.object({
 farmId: z.string().min(1, "Farm ID es requerido"),
 page: z.number().optional().default(1),
 limit: z.number().optional().default(10),
 caravan: z.string().optional(),
 eventType: z
  .enum([
   "body_measure",
   "not_pregnant",
   "cattle_birth",
   "pregnant",
   "death",
   "weaning",
  ])
  .optional(),
 creator: z.string().optional(),
 startDate: z
  .string()
  .optional()
  .transform((str) => (str ? new Date(str) : undefined)),
 endDate: z
  .string()
  .optional()
  .transform((str) => (str ? new Date(str) : undefined)),
});

export async function GET(req: NextRequest) {
 try {
  // Parsear y validar los query params
  const searchParams = new URL(req.url).searchParams;
  const query = Object.fromEntries(searchParams.entries());
  const validatedQuery = querySchema.parse({
   ...query,
   page: query.page ? parseInt(query.page as string, 10) : 1,
   limit: query.limit ? parseInt(query.limit as string, 10) : 10,
  });

  // Construir la URL para el backend (asumiendo que tu backend está en una API externa)
  const backendUrl = `${process.env.BACKEND_URL}/farm/get/${validatedQuery.farmId}`;
  const response = await fetch(backendUrl, {
   method: "GET",
   headers: {
    "Content-Type": "application/json",
   },
  });

  if (!response.ok) {
   throw new Error("Error al consultar los eventos");
  }

  const data = await response.json();
  return NextResponse.json(data);
 } catch (error) {
  if (error instanceof z.ZodError) {
   return NextResponse.json({ error: error.errors }, { status: 400 });
  }
  return NextResponse.json(
   { error: "Error interno al procesar la solicitud" },
   { status: 500 }
  );
 }
}
