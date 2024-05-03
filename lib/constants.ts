// á é í ó ú
import { ExtendedUser } from "@/next-auth";
import { NavigationItemProps } from "./types";

// general constants
export const navigationItems: Array<NavigationItemProps> = [
 //  {
 //   href: "/",
 //   title: "Home",
 //  },
];
export const countries = ["Argentina"];
export const eventTypesList = [
 {
  label: "Medición corporal",
  allowedStates: ["not_pregnant", "pregnant"],
  value: "body_measure",
 },
 {
  label: "Servicio",
  allowedStates: ["not_pregnant"],
  value: "pregnant",
 },
 {
  label: "Parto",
  allowedStates: ["pregnant"],
  value: "cattle_birth",
 },
 {
  label: "No preñez",
  allowedStates: ["pregnant"],
  value: "not_pregnant",
 },
 {
  label: "Muerte",
  allowedStates: ["not_pregnant"],
  value: "death",
 },
];
export const detailsByEvent = {
 body_measure: [
  //   { label: "0", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
  { label: "11", value: 11 },
  { label: "12", value: 12 },
  { label: "13", value: 13 },
  { label: "14", value: 14 },
  { label: "15", value: 15 },
  { label: "16", value: 16 },
  { label: "17", value: 17 },
  { label: "18", value: 18 },
  { label: "19", value: 19 },
  { label: "20", value: 20 },
  { label: "21", value: 21 },
  { label: "22", value: 22 },
  { label: "23", value: 23 },
  { label: "24", value: 24 },
  { label: "25", value: 25 },
  { label: "26", value: 26 },
  { label: "27", value: 27 },
  { label: "28", value: 28 },
 ],
 not_pregnant: [
  { label: "Repite celo", value: "Repite celo" },
  { label: "Aborto", value: "Aborto" },
  { label: "Fea linea materna", value: "Fea linea materna" },
  { label: "Condición corporal", value: "Condición corporal" },
  { label: "Otro", value: "Otro" },
 ],
 death: [
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
 //  cattle_birth: [""],
 //  pregnant: [""],
};

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
   duration: 0.1,
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
