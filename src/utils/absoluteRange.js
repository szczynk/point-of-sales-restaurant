export default function absoluteRange(amounts, minOrder, maxOrder) {
  // ubah `amounts` jadi angka
  let valueAsNumber = Number(amounts);
  // jika bukan angka, maka return nilai minimal
  if (isNaN(valueAsNumber)) {
    return minOrder;
  }

  // jika angka, maka lihat apakah angka itu berada di antara nilai minimal dan maksimal
  // jika lebih kecil dari nilai minimal maka kembalikan nilai minimal
  // jika lebih besar dari nilai maksimal maka kembalikan nilai maksimal
  // jika berada di antara kedua nilai minimal dan maksimal, kembalikan angka tersebut
  return Math.min(Math.max(valueAsNumber, minOrder), maxOrder);
}
