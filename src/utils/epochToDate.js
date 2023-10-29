export default function epochToDate(epoch) {
  const options = {
    dateStyle: "long",
    timeStyle: "long",
  };

  return new Intl.DateTimeFormat("id-ID", options).format(
    new Date(epoch * 1000),
  );
}
