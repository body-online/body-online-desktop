import { Props } from "react-select";
import { z } from "zod";

// cattle
export const cattleSchema = z.object({
 caravan: z
  .string({ required_error: "Caravana requerida!" })
  .refine((value) => value != "", "Caravana requerida!"),
 locationId: z
  .string({ required_error: "Ubicación requerida!" })
  .refine((value) => value != "", "Ubicación requerida!"),
 geneticId: z
  .string({ required_error: "Genética requerida!" })
  .refine((value) => value != "", "Genética requerida!"),
 defaultCicles: z
  .string()
  .refine((val) => !Number.isNaN(parseInt(val, 10)), {
   message: "El campo debe ser numérico",
  })
  .default("0"),
 // amount: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
 //   message: "El campo debe ser numérico",
 // }),
});
export type CattleSchema = z.infer<typeof cattleSchema>;
export interface CattleProps extends CattleSchema {
 _id: string;
 creator: string;
 geneticName: string;
 locationName: string;
 createdAt: string;
 state: string;
 bodyCondition: string;
 updatedAt: string;
 deletedAt: string;
}

// genetic
export const geneticSchema = z.object({
 name: z
  .string({ required_error: "Genética requerida!" })
  .refine((value) => value != "", "Genética requerida!"),
 description: z.string().optional(),
});
export type GeneticSchema = z.infer<typeof geneticSchema>;
export interface GeneticProps extends GeneticSchema {
 _id: string;
 createdAt: string;
}

// location
export const locationSchema = z.object({
 name: z
  .string({ required_error: "Genética requerida!" })
  .refine((value) => value != "", "Genética requerida!"),
 description: z.string().optional(),
});
export type LocationSchema = z.infer<typeof locationSchema>;
export interface LocationProps extends LocationSchema {
 _id: string;
 createdAt: string;
}

// event
export const eventSchema = z.object({
 cattleId: z
  .string({ required_error: "Caravana requerida!" })
  .refine((value) => value != "", "Caravana requerida!"),
 eventDate: z.coerce.date({
  errorMap: () => ({ message: "Fecha inválida!" }),
 }),
 eventType: z
  .string({ required_error: "Tipo de evento requerido!" })
  .refine((value) => value != "", "Tipo de evento requerido!"),
 eventDetail: z.string().optional(),
 observations: z.string().optional(),
 measure: z
  .string()
  .refine((val) => !Number.isNaN(parseInt(val, 10)), {
   message: "El campo debe ser numérico",
  })
  .optional(),
});
export type EventSchema = z.infer<typeof eventSchema>;
export type NewEventButtonProps = {
 cattle?: CattleProps;
};

// farm
export const farmSchema = z.object({
 name: z
  .string({ required_error: "Nombre de la organización requerido!" })
  .refine((value) => value != "", "Nombre de la organización requerido!"),
 country: z
  .string({ required_error: "País requerido!" })
  .refine((value) => value != "", "País requerido!"),
 city: z
  .string({ required_error: "Ciudad requerida!" })
  .refine((value) => value != "", "Ciudad requerida!"),
});
export type FarmSchema = z.infer<typeof farmSchema>;

// modal
export type ModalProps = {
 handleClose: Function;
 children: React.ReactNode;
 isOpen: boolean;
};
export type FormProps = { type: "create" | "edit" };

// navbar
export type NavigationItemProps = {
 title: string;
 href: string;
 selected?: boolean;
 handleClose?: Function;
};

// search select
export interface SelectInputSearchProps extends Props {
 label: string;
 error?: string;
 handleChange: Function;
}
