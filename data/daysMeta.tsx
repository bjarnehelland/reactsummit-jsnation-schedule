import { ReactNode } from "react";
import { JsNationLogo } from "../components/JsNationLogo";
import { ReactSummitLogo } from "../components/ReactSummitLogo";

interface DayMeta {
  event: string;
  dayISO: string;
  date: string;
  day: string;
  month: string;
  favicon: string;
  url: string;
  Logo: (props: any) => ReactNode;
}

export const daysMeta: Record<string, DayMeta> = {
  16: {
    event: "JS Nation",
    dayISO: "2022-06-16T00:00:00.000Z",
    date: "16. juni 2022",
    day: "16",
    month: "juni",
    favicon: "https://jsnation.com/img/favicon.ico",
    url: "https://jsnation.com/schedule-offline",
    Logo: JsNationLogo,
  },
  17: {
    event: "React Summit",
    dayISO: "2022-06-17T00:00:00.000Z",
    date: "17. juni 2022",
    day: "17",
    month: "juni",
    favicon: "https://reactsummit.com/img/favicon.png",
    url: "https://reactsummit.com/schedule-offline",
    Logo: ReactSummitLogo,
  },
  20: {
    event: "JS Nation (remote)",
    dayISO: "2022-06-20T00:00:00.000Z",
    date: "20. juni 2022",
    day: "20",
    month: "juni",
    favicon: "https://jsnation.com/img/favicon.ico",
    url: "https://jsnation.com/schedule-offline",
    Logo: JsNationLogo,
  },
  21: {
    event: "React Summit (remote)",
    dayISO: "2022-06-21T00:00:00.000Z",
    date: "21. juni 2022",
    day: "21",
    month: "juni",
    favicon: "https://reactsummit.com/img/favicon.png",
    url: "https://reactsummit.com/schedule-offline",
    Logo: ReactSummitLogo,
  },
};
