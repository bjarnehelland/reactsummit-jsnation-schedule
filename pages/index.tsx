import Link from "next/link";
import { JsNationLogo } from "../components/JsNationLogo";
import { ReactSummitLogo } from "../components/ReactSummitLogo";
import { daysMeta } from "../data/daysMeta";

export default function Home() {
  return (
    <div className="text-black flex flex-col min-h-screen">
      {Object.entries(daysMeta).map(([day, { Logo, ...meta }]) => (
        <div key={day} className="p-4 m-2 shadow">
          <Link href={`/${day}`}>
            <a className="flex flex-row">
              <div className="text-center">
                <div className="text-xl">{meta.month}</div>
                <div className="text-8xl">{meta.day}</div>
              </div>

              <Logo />
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
