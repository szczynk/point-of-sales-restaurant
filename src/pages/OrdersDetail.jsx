import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useRef } from "react";
import { Button, Card, Loading } from "react-daisyui";
import {
  AiFillCreditCard,
  AiOutlineCloudDownload,
  AiOutlineUser,
  AiTwotoneCalendar,
} from "react-icons/ai";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import useSWR from "swr";

import { getAllItems, getItemById } from "../api/api";
import { ORDERS } from "../api/routes";
import epochToDate from "../utils/epochToDate";
import idrPriceFormat from "../utils/idrPriceFormat";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("product.name", {
    header: () => <span className="text-base">Product</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("product.price", {
    header: () => <span className="text-base">Harga Per-Item</span>,
    cell: (info) => (
      <span className="text-base">{idrPriceFormat(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("amounts", {
    header: () => <span className="text-base">Quantity</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("subTotal", {
    header: () => <span className="text-base">Sub Total</span>,
    cell: (info) => (
      <span className="text-base">{idrPriceFormat(info.getValue())}</span>
    ),
  }),
];

function OrdersDetail() {
  const { id } = useParams();

  const { isLoading, data } = useSWR(
    `${ORDERS}/${id}/order-items?_expand=order&_expand=product`,
    getAllItems,
  );
  const { isLoadingOrder, data: dataOrders } = useSWR(
    `${ORDERS}/${id}?_expand=payment-method&_expand=user`,
    getItemById,
  );

  const defaultData = useMemo(() => [], []);

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  // membuat referensi menggunakan useRef() dengan nama printRef. Referensi ini akan digunakan untuk menunjuk ke elemen HTML dalam komponen
  const printRef = useRef();
  //  menggunakan useReactToPrint dari pustaka "react-to-print" untuk mencetak konten yang terkandung dalam elemen yang dirujuk oleh printRef

  // ambil dom dari konten yang telah dipilih,
  // buat html baru yang akan diprint
  // masukin konten yang telah dipilih ke dalam html-nya,
  // jalan kan window.print()
  // hapus html-nya untuk print baru lagi
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  if (isLoading && isLoadingOrder) {
    return <Loading></Loading>;
  }

  return (
    <>
      <section>
        <Card>
          <div className="row-auto items-center">
            <div className="md:col-span-6 md:ms-auto md:text-right lg:col-span-6 ">
              {/* button ini berguna untuk memprint dengan windowsprint pada umumnya, button tidak akan masuk kedalam print*/}
              <Button
                className="btn btn-primary mr-4 mt-4"
                onClick={handlePrint}
              >
                <AiOutlineCloudDownload size={40}></AiOutlineCloudDownload>
              </Button>
            </div>
          </div>
          {/* dawal dari print*/}
          <div ref={printRef}>
            <h2 className="mb-4 text-center text-2xl font-bold">
              <b>Detail Transaksi</b>
              <span className=" block text-slate-500">
                Order ID : {dataOrders?.id}
              </span>
            </h2>
            <Card.Body>
              {/* awal dari grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <AiTwotoneCalendar
                    className="mr-2 inline"
                    size={30}
                  ></AiTwotoneCalendar>
                  <h1 className="text-xl pb-2 inline-block"><b>Tanggal Transaksi</b></h1>
                  <p className="mb-1">
                    {dataOrders ? epochToDate(dataOrders.createdAt) : ""}
                  </p>
                </div>
                <div className="text-center">
                  <AiOutlineUser
                    className="inline mr-1"
                    size={20}
                  ></AiOutlineUser>
                  <h1 className="text-xl pb-2 inline-block"><b>Customer</b></h1>
                  <p className="mb-1">
                    {dataOrders?.user.name}
                    <br />
                    {dataOrders?.user.email}
                    <br />
                    {dataOrders?.user.phone}
                  </p>
                </div>
                <div className="text-center">
                  <AiFillCreditCard
                    className="inline mr-2"
                    size={20}
                  ></AiFillCreditCard>
                  <h1 className="text-xl pb-2 inline-block"><b>Credit Info</b></h1>
                  <p className="mb-1">
                    Payment :{" "}
                    {dataOrders ? dataOrders["payment-method"].name : ""}{" "}
                    <br />
                  </p>
                </div>
              </div>
              {/* akhir dari grid */}
              {/* membuat table dengan bantuan react table */}
              <table className="table">
                <thead className="bg-slate-300">
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
                                  onClick:
                                    header.column.getToggleSortingHandler(),
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
                <tbody className="">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="pb-0 text-lg">
                      <b className="float-right">Total :</b>
                    </td>
                    <td className="pb-0 text-lg">
                      <b>{idrPriceFormat(dataOrders?.totalPrice)}</b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-muted pt-0 text-lg">
                      <span className="float-right">Status :</span>
                    </td>
                    <td className="pt-0 text-lg">
                      <span className="text-success">Payment done</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* akhir dari table */}
            </Card.Body>
          </div>
          {/* akhir dari print */}
        </Card>
      </section>
    </>
  );
}

export default OrdersDetail;
