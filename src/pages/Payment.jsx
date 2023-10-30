import { object } from "prop-types";
import { useEffect, useState } from "react";
import { Input } from "react-daisyui";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { createItem, getAllItems } from "../api/api";
import { ORDER_ITEMS, ORDERS, PAYMENT_METHODS } from "../api/routes";
import Modal from "../components/Modal";
import { removeAllItems } from "../redux/reducers/cartSlice";
import idrPriceFormat from "../utils/idrPriceFormat";

function OrderItem(props) {
  const { item } = props;
  const { amounts, product, subTotal } = item;
  const { name, image, price } = product;

  return (
    <>
      <div className="border-b-2 py-2 last:border-b-0 last:pb-0">
        <div className="flex gap-3">
          <div className="w-16 flex-none">
            <img className="rounded" src={image} alt={name} />
          </div>

          <div className="flex-1">
            <div className="pb-2 text-xl font-bold">{name}</div>
            <div className="flex items-center justify-between">
              <div className="flex justify-between gap-2">
                <span className="text-base font-bold">{amounts}</span>
                <span className="text-base">&#10005;</span>
                <span className="text-base font-bold">
                  {idrPriceFormat(price)}
                </span>
              </div>
              <span className="text-base font-bold">
                {idrPriceFormat(subTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

OrderItem.propTypes = {
  item: object,
};

function Payment() {
  const { data: paymentMethods } = useSWR(`${PAYMENT_METHODS}`, getAllItems);

  const { items, totalAmounts, subTotalProductPrice } = useSelector(
    (state) => state.cart,
  );

  const form = useForm({
    defaultValues: {
      userId: 2,
      totalAmounts: 0,
      "payment-methodId": "1",
      totalPrice: 0,

      dibayar: 0,
    },
  });

  const { register, handleSubmit, reset, watch } = form;

  const values = watch();

  const kembalian = () => {
    const jmlhKembalian = Number(values.dibayar) - subTotalProductPrice;

    if (jmlhKembalian < 0 || isNaN(jmlhKembalian)) {
      return 0;
    }

    return jmlhKembalian;
  };

  useEffect(() => {
    reset((values) => ({
      ...values,
      totalAmounts: totalAmounts,
      totalPrice: subTotalProductPrice,
    }));
  }, [reset, subTotalProductPrice, totalAmounts]);

  useEffect(() => {
    const subscription = watch((values) => {
      console.log("watch", values);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [{ isModalOpen, modalTitle, modalText }, setModal] = useState({
    isModalOpen: false,
    modalTitle: "",
    modalText: "",
  });
  const handleModalClose = () => {
    setModal({ isModalOpen: false, modalTitle: "", modalText: "" });
    console.log("to /");
    dispatch(removeAllItems());
    navigate("/", { replace: true });
  };

  const onSubmit = async (data) => {
    console.log("data", data);

    const order = {
      userId: data.userId,
      totalAmounts: data.totalAmounts,
      "payment-methodId": Number(data["payment-methodId"]),
      totalPrice: data.totalPrice,
    };

    console.log("order", order);

    setIsLoading(true);

    try {
      const orderData = await createItem(ORDERS, order);

      console.log("orderData", orderData);

      const orderItemRequests = items.map((product) => {
        return new Promise((resolve, reject) => {
          try {
            const orderItem = createItem(ORDER_ITEMS, {
              orderId: orderData.id,
              amounts: product.amounts,
              productId: product.productId,
              subTotal: product.subTotal,
            });

            resolve(orderItem);
          } catch (error) {
            reject(error);
          }
        });
      });

      const orderItemsData = await Promise.allSettled(orderItemRequests);

      console.log("orderItemsData", orderItemsData);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setModal({
        isModalOpen: false,
        modalTitle: "Error",
        modalText: error.message,
      });
    } finally {
      setIsLoading(false);
      setModal({
        isModalOpen: true,
        modalTitle: "Sukses",
        modalText: "Pembayaran Telah Sukses",
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full md:mb-0 md:min-w-[60%] md:max-w-[60%]">
          <div className="card card-compact w-full shadow-2xl">
            <div className="card-body">
              <div className="flex-warp flex items-center justify-between gap-2 pb-4 text-center">
                <h2 className="text-2xl font-bold">Rincian Pesanan</h2>
              </div>

              <div className="h-[calc(100vh_-_120px)] overflow-y-auto pr-2">
                {items.map((item) => (
                  <OrderItem key={item.productId} item={item}></OrderItem>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="divider hidden md:divider-horizontal md:!mx-0 md:flex"></div>

        <div className="w-full md:grow md:basis-0">
          <div className="divider !my-0 md:hidden"></div>

          <div className="card card-compact mb-6 shadow-2xl md:mb-0">
            <form
              className="card-body h-[calc(100vh_-_32px)]"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="pb-2 text-center text-2xl font-bold">
                Pembayaran
              </div>

              <div className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-3 font-bold">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-xl font-bold">
                    {idrPriceFormat(subTotalProductPrice)}
                  </span>
                </div>
              </div>

              <div className="pb-2">
                <label className="label">
                  <span className="label-text text-xl font-bold">Tipe</span>
                </label>
                <div className="join grid grid-cols-3">
                  {paymentMethods?.map((method) => (
                    <input
                      key={method.id}
                      className="btn join-item px-2"
                      type="radio"
                      name="tipe"
                      value={method.id}
                      aria-label={method.name}
                      checked={values["payment-methodId"] === `${method.id}`}
                      {...register("payment-methodId")}
                    />
                  ))}
                </div>
              </div>

              <div className="pb-2">
                <label className="label">
                  <span className="label-text text-xl font-bold">Dibayar</span>
                </label>
                <Input
                  type="text"
                  className="w-full"
                  {...register("dibayar", { valueAsNumber: true })}
                ></Input>
              </div>

              <div className="pb-2">
                <div
                  className={`flex flex-wrap items-center justify-between gap-3 font-bold ${
                    kembalian() === 0 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <span className="text-xl font-bold">Kembalian</span>
                  <span className="text-xl font-bold">
                    {idrPriceFormat(kembalian())}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block mt-auto"
                disabled={subTotalProductPrice > values.dibayar}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "bayar"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        handleClose={handleModalClose}
        title={modalTitle}
        text={modalText}
      ></Modal>
    </>
  );
}

export default Payment;
