// á é í ó ú
import { NavigationItemProps } from "./types";

// general constants
export const navigationItems: Array<NavigationItemProps> = [
 {
  href: "/",
  title: "Inicio",
 },
 {
  href: "/individuos",
  title: "Individuos",
 },
 {
  href: "/tareas",
  title: "Tareas",
 },
];

export const provinces = [
 { label: "Buenos Aires", value: "Buenos Aires" },
 {
  label: "Ciudad Autónoma de Buenos Aires",
  value: "Ciudad Autónoma de Buenos Aires",
 },
 { label: "Catamarca", value: "Catamarca" },
 { label: "Chaco", value: "Chaco" },
 { label: "Chubut", value: "Chubut" },
 { label: "Córdoba", value: "Córdoba" },
 { label: "Corrientes", value: "Corrientes" },
 { label: "Entre Ríos", value: "Entre Ríos" },
 { label: "Formosa", value: "Formosa" },
 { label: "Jujuy", value: "Jujuy" },
 { label: "La Pampa", value: "La Pampa" },
 { label: "La Rioja", value: "La Rioja" },
 { label: "Mendoza", value: "Mendoza" },
 { label: "Misiones", value: "Misiones" },
 { label: "Neuquén", value: "Neuquén" },
 { label: "Río Negro", value: "Río Negro" },
 { label: "Salta", value: "Salta" },
 { label: "San Juan", value: "San Juan" },
 { label: "San Luis", value: "San Luis" },
 { label: "Santa Cruz", value: "Santa Cruz" },
 { label: "Santa Fe", value: "Santa Fe" },
 { label: "Santiago del Estero", value: "Santiago del Estero" },
 {
  label: "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
  value: "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
 },
 { label: "Tucumán", value: "Tucumán" },
];
export const countries = [{ label: "Argentina", value: "Argentina" }];
export const eventTypesList = [
 {
  label: "Servicio",
  value: "pregnant",
  disabledStates: ["dead", "maternity", "pregnant"],
 },
 {
  label: "Destete",
  value: "weaning",
  disabledStates: ["dead", "pregnant"],
  eventDetails: [
   { label: "1", value: "1" },
   { label: "2", value: "2" },
   { label: "3", value: "3" },
   { label: "4", value: "4" },
   { label: "5", value: "5" },
   { label: "6", value: "6" },
   { label: "7", value: "7" },
   { label: "8", value: "8" },
   { label: "9", value: "9" },
   { label: "10", value: "10" },
   { label: "11", value: "11" },
   { label: "12", value: "12" },
   { label: "13", value: "13" },
   { label: "14", value: "14" },
   { label: "15", value: "15" },
   { label: "16", value: "16" },
   { label: "17", value: "17" },
   { label: "18", value: "18" },
   { label: "19", value: "19" },
   { label: "20", value: "20" },
   { label: "21", value: "21" },
   { label: "22", value: "22" },
   { label: "23", value: "23" },
   { label: "24", value: "24" },
   { label: "25", value: "25" },
   { label: "26", value: "26" },
   { label: "27", value: "27" },
   { label: "28", value: "28" },
  ],
 },
 {
  label: "Medición",
  value: "body_measure",
  disabledStates: ["dead"],
  eventDetails: [
   { label: "1", value: "1" },
   { label: "2", value: "2" },
   { label: "3", value: "3" },
   { label: "4", value: "4" },
   { label: "5", value: "5" },
   { label: "6", value: "6" },
   { label: "7", value: "7" },
   { label: "8", value: "8" },
   { label: "9", value: "9" },
   { label: "10", value: "10" },
   { label: "11", value: "11" },
   { label: "12", value: "12" },
   { label: "13", value: "13" },
   { label: "14", value: "14" },
   { label: "15", value: "15" },
   { label: "16", value: "16" },
   { label: "17", value: "17" },
   { label: "18", value: "18" },
   { label: "19", value: "19" },
   { label: "20", value: "20" },
   { label: "21", value: "21" },
   { label: "22", value: "22" },
   { label: "23", value: "23" },
   { label: "24", value: "24" },
   { label: "25", value: "25" },
   { label: "26", value: "26" },
   { label: "27", value: "27" },
   { label: "28", value: "28" },
  ],
 },
 {
  label: "Parto",
  value: "cattle_birth",
  disabledStates: ["dead", "maternity", "empty"],
  eventDetails: [
   { label: "1", value: "1" },
   { label: "2", value: "2" },
   { label: "3", value: "3" },
   { label: "4", value: "4" },
   { label: "5", value: "5" },
   { label: "6", value: "6" },
   { label: "7", value: "7" },
   { label: "8", value: "8" },
   { label: "9", value: "9" },
   { label: "10", value: "10" },
   { label: "11", value: "11" },
   { label: "12", value: "12" },
   { label: "13", value: "13" },
   { label: "14", value: "14" },
   { label: "15", value: "15" },
   { label: "16", value: "16" },
   { label: "17", value: "17" },
   { label: "18", value: "18" },
   { label: "19", value: "19" },
   { label: "20", value: "20" },
   { label: "21", value: "21" },
   { label: "22", value: "22" },
   { label: "23", value: "23" },
   { label: "24", value: "24" },
   { label: "25", value: "25" },
   { label: "26", value: "26" },
   { label: "27", value: "27" },
   { label: "28", value: "28" },
  ],
 },
 {
  label: "No preñez",
  value: "not_pregnant",
  disabledStates: ["dead", "empty", "maternity"],
  eventDetails: [
   { label: "Repite celo", value: "Repite celo" },
   { label: "Aborto", value: "Aborto" },
   { label: "Fea linea materna", value: "Fea linea materna" },
   { label: "Condición corporal", value: "Condición corporal" },
   { label: "Otro", value: "Otro" },
  ],
 },
 {
  label: "Muerte",
  value: "death",
  disabledStates: ["dead"],
  eventDetails: [
   { label: "Prolapso de órgano pélvico", value: "Prolapso de órgano pélvico" },
   { label: "Súbita", value: "Súbita" },
   { label: "Sacrificada", value: "Sacrificada" },
   { label: "Descarte", value: "Descarte" },
   {
    label: "Secrecion purulenta abundante",
    value: "Secrecion purulenta abundante",
   },
   { label: "Otro", value: "Otro" },
  ],
 },
];

// animation keyframes
export const enterDropdown = {
 hidden: {
  //   scale: 0.98,
  y: 2,
  opacity: 0,
 },
 visible: {
  opacity: 1,
  //   scale: 1,
  y: 0,
  transition: {
   duration: 0.1,
  },
 },
 exit: {
  //   scale: 0.98,
  y: 2,
  opacity: 0,
  transition: {
   duration: 0.2,
  },
 },
};
export const enterModal = {
 hidden: {
  scale: 0.98,
  y: 3,
  opacity: 0,
 },
 visible: {
  opacity: 1,
  scale: 1,
  y: 0,
  transition: {
   duration: 0.2,
  },
 },
 exit: {
  scale: 0.98,
  y: 3,
  opacity: 0,
  transition: {
   duration: 0.2,
  },
 },
};
export const modalBackground = {
 hidden: {
  opacity: 0,
 },
 visible: {
  y: 0,
  opacity: 1,
  transition: {
   duration: 0.2,
   type: "ease-in",
  },
 },
 exit: {
  opacity: 0,
  transition: {
   delay: 0,
   duration: 0.2,
   type: "ease-out",
  },
 },
};
export const swipeCard = {
 hidden: {
  y: "10vh",
 },
 visible: {
  y: 0,
  transition: {
   delay: 0,
   duration: 0.2,
   type: "ease-out",
  },
 },
 exit: {
  y: "10vh",
 },
};
