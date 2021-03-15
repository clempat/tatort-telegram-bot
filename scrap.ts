import { clean, extractHours, getNextWeekDayDate } from "./utils.ts";
import { cheerio, Cheerio } from "./deps.ts";

export interface Show {
  time: Date;
  name: string;
  title: string;
  url: string;
  id: string;
}

export async function getNextSundayTatort() {
  const nextSunday = getNextWeekDayDate(0);
  const month = `0${nextSunday.getMonth() + 1}`.slice(-2);
  const day = `0${nextSunday.getDate()}`.slice(-2);

  const url = `https://www.daserste.de/programm/index~_pd-${nextSunday.getFullYear()}${month}${day}.html`;
  const $ = cheerio.load(await fetch(url).then((response) => response.text()));

  const shows = $(".broadcastBox").map(function (this: Cheerio) {
    const showHours = extractHours(clean($(this).find(".time").text()));
    return {
      time: showHours
        ? new Date(
            new Date(nextSunday.getTime()).setHours(showHours[0], showHours[1], 0, 0)
          )
        : undefined,
      name: clean($(this).find(".headline").text()),
      title: clean($(this).find(".dachzeile").text()),
      url: `https://www.daserste.de/unterhaltung/krimi/tatort/sendung/${clean(
        $(this).attr("id")
      )}.html`,
      id: clean($(this).attr("id")),
    } as Show;
  });
  return (shows.get() as Array<Show>).find(function isTatort({
    name,
  }: Show): boolean {
    return name === "Tatort";
  });
}
