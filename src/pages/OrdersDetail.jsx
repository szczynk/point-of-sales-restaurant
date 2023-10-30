import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useRef } from "react";
import { Card } from "react-daisyui";
import { Button, Loading } from "react-daisyui";
import {
  AiFillCreditCard,
  AiOutlineCloudDownload,
  AiOutlineUser,
  AiTwotoneCalendar,
} from "react-icons/ai";
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
    cell: (info) => <span className="text-base">{idrPriceFormat(info.getValue())}</span>,
  }),
  columnHelper.accessor("amounts", {
    header: () => <span className="text-base">Quantity</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("subTotal", {
    header: () => <span className="text-base">Sub Total</span>,
    cell: (info) => <span className="text-base">{idrPriceFormat(info.getValue())}</span>,
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
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });


  if (isLoading && isLoadingOrder) {
    return <Loading></Loading>;
  }

  // membuat referensi menggunakan useRef() dengan nama printRef. Referensi ini akan digunakan untuk menunjuk ke elemen HTML dalam komponen
  const printRef = useRef();
  //  menggunakan useReactToPrint dari pustaka "react-to-print" untuk mencetak konten yang terkandung dalam elemen yang dirujuk oleh printRef
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  });


  return (
    <>
      <section>
        <Card>
          <div className="row-auto items-center">
            <div className="md:col-span-6 md:ms-auto md:text-right lg:col-span-6 ">
              <Button className="btn btn-primary mr-4 mt-4" onClick={handlePrint}>
                <AiOutlineCloudDownload size={40}>
                </AiOutlineCloudDownload>
              </Button>
            </div>
          </div>
          <h2 className="mb-4 text-center text-2xl font-bold">
            <b>Detail Transaksi</b>
            <span className=" text-slate-500 block">
              Order ID : {dataOrders?.id}
            </span>
          </h2>
          <Card.Body ref={printRef}>
            <div className="mb-20 mt-10 flex justify-center space-x-4 md:mb-4">
              <div className="md:flex">
                <Card bordered={false} className="mr-40">
                  <article className="inline-flex items-center md:items-start">
                    <div>
                      <Card.Title className="mb-4 ">
                        <AiTwotoneCalendar
                          className="mr-2 inline"
                          size={30}
                        ></AiTwotoneCalendar>
                        <b>Tanggal Transaksi</b>
                      </Card.Title>
                      <p className="mb-1">
                        {dataOrders ? epochToDate(dataOrders.createdAt) : ""}
                      </p>
                    </div>
                  </article>
                </Card>
                <Card bordered={false} className="mr-40">
                  <article className="inline-flex items-center md:items-start">
                    <div>
                      <Card.Title className="mb-4 ">
                        <AiOutlineUser
                          className="w-5"
                          size={20}
                        ></AiOutlineUser>
                        <b>Customer</b>
                      </Card.Title>
                      <p className="mb-1">
                        {dataOrders?.user.name}
                        <br />
                        {dataOrders?.user.email}
                        <br />
                        {dataOrders?.user.phone}
                      </p>
                    </div>
                  </article>
                </Card>
              </div>
              <div className="md:flex">
                <Card bordered={false}>
                  <article className="inline-flex items-center md:items-start">
                    <div>
                      <Card.Title className="mb-4">
                        <AiFillCreditCard
                          className="w-5"
                          size={20}
                        ></AiFillCreditCard>{" "}
                        <b>Order Info</b>
                      </Card.Title>
                      <p className="mb-1">
                        Payment :{" "}
                        {dataOrders ? dataOrders["payment-method"].name : ""}{" "}
                        <br />
                      </p>
                    </div>
                  </article>
                </Card>
              </div>
            </div>
            <div className="overflow-x-auto">
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
                                    ? "cursor-pointer select-none"
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
                    <td colSpan="3" className="text-lg">
                      <article className="float-right mr-20">
                        <dl className="mb-[5px]">
                          <dt>
                            <b>Total :</b>
                          </dt>
                        </dl>
                        <dl className="mb-[5px]">
                          <dt className="text-muted">
                            Status :
                          </dt>
                        </dl>
                      </article>
                    </td>
                    <div className="mt-[10px] text-lg"><b>{idrPriceFormat(dataOrders?.totalPrice)}</b></div>
                    <div className="text-leg mt-[10px] mb-[5px]"><span className="rounded-pill badge alert-success text-success">
                      Payment done
                    </span></div>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      </section>
    </>
  );
}


export default OrdersDetail;
