import { add, differenceInHours, format, setMinutes } from "date-fns";
import type { GetStaticPaths, GetStaticProps } from "next";
import { Fragment } from "react";
import { DayMeta, getSchedule, Talk } from "../../data/schedule";
import { daysMeta } from "../../data/daysMeta";
import { Event } from "../../components/Event";
import Head from "next/head";
import { classNames } from "../../utils/classNames";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

function positionEvent(startDate, talk) {
  return {
    gridRow: `${((talk.date - startDate) / 60000) * 0.2 + 2} / span ${
      talk.duration * 0.2
    }`,
  };
}

export default function Example({
  talks,
  meta,
  selectedDay,
  allDays,
}: {
  talks: Talk[];
  meta: DayMeta;
  selectedDay: string;
  allDays: string[];
}) {
  const filteredTalks = talks.map((talk) => ({
    ...talk,
    date: new Date(talk.isoDate),
  }));

  console.log(filteredTalks);

  const firstDate = setMinutes(filteredTalks[0].date, 0);
  const lastEvent = filteredTalks[filteredTalks.length - 1];
  const lastDate = add(lastEvent.date, { minutes: lastEvent.duration });
  const firstHour = firstDate.getHours();

  const hours = new Array(differenceInHours(lastDate, firstDate))
    .fill(null)
    .map((_, i) => firstHour + i);

  const minutes = hours.length * 12;

  return (
    <div className="flex h-full flex-col">
      <Head>
        <title>{meta.event}</title>
        <link rel="shortcut icon" href={meta.favicon}></link>
      </Head>
      <header className="relative z-20 flex flex-none items-center justify-between border-b border-gray-200 py-4 px-6">
        <div>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            {meta.event}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{meta.date}</p>
        </div>
      </header>
      <div className="flex flex-auto overflow-hidden bg-white">
        <div className="flex flex-auto flex-col">
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
                <div className="row-end-1 h-7"></div>
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
                      <Event talk={talk} onClick={() => {}} />
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

export const getStaticProps: GetStaticProps<
  {},
  {
    day: string;
  }
> = async ({ params }) => {
  const { day } = params;
  const talks = await getSchedule(day);
  const meta = daysMeta[day];

  delete meta.Logo;
  return {
    props: {
      talks: talks,
      meta: daysMeta[day],
      selectedDay: day,
      allDays: Object.keys(daysMeta),
    },
    revalidate: 60 * 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(daysMeta).map((day) => ({ params: { day } }));
  return {
    paths,
    fallback: false,
  };
};
