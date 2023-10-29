import { rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useMemo, useRef, useState } from "react";
import { Card } from "react-daisyui";
import { Button, Loading } from "react-daisyui";
import { AiFillCreditCard, AiOutlineCloudDownload, AiOutlineUser, AiTwotoneCalendar } from "react-icons/ai";
import { useParams } from "react-router-dom";
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
    header: () => <span className="text-base">Harga Per-Unit</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("amounts", {
    header: () => <span className="text-base">Quantity</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
  columnHelper.accessor("subTotal", {
    header: () => <span className="text-base">Sub Total</span>,
    cell: (info) => <span className="text-base">{info.getValue()}</span>,
  }),
];

function OrdersDetail() {
  const { id } = useParams();

  const { isLoading, data } = useSWR(
    `${ORDERS}/${id}/order-items?_expand=order&_expand=product`,
    getAllItems,
  );
  const { loadingIs, data: dataOrders } = useSWR(
    `${ORDERS}/${id}?_expand=payment-method&_expand=user`,
    getItemById,
  );

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
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

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta(itemRank);

    return itemRank.passed;
  };

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onPaginationChange: setPagination,
    state: {
      pagination,
      globalFilter,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  if (isLoading && loadingIs) {
    return <Loading></Loading>;
  }

  const pdfRef = useRef();
  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('img/png');
      const pdf = new jsPDF('l', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${dataOrders?.user.name}_invoice.pdf`);
    });
  };

  return (
    <>
      <section ref={pdfRef}>
        <div>
          <div>
            <h2 className="text-center text-2xl font-bold mb-4">
              <b>Detail Transaksi</b>
            </h2>
          </div>
        </div>
        <Card>
          <div className="row-auto items-center">
            <div className="mb-lg-0 mb-15 md:w-1/2 lg:w-1/2">
              <span className=" ml-3 mt-3 block">
                <AiTwotoneCalendar className="inline mr-2" size={30}></AiTwotoneCalendar>
                {dataOrders ? epochToDate(dataOrders.createdAt) : ""}
              </span>
              <span className="ml-4 text-slate-500">
                Order ID: {dataOrders?.id}
              </span>
            </div>

            <div className="md:col-span-6 md:ms-auto md:text-right lg:col-span-6 ">
              <Button className="mr-4 btn btn-primary" onClick={downloadPDF}>
                <AiOutlineCloudDownload size={40}></AiOutlineCloudDownload>
              </Button>
            </div>
          </div>
          <Card.Body>
            <div className="mb-20 mt-10 flex justify-center space-x-4 md:mb-4">
              <div className="md:flex">
                <Card bordered={false} className="mr-40">
                  <article className="inline-flex items-center md:items-start">
                    <div>

                      <Card.Title className="mb-4">
                        <AiOutlineUser className="w-5" size={20}></AiOutlineUser><b>Customer</b>
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
                        <AiFillCreditCard className="w-5" size={20}></AiFillCreditCard> <b>Order Info</b>
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
                <thead className="btn-primary">
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
                <tbody>
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
                    <td colSpan="4">
                      <article className="float-right">
                        <dl className="mb-[5px]">
                          <dt>
                            Total:{" "}
                            <b>{idrPriceFormat(dataOrders?.totalPrice)}</b>
                          </dt>
                        </dl>
                        <dl className="mb-[5px]">
                          <dt className="text-muted">
                            Status:{" "}
                            <span className="rounded-pill badge alert-success text-success">
                              Payment done
                            </span>
                          </dt>
                        </dl>
                      </article>
                    </td>
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
