/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useRef } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/solid";
import { Menu, Transition } from "@headlessui/react";
import { getSchedule } from "../data/schedule";
import { add, differenceInHours, format, setMinutes } from "date-fns";
import { nb } from "date-fns/locale";

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
  },
  "2022-06-17T00:00:00.000Z": {
    event: "React Summit",
    date: "17. juni 2022",
  },
  "2022-06-20T00:00:00.000Z": {
    event: "JS Nation (remote)",
    date: "20. juni 2022",
  },
  "2022-06-21T00:00:00.000Z": {
    event: "React Summit (remote)",
    date: "21. juni 2022",
  },
};

export default function Example({ talks }) {
  const container = useRef(null);
  const containerOffset = useRef(null);
  const days = Object.keys(talks);
  const [day, setDay] = useState(days[0]);

  const filteredTalks = talks[day].map((talk) => ({
    ...talk,
    date: new Date(talk.isoDate),
  }));

  const firstDate = setMinutes(filteredTalks[0].date, 0);
  const lastEvent = filteredTalks[filteredTalks.length - 1];
  const lastDate = add(lastEvent.date, { minutes: lastEvent.duration });
  const firstHour = firstDate.getHours();

  const hours = new Array(differenceInHours(lastDate, firstDate))
    .fill()
    .map((_, i) => firstHour + i);

  const minutes = hours.length * 12;

  return (
    <div className="flex h-full flex-col">
      <header className="relative z-20 flex flex-none items-center justify-between border-b border-gray-200 py-4 px-6">
        <div>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            {daysMeta[day].event}
          </h1>
          <p className="mt-1 text-sm text-gray-500"> {daysMeta[day].date}</p>
        </div>
        <div className="flex items-center">
          <div className="flex items-center rounded-md shadow-sm">
            {days.map((d) => {
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
                >
                  {format(new Date(d), "dd", { locale: nb })}
                </button>
              );
            })}
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
                      {talk.eventType === "OrgEvent" ? (
                        <OrgEvent talk={talk} />
                      ) : (
                        <Event talk={talk} />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgEvent({ talk }) {
  return (
    <a
      href="#"
      className="group absolute inset-1 flex flex-row gap-1 overflow-y-auto rounded-lg bg-green-50 p-2 text-xs leading-5 hover:bg-green-100"
    >
      <p className="order-1 font-semibold text-green-700">{talk.title}</p>
      <p className="text-green-500 group-hover:text-green-700">
        <time dateTime={talk.date.toISOString()}>
          {format(talk.date, "p", { locale: nb })}
        </time>
      </p>
    </a>
  );
}

function Event({ talk }) {
  return (
    <a
      href="#"
      className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
    >
      <p className="text-blue-500 group-hover:text-blue-700">
        <time dateTime={talk.date.toISOString()}>
          {format(talk.date, "p", { locale: nb })}
        </time>
      </p>
      <p className=" font-semibold text-blue-700">{talk.title}</p>
      <p className=" text-blue-700">{talk.name}</p>
      {/* {talk.lightningTalks?.map((talk, index) => (
        <p key={index} className=" text-blue-700">
          {talk.title}
        </p>
      ))} */}
    </a>
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
