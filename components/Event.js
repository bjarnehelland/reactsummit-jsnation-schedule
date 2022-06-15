import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { classNames } from "../utils/classNames";

export function Event({ talk, onClick }) {
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
