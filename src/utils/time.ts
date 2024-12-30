export const posixTimeByHoursFromNow = (hours: number): number => {
  if (!Number.isFinite(hours)) {
    throw new Error("Hours must be a finite number");
  }

  if (hours < 0) {
    throw new Error("Hours cannot be negative");
  }

  const millisPerHour = 60 * 60 * 1000;
  return Date.now() + hours * millisPerHour;
};

export const formatPosixTime = (posixTimeStr: string): string => {
  const date = new Date(parseInt(posixTimeStr));

  // Pad with leading zeros if needed
  const pad = (num: number): string => num.toString().padStart(2, "0");

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // getMonth() is 0-based
  const day = pad(date.getUTCDate());

  return `${year}-${month}-${day}`;
};
