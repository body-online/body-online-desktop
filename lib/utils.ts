import { eventTypesList } from "./constants";

export function dateDiffInDays(a: any, b: any) {
 const _MS_PER_DAY = 1000 * 60 * 60 * 24;
 // Discard the time and time-zone information.
 const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
 const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

 return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function serializeEventName(eventType: string) {
 return eventTypesList.find((value) => value.value === eventType)?.label ?? "-";
}
