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
import { useMemo, useState } from "react";
import { Button, Input, Loading, Pagination, Select } from "react-daisyui";
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
import { Link } from "react-router-dom";
import useSWR from "swr";

import { getAllItems } from "../api/api";
import { ORDERS } from "../api/routes";
import DebouncedInput from "../components/DebouncedInput";
import absoluteRange from "../utils/absoluteRange";
import epochToDate from "../utils/epochToDate";
import idrPriceFormat from "../utils/idrPriceFormat";

// https://codesandbox.io/p/sandbox/github/tanstack/table/tree/main/examples/react/filters?embed=1&file=%2Fsrc%2Fmain.tsx%3A294%2C13-294%2C48
const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("createdAt", {
    header: () => <span className="text-base">Tanggal Transaksi</span>,
    cell: (info) => (
      <span className="text-base">{epochToDate(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("id", {
    header: () => <span className="text-base">ID Transaksi</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("user.name", {
    header: () => <span className="text-base">Customer</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("payment-method.name", {
    header: () => <span className="text-base">Jenis Pembayaran</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("totalPrice", {
    header: () => <span className="text-base">Total Harga</span>,
    cell: (info) => (
      <span className="text-base">{idrPriceFormat(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("id", {
    id: "actions",
    header: () => <span className="text-base">Actions</span>,
    cell: (info) => (
      <Link
        to={`/transactions/${info.row.original.id}`}
        className="btn btn-primary"
      >
        details
      </Link>
    ),
    enableSorting: false,
  }),
];

function Transactions() {
  const { isLoading, data } = useSWR(
    `${ORDERS}?_expand=payment-method&_expand=user`,
    getAllItems,
  );

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
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

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
      </div>
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
            {[5, 10, 25, 50, 100].map((pageSize) => (
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

export default Transactions;
