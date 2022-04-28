import jsdom from "jsdom";

export async function getSchedule() {
  const result = await fetch("https://reactsummit.com/schedule-offline");
  const txt = await result.text();

  const dom = new jsdom.JSDOM(txt);
  const talks = [...dom.window.document.querySelectorAll(".schedule__btn")]
    .map((talk) => talk.getAttribute("onclick"))
    .map(parseBtnStr)
    .map(JSON.parse);

  return talks;
}

export async function getScheduleOld() {
  const result = await fetch("https://reactsummit.com/schedule-offline");
  const txt = await result.text();

  const dom = new jsdom.JSDOM(txt);
  const data = combine(
    [...dom.window.document.querySelectorAll("script")]
      .map((s) => s.textContent)
      .filter((t) => t.includes("eventsBus.pushContent"))
      .map(parseStr)
  );

  const talks = data.speakers.main.flatMap(({ activities, ...speaker }) =>
    [...(activities.offlineTalks || []), ...(activities.talks || [])].map(
      (talk) => {
        return {
          ...talk,
          speaker,
        };
      }
    )
  );

  const tracks = talks.reduce((acc, talk) => {
    const track =
      talk.track.name +
      (talk.timeString ? new Date(talk.timeString).getDate() : "");

    if (!acc[track]) {
      acc[track] = [];
    }
    acc[track].push(talk);
    return acc;
  }, {});

  return { tracks, data };
}

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

function combine(arr) {
  return arr.reduce((acc, value) => {
    return {
      ...acc,
      ...value,
    };
  }, {});
}

function parseStr(str) {
  const start = ":";
  const end = "})";

  const propEnd = str.indexOf(":");
  const propStart = str.lastIndexOf(" ", propEnd) + 1;
  const prop = str.substring(propStart, propEnd).trim();

  const bodyStart = str.indexOf(start) + start.length;
  const bodyEnd = str.lastIndexOf(end);

  const body = str.substring(bodyStart, bodyEnd).trim();

  if (!body) {
    return {
      [prop]: {},
    };
  }

  return {
    [prop]: JSON.parse(body),
  };
}
