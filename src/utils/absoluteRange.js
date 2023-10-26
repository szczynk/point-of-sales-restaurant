export default function (amounts, minOrder, maxOrder) {
  let valueAsNumber = parseInt(amounts, 10);
  if (isNaN(valueAsNumber)) {
    return minOrder;
  }
  return Math.min(Math.max(valueAsNumber, minOrder), maxOrder);
}
