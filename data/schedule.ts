import jsdom from "jsdom";
import { daysMeta } from "./daysMeta";

export interface Talk {
  slug: string;
  eventType: string;
  duration: number;
  isoDate: string;
  dayISO: string;
  track: string;
}

const ignoreTalks = ["break-before-the-party", "coffee-break", "break"];

function parseBtnStr(str: string) {
  const start = "data:";
  const end = "})";

  const startPosition = str.indexOf("eventsBus.clickEvent(");
  const bodyStart = str.indexOf(start, startPosition) + start.length;

  const endPosition = str.lastIndexOf("return false");
  const bodyEnd = str.lastIndexOf(end, endPosition);

  const body = str.substring(bodyStart, bodyEnd).trim();

  return body;
}

export async function getSchedule(day: string) {
  if (!daysMeta[day]) {
    throw new Error(`Unknown day: ${day}`);
  }
  const dayMeta = daysMeta[day];
  const url = dayMeta.url;
  const result = await fetch(url);
  const txt = await result.text();

  const dom = new jsdom.JSDOM(txt);
  const talks = [...dom.window.document.querySelectorAll(".schedule__btn")]
    .map((talk) => talk.getAttribute("onclick"))
    .map(parseBtnStr)
    .map<Talk>((talk) => JSON.parse(talk))
    .filter((talk) => talk.dayISO === dayMeta.dayISO)
    .filter((talk) => ignoreTalks.includes(talk.slug) === false)
    .filter((talk) => talk.track !== "Speaker QnA Rooms")
    .reduce<Talk[]>((talks, talk) => {
      if (talk.eventType === "QA") {
        talks[talks.length - 1].duration += talk.duration;
        return talks;
      }
      return [...talks, talk];
    }, []);
  talks.sort((a, b) =>
    a.isoDate < b.isoDate ? -1 : a.isoDate > b.isoDate ? 1 : 0
  );

  return talks;
}
