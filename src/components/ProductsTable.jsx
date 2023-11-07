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
import { array, func, number } from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { Button, Input, Pagination, Select } from "react-daisyui";
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

import { deleteItem } from "../api/api";
import { PRODUCTS } from "../api/routes";
import absoluteRange from "../utils/absoluteRange";
import epochToDate from "../utils/epochToDate";
import idrPriceFormat from "../utils/idrPriceFormat";
import DebouncedInput from "./DebouncedInput";
import ModalProductDelete from "./ModalProductDelete";

function ProductsTable(props) {
  const {
    data,
    pageIndex,
    pageSize,
    setPagination,
    setCurrentView,
    mutate,
    setEditProduct,
  } = props;
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

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
            className="h-[3.25rem] w-[3.25rem] rounded-lg"
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
          <button
            type="button"
            className="btn btn-error"
            onClick={() => openDeleteModal(info.row.original)}
          >
            delete
          </button>
        </div>
      ),
      enableSorting: false,
    }),
  ];

  const pageSizeOptions = [4, 10, 25, 50, 100];

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

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setDeleteModalOpen(false);
  };

  async function handleDelete() {
    try {
      // Hapus produk menggunakan API
      await deleteItem(`${PRODUCTS}/${itemToDelete.id}`);
    } catch (error) {
      console.error("Error deleting product: ", error);
      // Tampilkan pesan kesalahan jika diperlukan
    } finally {
      // Perbarui data dengan memanggil mutate
      mutate();
      // Tutup modal setelah penghapusan berhasil
      closeDeleteModal();
    }
  }

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
            {pageSizeOptions.map((pageSize) => (
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
              className="w-20"
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
      <ModalProductDelete
        isOpen={isDeleteModalOpen}
        handleClose={closeDeleteModal}
        title="Konfirmasi Hapus"
        text={
          itemToDelete
            ? `Anda yakin ingin menghapus produk ${itemToDelete.name}?`
            : ""
        }
        handleConfirmDelete={handleDelete}
      />
    </>
  );
}

ProductsTable.propTypes = {
  data: array,
  pageIndex: number,
  pageSize: number,
  setPagination: func,
  setCurrentView: func,
  mutate: func,
  setEditProduct: func,
};

export default ProductsTable;
