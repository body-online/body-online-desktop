import { ExtendedUser } from "@/next-auth";
import { Props } from "react-select";
import { z } from "zod";

// cattle
export const createCattleSchema = z.object({
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
});

export enum CattleState {
 PREGNANT = "PREGNANT",
 EMPTY = "EMPTY",
 MATERNITY = "MATERNITY",
 DEAD = "DEAD",
}

export type CreateCattleSchema = z.infer<typeof createCattleSchema>;
export interface CattleProps {
 _id: string;
 creator: string;
 caravan: string;
 geneticId: {
  _id: string;
  name: string;
  description: string;
  farmId: string;
  bodyRanges: number[];
  deletedAt: string;
 };
 locationId: {
  _id: string;
  name: string;
  description: string;
  deletedAt: string;
  farmId: string;
 };
 createdAt: string;
 state: CattleState;
 stateDate?: string;
 bodyCondition: string;
 bodyRanges: number[];
 bodyConditionDate?: string;
 updatedAt: string;
 deletedAt: string;
}
export type MinifyCattleProps = {
 cattleId: string;
 bodyRanges: string;
 state: string;
 lastMeasureDate?: string;
 lastStateDate?: string;
 geneticName: string;
 locationName: string;
};
// genetic
export const geneticSchema = z.object({
 name: z
  .string({ required_error: "Nombre de la genética requerido" })
  .refine((value) => value != "", "Genética requerida!"),
 minRange: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
  message: "El campo debe ser numérico",
 }),
 maxRange: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
  message: "El campo debe ser numérico",
 }),
 description: z.string().optional(),
});
export type GeneticSchema = z.infer<typeof geneticSchema>;
export interface GeneticProps {
 _id: string;
 name: string;
 description: string;
 bodyRanges: string[];
 createdAt: string;
}

// location
export const locationSchema = z.object({
 name: z
  .string({ required_error: "Ubicación requerida!" })
  .refine((value) => value != "", "Ubicación requerida!"),
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
 eventDate: z.string().transform((str) => new Date(str)),
 eventType: z
  .string({ required_error: "Tipo de evento requerido!" })
  .refine((value) => value != "", "Tipo de evento requerido!"),
 eventDetail: z.string().optional(),
 observations: z.string().optional(),
 measure: z.number().min(1).max(28).optional(),
 taskId: z.string().optional(),
});
export type EventSchema = z.infer<typeof eventSchema>;

export interface EventInterface extends EventSchema {
 _id: string;
 caravan: string;
 user: string;
 userType: string;
 bodyRanges: number[];
}

// task
export const createTaskSchema = z.object({
 expirationDate: z.string().transform((str) => new Date(str)),
 message: z.string().optional(),
 caravan: z.array(z.string()),
 cattleIds: z.array(z.string()),
 assignedTo: z.array(z.string()),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

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
 cattleAmount: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
  message: "El campo debe ser numérico",
 }),
});
export type FarmSchema = z.infer<typeof farmSchema>;

// modal
export type ModalProps = {
 handleClose?: () => void;
 children: React.ReactNode;
 isOpen: boolean;
 hideCloseBtn?: boolean;
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
 darkMode?: boolean;
 handleChange: Function;
}

export enum EventTypeEnum {
 MEASURE = "body_measure",
 NOT_PREGNTANT = "not_pregnant",
 CATTLE_BIRTH = "cattle_birth",
 PREGNANT = "pregnant",
 DEATH = "death",
 WEANING = "weaning",
}

export type TaskProps = {
 _id: string;
 expirationDate: Date;
 caravan: string[]; // Animales asociados a la tarea
 cattleIds: CattleProps[]; // Animales asociados a la tarea
 assignedTo: ExtendedUser[]; // IDs de usuarios asignados a la tarea
 taskType: EventTypeEnum;
 measuredCattles: string[]; // Animales ya medidos
 completed: boolean; // Indica si la tarea ha sido completada
};
export type PendingMeasureProps = {
 _id: string;
 taskId: string;
 expirationDate: Date;
 cattle: CattleProps;
};
