import { object } from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { Select } from "react-daisyui";
import { FaArrowRotateRight, FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import { getAllItems } from "../api/api";
import { CATEGORIES, PRODUCTS } from "../api/routes";
import DebouncedInput from "../components/DebouncedInput";
import {
  addItem as addCartItem,
  onDecrement as onDecrementItem,
  onIncrement as onIncrementItem,
  removeAllItems,
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
        className="pop-effect h-fit rounded-2xl shadow-2xl"
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
              <FaTrash className="h-5 w-5 fill-primary"></FaTrash>
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
              <FaMinus className="h-4 w-4 fill-primary"></FaMinus>
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
              <FaPlus className="h-4 w-4 fill-primary"></FaPlus>
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

  const options = [
    { name: "Urutkan", value: "" },
    { name: "Judul (A - Z)", value: "title-asc" },
    { name: "Judul (Z - A)", value: "title-desc" },
    { name: "Termurah", value: "price-asc" },
    { name: "Termahal", value: "price-desc" },
  ];

  const [filterAndSort, setFilterAndSort] = useState({
    judul: "",
    kategori: 0,
    sort: "",
  });

  const [processedCategories, setProcessedCategories] = useState([
    { id: 0, name: "Semua" },
  ]);

  useMemo(() => {
    if (categories) {
      setProcessedCategories((prevCategories) => [
        ...prevCategories,
        ...categories,
      ]);
    }
  }, [categories]);

  const [tabCategory, setTabCategory] = useState(0);

  const handleTabCategory = useCallback((id) => {
    return () => {
      setFilterAndSort((prevFilter) => ({ ...prevFilter, kategori: id }));
      setTabCategory(id);
    };
  }, []);

  const processedProducts = useMemo(() => {
    if (products) {
      let filteredProducts = [...products];

      if (filterAndSort.kategori !== 0) {
        filteredProducts = filteredProducts.filter(
          ({ categoryId }) => filterAndSort.kategori === categoryId,
        );
      }

      if (filterAndSort.judul) {
        filteredProducts = filteredProducts.filter(({ name }) =>
          name.toLowerCase().includes(filterAndSort.judul.toLowerCase()),
        );
      }

      if (filterAndSort.sort) {
        switch (filterAndSort.sort) {
          case "title-asc":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "title-desc":
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "price-asc":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          default:
            break;
        }
      }

      return filteredProducts;
    }
  }, [
    filterAndSort.judul,
    filterAndSort.kategori,
    filterAndSort.sort,
    products,
  ]);

  const handleResetFilterAndSort = () => {
    setFilterAndSort({
      judul: "",
      kategori: 0,
      sort: "",
    });
  };

  const { items, subTotalProductPrice } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const handleRemoveAllItems = () => {
    dispatch(removeAllItems());
  };

  const navigate = useNavigate();

  const handleBayar = () => {
    console.log({ items, subTotalProductPrice });

    navigate("/payment");
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full md:mb-0 md:min-w-[60%] md:max-w-[60%]">
          <div className="card card-compact w-full shadow-2xl">
            <div className="card-body">
              <div className="flex-warp flex items-center justify-between gap-2 pb-4 text-center">
                <h2 className="text-2xl font-bold">Daftar Produk</h2>
                {/* // ! at screen width 896px or 916px, the text height get doubled and ruined perfect height*/}
                <div className="flex flex-wrap justify-between gap-2">
                  <select
                    name="sort"
                    className="select focus:outline-offset-0"
                    onChange={(event) =>
                      setFilterAndSort((prevState) => ({
                        ...prevState,
                        sort: event.target.value,
                      }))
                    }
                    value={filterAndSort.sort}
                  >
                    {options.map(({ name, value }) => (
                      <Select.Option key={value} value={value}>
                        {name}
                      </Select.Option>
                    ))}
                  </select>
                  <DebouncedInput
                    name="judul"
                    type="text"
                    className="input w-48 focus:outline-offset-0"
                    value={filterAndSort.judul}
                    onChange={(value) =>
                      setFilterAndSort((prevState) => ({
                        ...prevState,
                        judul: value,
                      }))
                    }
                    spellCheck="false"
                    placeholder="Cari Produk"
                  ></DebouncedInput>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleResetFilterAndSort}
                  >
                    <FaArrowRotateRight className="h-5 w-5 fill-primary"></FaArrowRotateRight>
                  </button>
                </div>
              </div>

              <div className="grid h-[calc(100vh_-_239px)] grid-cols-3 gap-6 overflow-y-auto pr-2 lg:grid-cols-4">
                {processedProducts?.map((product) => (
                  <ProductCard key={product.id} product={product}></ProductCard>
                ))}
              </div>
            </div>
          </div>

          <div className="card card-compact w-full shadow-2xl">
            <div className="card-body">
              <div role="tablist" className="flex w-full overflow-x-auto pb-2">
                {processedCategories?.map((category) => (
                  <button
                    type="button"
                    role="tab"
                    key={category.id}
                    className={`btn ${
                      tabCategory === category.id ? "btn-primary" : ""
                    }`}
                    onClick={handleTabCategory(category.id)}
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
              <div className="flex-warp flex items-center justify-between gap-2 pb-4 text-center">
                <div className="text-2xl font-bold">Daftar Pesanan</div>
                <button
                  type="button"
                  className="btn px-3"
                  onClick={handleRemoveAllItems}
                >
                  <FaTrash className="h-5 w-5 fill-primary"></FaTrash>
                </button>
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
