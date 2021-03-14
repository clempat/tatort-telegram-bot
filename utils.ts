export function getNextWeekDayDate(day: number): Date {
  const ret = new Date();
  if (ret.getDay() === day) return ret;
  ret.setDate(ret.getDate() + ((day - 1 - ret.getDay() + 7) % 7) + 1);
  return ret;
}

export function clean(s: string | undefined) {
  if (!s) return undefined;
  return s.replace("\n", "").replace("broadcastBox_", "");
}

export function extractHours(s: string | undefined) {
  if (!s) return undefined;
  const time = s.split(":");
  if (time.length < 2) return undefined;
  return time.map(function (_) {
    return parseInt(_, 10);
  });
}

export function isToday(date: Date) {
  const today = new Date();
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}
