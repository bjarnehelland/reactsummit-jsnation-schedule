function getDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function minutesBetween(startDate, currentDate) {
  return (currentDate - startDate) / 60000;
}

function getIsoDate(day, time) {
  return new Date(`2022-06-${day}T${time}:00.000Z`);
}

function getHours(startDate, endDate) {
  const minutes = minutesBetween(startDate, endDate);
  const hours = Math.ceil(minutes / 60);
  const current = new Date(startDate);
  const arr = [];
  for (let index = 0; index < hours; index++) {
    arr.push(new Date(current));
    current.setHours(current.getHours() + 1);
  }
  return arr;
}

export default function Track({
  track,
  day,
  talks,
  startTime = "07:00",
  endTime = "21:00",
}) {
  const startISO = getIsoDate(day, startTime);
  const endISO = getIsoDate(day, endTime);

  const array = getHours(startISO, endISO);

  const dayISO = new Date(`2022-06-${day}`).toISOString();
  const totalHeight = 1600;
  const hourHeight = totalHeight / array.length;
  const minuteHeight = hourHeight / 60;

  return (
    <div>
      <h1>
        {track} - {day}
      </h1>
      <div style={{ position: "relative", height: totalHeight }}>
        {array.map((hour, index) => {
          return (
            <div
              key={index}
              className="hour"
              style={{
                position: "absolute",
                height: hourHeight,

                top: hourHeight * index,
                width: "100%",
              }}
            >
              <h2>{hour.getHours()}</h2>
            </div>
          );
        })}

        {talks
          .filter((talk) => talk.dayISO === dayISO && talk.track === track)
          .map((item, index) => (
            <div
              key={index}
              className="talk"
              style={{
                position: "absolute",
                height: item.duration * minuteHeight,
                width: "100%",
                top:
                  minutesBetween(startISO, new Date(item.isoDate)) *
                  minuteHeight,
              }}
            >
              {getDate(item.isoDate)} - {item.title}
            </div>
          ))}
      </div>
    </div>
  );
}
