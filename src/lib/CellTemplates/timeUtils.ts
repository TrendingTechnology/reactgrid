export const getTimestamp = (time: string, defaultDate: string = '01-01-1970'): number => Date.parse(`${defaultDate} ${time}`);

export const getFormattedTimeUnit = (timeUnit: number): string => timeUnit.toString().padStart(2, '0');