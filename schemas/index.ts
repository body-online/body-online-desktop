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
