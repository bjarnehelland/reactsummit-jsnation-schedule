import jsdom from "jsdom";

const ignoreTalks = ["break-before-the-party"];

function parseBtnStr(str) {
  const start = "data:";
  const end = "})";

  const startPosition = str.indexOf("eventsBus.clickEvent(");
  const bodyStart = str.indexOf(start, startPosition) + start.length;

  const endPosition = str.lastIndexOf("return false");
  const bodyEnd = str.lastIndexOf(end, endPosition);

  const body = str.substring(bodyStart, bodyEnd).trim();

  return body;
}

async function getScheduleByUrl(url) {
  const result = await fetch(url);
  const txt = await result.text();

  const dom = new jsdom.JSDOM(txt);
  const talks = [...dom.window.document.querySelectorAll(".schedule__btn")]
    .map((talk) => talk.getAttribute("onclick"))
    .map(parseBtnStr)
    .map(JSON.parse)
    .filter((talk) => ignoreTalks.includes(talk.slug) === false)
    .reduce((talks, talk) => {
      console.log(talk);
      if (talk.eventType === "QA") {
        talks[talks.length - 1].duration += talk.duration;
        return talks;
      }
      return [...talks, talk];
    }, []);

  return talks;
}

export async function getSchedule() {
  const jsnation = await getScheduleByUrl(
    "https://jsnation.com/schedule-offline"
  );
  const reactsummit = await getScheduleByUrl(
    "https://reactsummit.com/schedule-offline"
  );

  const allTalks = [...jsnation, ...reactsummit];
  allTalks.sort((a, b) => new Date(a.isoDate) - new Date(b.isoDate));

  return allTalks.reduce((talks, talk) => {
    if (!talks[talk.dayISO]) talks[talk.dayISO] = [];
    talks[talk.dayISO].push(talk);
    return talks;
  }, {});
}
