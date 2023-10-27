export default function epochToDate(epoch) {
  const options = { year: "numeric", month: "short", day: "numeric" };

  return new Intl.DateTimeFormat("id-ID", options).format(
    new Date(epoch * 1000),
  );
}
