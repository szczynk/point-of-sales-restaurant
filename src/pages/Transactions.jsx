import { rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button, Input, Loading, Pagination, Select } from "react-daisyui";
import { Link } from "react-router-dom";
import useSWR from "swr";

import { getAllItems } from "../api/api";
import { ORDERS } from "../api/routes";
import ChevronLeft from "../components/ChevronLeft";
import ChevronLeftLine from "../components/ChevronLeftLine";
import ChevronRight from "../components/ChevronRight";
import ChevronRightLine from "../components/ChevronRightLine";
import epochToDate from "../utils/epochToDate";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("createdAt", {
    header: () => (
      <span className="text-base">
        Tanggal<br></br>Transaksi
      </span>
    ),
    cell: (info) => (
      <span className="text-base">{epochToDate(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("id", {
    header: () => (
      <span className="text-base">
        ID<br></br>Transaksi
      </span>
    ),
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("user.name", {
    header: () => <span className="text-base">Customer</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("payment-method.name", {
    header: () => (
      <span className="text-base">
        Jenis<br></br>Pembayaran
      </span>
    ),
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("totalPrice", {
    header: () => <span className="text-base">Total Harga</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("id", {
    id: "actions",
    header: () => <span className="text-base">Actions</span>,
    cell: (info) => (
      <Link to={`/transactions/${info.getValue()}`} className="btn btn-primary">
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

  const [globalFilter, setGlobalFilter] = useState("");

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the ranking info
    addMeta(itemRank);

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    state: {
      globalFilter,
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
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    table.setPageIndex(page);
  };

  const handleLimit = (event) => {
    table.setPageSize(Number(event.target.value));
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <>
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
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted()] ?? null}
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
      <div className="mt-6 flex flex-wrap justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select
            value={table.getState().pagination.pageSize}
            onChange={handleLimit}
          >
            {[1, 10, 25, 50, 100].map((pageSize) => (
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
              defaultValue={table.getState().pagination.pageIndex + 1}
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
            <ChevronLeftLine></ChevronLeftLine>
          </Button>
          <Button
            className="join-item"
            disabled={!table.getCanPreviousPage()}
            onClick={handlePrevPage}
          >
            <ChevronLeft></ChevronLeft>
          </Button>
          <Button
            className="join-item"
            disabled={!table.getCanNextPage()}
            onClick={handleNextPage}
          >
            <ChevronRight></ChevronRight>
          </Button>
          <Button
            className="join-item"
            disabled={!table.getCanNextPage()}
            onClick={handleLastPage}
          >
            <ChevronRightLine></ChevronRightLine>
          </Button>
        </Pagination>
      </div>
    </>
  );
}

export default Transactions;
