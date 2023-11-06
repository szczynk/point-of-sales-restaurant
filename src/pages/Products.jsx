import { yupResolver } from "@hookform/resolvers/yup";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { array, func, object } from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Loading, Pagination, Select } from "react-daisyui";
import { useForm } from "react-hook-form";
import {
  CgChevronLeft,
  CgChevronRight,
  CgPushChevronLeft,
  CgPushChevronRight,
} from "react-icons/cg";
import {
  FaArrowDownLong,
  FaArrowRotateRight,
  FaArrowUpLong,
} from "react-icons/fa6";
import useSWR from "swr";
import * as yup from "yup";

import { createItem, getAllItems, updateItem } from "../api/api";
import { CATEGORIES, PRODUCTS } from "../api/routes";
import DebouncedInput from "../components/DebouncedInput";
import absoluteRange from "../utils/absoluteRange";
import epochToDate from "../utils/epochToDate";
import idrPriceFormat from "../utils/idrPriceFormat";

function ProductsTable(props) {
  const { data, setCurrentView, setEditProduct } = props;

  // https://codesandbox.io/p/sandbox/github/tanstack/table/tree/main/examples/react/filters?embed=1&file=%2Fsrc%2Fmain.tsx%3A294%2C13-294%2C48
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("id", {
      header: () => <span className="text-base">ID</span>,
      cell: (info) => <span className="text-base">{info.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      header: () => <span className="text-base">Nama Produk</span>,
      cell: (info) => (
        <div className="flex items-center gap-2">
          <img
            src={info.row.original.image}
            alt={info.getValue()}
            className="h-12 w-12 rounded-lg"
          />
          <span className="text-base">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("category.name", {
      header: () => <span className="text-base">Kategori</span>,
      cell: (info) => <span className="text-base">{info.getValue()}</span>,
    }),
    columnHelper.accessor("price", {
      header: () => <span className="text-base">Harga</span>,
      cell: (info) => (
        <span className="text-base">{idrPriceFormat(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: () => <span className="text-base">Tanggal Dibuat</span>,
      cell: (info) => (
        <span className="text-base">{epochToDate(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: () => <span className="text-base">Actions</span>,
      cell: (info) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-warning"
            onClick={handleEdit(info.row.original)}
          >
            edit
          </button>
          <button type="button" className="btn btn-error">
            delete
          </button>
        </div>
      ),
      enableSorting: false,
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const defaultData = useMemo(() => [], []);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the ranking info
    addMeta(itemRank);

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const table = useReactTable({
    data: data ?? defaultData,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    onPaginationChange: setPagination,

    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,

    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      pagination,
      globalFilter,
      columnFilters,
    },

    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const handleFirstPage = () => {
    table.setPageIndex(0);
  };
  const handlePrevPage = () => {
    table.previousPage();
  };
  const handleNextPage = () => {
    table.nextPage();
  };
  const handleLastPage = () => {
    table.setPageIndex(table.getPageCount() - 1);
  };

  const handleGoToPage = (event) => {
    let page = event.target.value ? Number(event.target.value) - 1 : 0;
    page = absoluteRange(page, 0, table.getPageCount() - 1);
    table.setPageIndex(page);
  };

  const handleLimit = (event) => {
    table.setPageSize(Number(event.target.value));
  };

  const handleResetFilter = () => {
    setGlobalFilter("");
    setColumnFilters([]);
  };

  const handleToAddProduct = () => {
    setCurrentView(2);
  };

  const handleEdit = useCallback(
    (product) => {
      return () => {
        setEditProduct(product);
        setCurrentView(3);
      };
    },
    [setCurrentView, setEditProduct],
  );

  return (
    <>
      <div className="flex-warp flex items-center justify-between gap-2 pb-4 text-center">
        <DebouncedInput
          type="text"
          className="input w-48 focus:outline-offset-0"
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          spellCheck="false"
          placeholder="Cari Transaksi"
        ></DebouncedInput>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" className="btn" onClick={handleResetFilter}>
            <FaArrowRotateRight className="h-5 w-5 fill-primary"></FaArrowRotateRight>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleToAddProduct}
          >
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex gap-2 items-center"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: <FaArrowUpLong></FaArrowUpLong>,
                            desc: <FaArrowDownLong></FaArrowDownLong>,
                          }[header.column.getIsSorted()] ?? (
                            <div className="w-3"></div>
                          )}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-between gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={table.getState().pagination.pageSize}
            onChange={handleLimit}
          >
            {[4, 10, 25, 50, 100].map((pageSize) => (
              <Select.Option key={pageSize} value={pageSize}>
                {pageSize}
              </Select.Option>
            ))}
          </Select>
          <div>Transaksi Per Page</div>
          <div className="flex items-center gap-1">
            <div>| Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </div>
          <div className="flex items-center gap-1">
            | Go to page:
            <Input
              type="number"
              value={pageIndex + 1}
              onChange={handleGoToPage}
              className="w-16"
            />
          </div>
        </div>

        <Pagination>
          <Button
            className="join-item"
            disabled={!table.getCanPreviousPage()}
            onClick={handleFirstPage}
          >
            <CgPushChevronLeft className="h-5 w-5"></CgPushChevronLeft>
          </Button>
          <Button
            className="join-item"
            disabled={!table.getCanPreviousPage()}
            onClick={handlePrevPage}
          >
            <CgChevronLeft className="h-5 w-5"></CgChevronLeft>
          </Button>
          <Button
            className="join-item"
            disabled={!table.getCanNextPage()}
            onClick={handleNextPage}
          >
            <CgChevronRight className="h-5 w-5"></CgChevronRight>
          </Button>
          <Button
            className="join-item"
            disabled={!table.getCanNextPage()}
            onClick={handleLastPage}
          >
            <CgPushChevronRight className="h-5 w-5"></CgPushChevronRight>
          </Button>
        </Pagination>
      </div>
    </>
  );
}

ProductsTable.propTypes = {
  data: array,
  setCurrentView: func,
  setEditProduct: func,
};

function ProductForm(props) {
  const { setCurrentView, mutate, editProduct, setEditProduct } = props;

  const { data: categories } = useSWR(CATEGORIES, getAllItems);

  const schema = yup.object({
    name: yup.string().required("Required"),
    categoryId: yup.number().required("Required"),
    price: yup.number().required("Required"),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      categoryId: 0,
      price: 0,
      minOrder: 1,
      image: "",
      createdAt: 0,
    },
    resolver: yupResolver(schema),
  });

  const { register, formState, handleSubmit, reset, watch } = form;
  const { errors } = formState;

  useEffect(() => {
    if (editProduct) {
      reset({
        name: editProduct.name,
        categoryId: editProduct.categoryId,
        price: editProduct.price,
        minOrder: editProduct.minOrder,
        image: editProduct.image,
        createdAt: editProduct.createdAt,
      });
    }
  }, [editProduct, reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      console.log("watch", values);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const imgTagRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (event) => {
    const [image] = event.target.files;

    if (image) {
      setImageFile(image);
      imgTagRef.current.src = URL.createObjectURL(image);
      imgTagRef.current.onLoad = () =>
        URL.revokeObjectURL(imgTagRef.current.src);
    }
  };

  // https://www.filestack.com/fileschool/react/react-file-upload/
  const uploadImage = () => {
    const UPLOAD_URL = "https://api.imgbb.com/1/upload";
    const API_KEY = "0df22f61720b286ac580b7cab12ed3ae";

    const body = new FormData();
    body.set("key", API_KEY);
    body.append("image", imageFile);

    return axios({
      method: "post",
      url: UPLOAD_URL,
      headers: {
        "content-type": "multipart/form-data",
      },
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setUploadProgress(percentCompleted);
      },
      data: body,
    });
  };

  const onSubmit = async (data) => {
    try {
      let imageUri = "";
      if (imageFile) {
        const response = await uploadImage();
        imageUri = response.data.data.url;
        console.log(imageUri);
      }

      const updatedData = imageUri === "" ? data : { ...data, image: imageUri };

      if (editProduct) {
        const editedProduct = await updateItem(
          `${PRODUCTS}/${editProduct.id}`,
          updatedData,
        );
        mutate();
        console.log(editedProduct);
      } else {
        const product = await createItem(PRODUCTS, updatedData);
        mutate();
        console.log(product);
      }
    } catch (error) {
      console.error("Error posting product: ", error);
    } finally {
      setCurrentView(1);
      setImageFile(null);
      setUploadProgress(0);
      if (editProduct) {
        setEditProduct(null);
      }
    }
  };

  const handleCancel = () => {
    setCurrentView(1);
    setImageFile(null);
    setUploadProgress(0);
    if (editProduct) {
      setEditProduct(null);
    }
  };

  return (
    <>
      <form
        className="grid grid-cols-1 md:grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="card w-full shadow-xl">
          <div className="card-body p-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Produk</span>
                <span className="label-text-alt text-error">
                  {errors.name?.message}
                </span>
              </label>
              <input
                type="text"
                placeholder="Nama Produk"
                className="input input-bordered w-full"
                {...register("name")}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Kategori</span>
                <span className="label-text-alt text-error">
                  {errors.categoryId?.message}
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("categoryId", { valueAsNumber: true })}
              >
                <option disabled value="0">
                  Kategori
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Harga Produk</span>
                <span className="label-text-alt text-error">
                  {errors.price?.message}
                </span>
              </label>
              <input
                type="text"
                placeholder="Harga Produk"
                className="input input-bordered w-full"
                {...register("price", { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
        <div className="card w-full shadow-xl">
          <div className="card-body p-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Gambar Produk</span>
              </label>
              <input
                accept="image/*"
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <div className="relative flex flex-col items-center justify-center overflow-hidden pb-2">
                <img ref={imgTagRef} className="object-cover"></img>
                <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full justify-end"></div>
              </div>
              <progress
                className="progress progress-primary"
                value={uploadProgress}
                max="100"
              ></progress>
            </div>
            <div className="mt-auto">
              <button type="submit" className="btn btn-primary btn-block">
                {editProduct ? "Ubah" : "Tambah"}
              </button>
              <button
                type="button"
                className="btn btn-error btn-block mt-2"
                onClick={handleCancel}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

ProductForm.propTypes = {
  setCurrentView: func,
  mutate: func,
  editProduct: object,
  setEditProduct: func,
};

function Products() {
  const { isLoading, data, mutate } = useSWR(
    `${PRODUCTS}?_expand=category`,
    getAllItems,
  );

  const views = {
    1: "Daftar",
    2: "Tambah",
    3: "Ubah",
  };

  const [currentView, setCurrentView] = useState(1);

  const [editProduct, setEditProduct] = useState(null);

  const componentViews = {
    1: (
      <ProductsTable
        data={data}
        setCurrentView={setCurrentView}
        setEditProduct={setEditProduct}
      ></ProductsTable>
    ),
    2: (
      <ProductForm
        setCurrentView={setCurrentView}
        mutate={mutate}
      ></ProductForm>
    ),
    3: (
      <ProductForm
        setCurrentView={setCurrentView}
        mutate={mutate}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
      ></ProductForm>
    ),
  }[currentView];

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold">{views[currentView]} Produk</h1>
      </div>

      <div className="transition-all">{componentViews}</div>
    </>
  );
}

export default Products;
