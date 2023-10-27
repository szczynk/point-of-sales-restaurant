import idrPriceFormat from "../utils/idrPriceFormat";

function OrderItem(props) {
  const { item } = props;
  const { product, subTotal } = item;
  const { id, name, sku, images, price } = product;

  return (
    <>
      <div className="border-b-2 py-2 last:border-b-0 last:pb-0">
        <div className="flex gap-3">
          <div to={`/products/${id}`} className="w-16 flex-none">
            <img className="rounded" src={images[0]} alt={name} />
          </div>

          <div className="flex-1">
            <div to={`/products/${id}`} className="font-bold">
              {name}
            </div>
            <div className="text-sm">SKU {sku}</div>
            <div className="flex items-center justify-between font-bold">
              <span>{idrPriceFormat(price)}</span>
              <span>{idrPriceFormat(subTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Payment() {
  const itemsList = items?.map(function (item) {
    return <OrderItem key={item.productId} item={item}></OrderItem>;
  });

  return (
    <>
      <div className="flex flex-wrap">
        <div className="mb-6 w-full lg:mr-6 lg:min-w-[67%] lg:max-w-[67%] lg:grow lg:basis-0">
          <div className="card mb-6 w-full shadow-xl">
            <div className="card-body p-6">
              <h2 className="text-2xl font-bold">Rincian Pesanan</h2>

              <div>{itemsList}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
