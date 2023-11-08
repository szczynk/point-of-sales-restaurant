import { useState } from "react";
import { Loading } from "react-daisyui";
import useSWR from "swr";

import { getAllItems } from "../api/api";
import { CATEGORIES, PRODUCTS } from "../api/routes";
import ProductForm from "../components/ProductForm";
import ProductsTable from "../components/ProductsTable";

function Products() {
  const { isLoading, data, mutate } = useSWR(
    `${PRODUCTS}?_expand=category`,
    getAllItems,
  );

  const { data: categories } = useSWR(CATEGORIES, getAllItems);

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const [currentView, setCurrentView] = useState(1);

  const [editProduct, setEditProduct] = useState(null);

  const views = {
    1: "Daftar",
    2: "Tambah",
    3: "Ubah",
  };

  const componentViews = {
    1: (
      <ProductsTable
        data={data}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPagination={setPagination}
        setCurrentView={setCurrentView}
        mutate={mutate}
        setEditProduct={setEditProduct}
      ></ProductsTable>
    ),
    2: (
      <ProductForm
        categories={categories}
        setCurrentView={setCurrentView}
        mutate={mutate}
      ></ProductForm>
    ),
    3: (
      <ProductForm
        categories={categories}
        setCurrentView={setCurrentView}
        mutate={mutate}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
      ></ProductForm>
    ),
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold">{views[currentView]} Produk</h1>
      </div>

      <div className="transition-all">{componentViews[currentView]}</div>
    </>
  );
}

export default Products;
