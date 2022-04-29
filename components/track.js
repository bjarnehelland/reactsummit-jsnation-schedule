function getDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Track({ track, day, talks }) {
  const dayISO = new Date(`2022-06-${day}`).toISOString();
  return (
    <div>
      <h1>
        {track} - {day}
      </h1>
      {talks
        .filter((talk) => talk.dayISO === dayISO && talk.track === track)
        .map((item, index) => (
          <div key={index}>
            {getDate(item.isoDate)} - {item.title}
          </div>
        ))}
    </div>
  );
}
