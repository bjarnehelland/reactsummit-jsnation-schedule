import { Fragment, useState, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { add, differenceInHours, format, setMinutes } from "date-fns";
import { nb } from "date-fns/locale";
import { getSchedule } from "../data/schedule";
import Head from "next/head";
import { TalkDetails } from "../components/Dialog";

function positionEvent(startDate, talk) {
  return {
    gridRow: `${((talk.date - startDate) / 60000) * 0.2 + 2} / span ${
      talk.duration * 0.2
    }`,
  };
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const daysMeta = {
  "2022-06-16T00:00:00.000Z": {
    event: "JS Nation",
    date: "16. juni 2022",
    favicon: "https://jsnation.com/img/favicon.ico",
  },
  "2022-06-17T00:00:00.000Z": {
    event: "React Summit",
    date: "17. juni 2022",
    favicon: "https://reactsummit.com/img/favicon.png",
  },
  "2022-06-20T00:00:00.000Z": {
    event: "JS Nation (remote)",
    date: "20. juni 2022",
    favicon: "https://jsnation.com/img/favicon.ico",
  },
  "2022-06-21T00:00:00.000Z": {
    event: "React Summit (remote)",
    date: "21. juni 2022",
    favicon: "https://reactsummit.com/img/favicon.png",
  },
};

export default function Example({ talks }) {
  const [open, setOpen] = useState(false);
  const [selectedTalk, setSelectedTalk] = useState(null);
  const container = useRef(null);
  const containerOffset = useRef(null);
  const days = Object.keys(talks);
  const [day, setDay] = useState(() => days[0]);
  const selectedDay = day || days[0];
  const filteredTalks = talks[selectedDay].map((talk) => ({
    ...talk,
    date: new Date(talk.isoDate),
  }));

  console.log(filteredTalks);

  const firstDate = setMinutes(filteredTalks[0].date, 0);
  const lastEvent = filteredTalks[filteredTalks.length - 1];
  const lastDate = add(lastEvent.date, { minutes: lastEvent.duration });
  const firstHour = firstDate.getHours();

  const hours = new Array(differenceInHours(lastDate, firstDate))
    .fill()
    .map((_, i) => firstHour + i);

  const minutes = hours.length * 12;

  const handleTalkDetails = (talk) => {
    setSelectedTalk(talk);
    setOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      <Head>
        <title>{daysMeta[selectedDay].event}</title>
        <link rel="shortcut icon" href={daysMeta[selectedDay].favicon}></link>
      </Head>
      <header className="relative z-20 flex flex-none items-center justify-between border-b border-gray-200 py-4 px-6">
        <div>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            {daysMeta[selectedDay].event}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {" "}
            {daysMeta[selectedDay].date}
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex items-center rounded-md shadow-sm md:items-stretch">
            <button
              type="button"
              disabled={selectedDay === days[0]}
              onClick={() => setDay(days[days.indexOf(selectedDay) - 1])}
              className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous day</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {days.map((d) => {
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  className={classNames(
                    selectedDay === d && "bg-red-100 hover:bg-red-200",
                    "hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
                  )}
                >
                  {format(new Date(d), "dd", { locale: nb })}
                </button>
              );
            })}
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              disabled={selectedDay === days[days.length - 1]}
              onClick={() => setDay(days[days.indexOf(selectedDay) + 1])}
              className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next day</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-auto overflow-hidden bg-white">
        <div ref={container} className="flex flex-auto flex-col">
          <div className="flex w-full flex-auto">
            <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{
                  gridTemplateRows: `repeat(${
                    hours.length * 2
                  }, minmax(7.5rem, 1fr))`,
                }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                {hours.map((hour) => (
                  <Fragment key={hour}>
                    <div>
                      <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {hour}
                      </div>
                    </div>
                    <div />
                  </Fragment>
                ))}
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-2"
                style={{
                  gridTemplateRows: `1.75rem repeat(${minutes}, minmax(0, 1fr)) auto`,
                }}
              >
                {filteredTalks.map((talk, index) => {
                  return (
                    <li
                      key={index}
                      className="relative mt-px flex"
                      style={positionEvent(firstDate, talk)}
                    >
                      <Event
                        talk={talk}
                        onClick={() => handleTalkDetails(talk)}
                      />
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <TalkDetails open={open} setOpen={setOpen} talk={selectedTalk} />
    </div>
  );
}

function Event({ talk, onClick }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        talk.eventType === "OrgEvent"
          ? "bg-green-50 hover:bg-green-100"
          : "bg-blue-50 hover:bg-blue-100",
        talk.duration > 10 ? "flex-col" : "flex-row gap-1",
        "group absolute inset-1 flex text-left overflow-hidden rounded-lg  p-2 text-xs leading-5"
      )}
    >
      <p
        className={classNames(
          talk.eventType === "OrgEvent"
            ? "text-green-500 group-hover:text-green-700"
            : "text-blue-500 group-hover:text-blue-700"
        )}
      >
        <time dateTime={talk.date.toISOString()}>
          {format(talk.date, "p", { locale: nb })}
        </time>
      </p>
      <p
        className={classNames(
          talk.eventType === "OrgEvent" ? "text-green-700" : "text-blue-700",
          "font-semibold"
        )}
      >
        {talk.title}
      </p>
      <p
        className={classNames(
          talk.eventType === "OrgEvent" ? "text-green-700" : "text-blue-700"
        )}
      >
        {talk.name}
      </p>
    </button>
  );
}

export async function getStaticProps() {
  const talks = await getSchedule();
  return {
    props: {
      talks,
    },
  };
}
