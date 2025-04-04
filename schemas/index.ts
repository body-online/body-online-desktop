import * as z from "zod";

export const LoginSchema = z.object({
 email: z.string().email({ message: "Email inválido." }),
 password: z.string().min(1, {
  message: "Campo requerido.",
 }),
});

export const RegisterSchema = z.object({
 email: z.string().email({ message: "Email inválido." }),
 password: z.string().min(8, {
  message: "Su contraseña debe ser de al menos 8 caracteres.",
 }),
 name: z.string().min(1, {
  message: "Campo requerido.",
 }),
 type: z.string().optional(),
});

export const GeneticSchema = z.object({
 name: z.string().min(1, {
  message: "El nombre es requerido",
 }),
 description: z.string().optional(),
 minRange: z.string().min(1, {
  message: "El rango mínimo es requerido",
 }),
 maxRange: z.string().min(1, {
  message: "El rango máximo es requerido",
 }),
});

export type GeneticSchema = z.infer<typeof GeneticSchema>;
