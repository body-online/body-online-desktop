export function parseDate(input: any) {
 var parts = input.match(/(\d+)/g);
 // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
 return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
}
