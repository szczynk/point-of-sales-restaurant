// import CardComponents from "../components/Card";
// import NavbarComponents from '../components/Navbar';

import { object } from "prop-types";
import { useMemo, useState } from "react";
import { Input, Select } from "react-daisyui";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { getAllItems } from "../api/api";
import { CATEGORIES, PRODUCTS } from "../api/routes";
import MinusIcon from "../components/icons/MinusIcon";
import PlusIcon from "../components/icons/PlusIcon";
import {
  addItem as addCartItem,
  onDecrement as onDecrementItem,
  onIncrement as onIncrementItem,
  removeItem as removeCartItem,
} from "../redux/reducers/cartSlice";
import idrPriceFormat from "../utils/idrPriceFormat";

function ProductCard(props) {
  const { product } = props;
  const { image, name, id, price } = product;

  const dispatch = useDispatch();

  const handleOnClick = () => {
    const data = {
      productId: id,
      product: product,
      subTotal: price,
      amounts: 1,
    };
    console.log("handleOnClick", data);

    dispatch(addCartItem(data));
  };

  return (
    <>
      <button
        className="pop-effect rounded-2xl shadow-2xl"
        onClick={handleOnClick}
      >
        <figure className="rounded-2xl">
          <img src={image} alt={name} />
        </figure>
        <div className="card-body items-center justify-center !p-1 text-center">
          <h3 className="card-title !m-0 line-clamp-1 text-sm">{name}</h3>
          <p className="text-sm font-bold text-primary">
            {idrPriceFormat(price)}
          </p>
        </div>
      </button>
    </>
  );
}

ProductCard.propTypes = {
  product: object,
};

function CartItem(props) {
  const { item } = props;
  const { amounts, product, subTotal } = item;
  const { id, name, price } = product;

  const dispatch = useDispatch();

  function handleOnDecrement() {
    dispatch(onDecrementItem({ id, price }));
  }

  function handleOnIncrement() {
    dispatch(onIncrementItem({ id, price }));
  }

  function handleRemoveItemById() {
    dispatch(removeCartItem({ id, amounts, subTotal }));
  }

  return (
    <>
      <div className="border-b-2 pt-2 first:pt-0 last:border-b-0">
        <div className="flex gap-3">
          <div className="">
            <button
              type="button"
              className="btn px-3"
              onClick={handleRemoveItemById}
            >
              <svg viewBox="0 0 24 24" className="h-6 fill-primary">
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"></path>
              </svg>
            </button>
          </div>

          <div className="flex-1">
            <div className="font-bold">{name}</div>
            <div className="flex flex-wrap items-center justify-between gap-3 font-bold">
              <span>{idrPriceFormat(price)}</span>
              <span>{idrPriceFormat(subTotal)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row-reverse items-center justify-between pb-2">
          <div className="right join float-right border border-primary">
            <button
              type="button"
              className="pop-effect join-item flex items-center justify-center sm:p-3"
              onClick={handleOnDecrement}
              disabled={amounts <= 1}
            >
              <MinusIcon></MinusIcon>
            </button>
            <input
              className="join-item w-8 border-0 p-0 text-center"
              type="text"
              name="amounts"
              value={amounts}
              disabled
            ></input>
            <button
              type="button"
              className="pop-effect join-item flex items-center justify-center sm:p-3"
              onClick={handleOnIncrement}
            >
              <PlusIcon></PlusIcon>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

CartItem.propTypes = {
  item: object,
};

function Home() {
  const { data: products } = useSWR(PRODUCTS, getAllItems);

  const { data: categories } = useSWR(
    `${CATEGORIES}?_embed=products`,
    getAllItems,
  );

  const [tabValue, setTabValue] = useState(0);
  const handleOnClick = (id) => {
    setTabValue(id);
  };

  const embeddedCategories = useMemo(() => {
    if (categories && products) {
      return [{ id: 0, name: "Semua", products: [...products] }, ...categories];
    }
    return [];
  }, [categories, products]);

  const { items, subTotalProductPrice } = useSelector((state) => state.cart);

  const navigate = useNavigate();

  const handleBayar = () => {
    console.log({ items, subTotalProductPrice });

    navigate("/payment");
  };

  return (
    <>
      {/* <NavbarComponents /> */}
      {/* <CardComponents /> */}
      <div className="flex flex-wrap">
        <div className="w-full md:mb-0 md:min-w-[60%] md:max-w-[60%]">
          <div className="card card-compact w-full shadow-2xl">
            <div className="card-body">
              <div className="flex-warp flex items-center justify-between gap-2 pb-4 text-center">
                <h2 className="text-2xl font-bold">Daftar Produk</h2>
                {/* // ! at screen width 896px or 916px, the text height get doubled and ruined perfect height*/}
                <div className="flex flex-wrap justify-between gap-2">
                  <Select>
                    {["terbaru", "termahal"].map((option) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                  <Input type="text" className="w-48"></Input>
                </div>
              </div>

              <div className="grid h-[calc(100vh_-_239px)] grid-cols-3 gap-6 overflow-y-auto pr-2 lg:grid-cols-4">
                {embeddedCategories.length !== 0
                  ? embeddedCategories[tabValue].products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      ></ProductCard>
                    ))
                  : null}
              </div>
            </div>
          </div>
          <div className="card card-compact w-full shadow-2xl">
            <div className="card-body">
              <div role="tablist" className="flex w-full overflow-x-auto pb-2">
                {embeddedCategories?.map((category) => (
                  <button
                    type="button"
                    role="tab"
                    key={category.id}
                    className={`btn ${
                      tabValue === category.id ? "btn-primary" : ""
                    }`}
                    onClick={() => handleOnClick(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="divider hidden md:divider-horizontal md:!mx-0 md:flex"></div>

        <div className="w-full md:grow md:basis-0">
          <div className="divider !my-0 md:hidden"></div>

          <div className="card card-compact mb-6 shadow-2xl md:mb-0">
            <div className="card-body">
              <div className="h-16 pb-4 text-center text-2xl font-bold">
                Daftar Pesanan
              </div>
              <div className="h-[calc(100vh_-_236px)] overflow-y-auto pr-2">
                {items?.map((item) => (
                  <CartItem key={item.productId} item={item}></CartItem>
                ))}
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 font-bold">
                  <span className="text-2xl font-bold">Total</span>
                  <span className="text-2xl font-bold">
                    {idrPriceFormat(subTotalProductPrice)}
                  </span>
                </div>
                <button
                  disabled={subTotalProductPrice === 0}
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handleBayar}
                >
                  bayar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
