import { Card } from "react-daisyui";
import imgCalendar from "../img/calendar.png"
import 'react-datepicker/dist/react-datepicker.css';
import { rankItem } from "@tanstack/match-sorter-utils";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { Button, Input, Loading, Pagination, Select } from "react-daisyui";

import { getAllItems, getItemById } from "../api/api";
import { ORDERS, ORDER_ITEMS } from "../api/routes";
import ChevronLeftIcon from "../components/icons/ChevronLeftIcon";
import ChevronLeftLineIcon from "../components/icons/ChevronLeftLineIcon";
import ChevronRightIcon from "../components/icons/ChevronRightIcon";
import ChevronRightLineIcon from "../components/icons/ChevronRightLineIcon";
import absoluteRange from "../utils/absoluteRange";
import idrPriceFormat from "../utils/idrPriceFormat";


const columnHelper = createColumnHelper();



const columns = [
    columnHelper.accessor("product.name", {
        header: () => (
            <span className="text-base">
                Product
            </span>
        ),
        cell: (info) => (
            <span className="text-base">
                {info.getValue()}
            </span>
        )
    }),
    columnHelper.accessor("product.price", {
        header: () =>
            <span className="text-base">Harga Per-Unit</span>,
        cell: (info) => <span className="text-base">{info.getValue()}</span>
    }),
    columnHelper.accessor("amounts", {
        header: () => (
            <span className="text-base">
                Quantity
            </span>
        ),
        cell: (info) =>
            <span className="text-base">
                {info.getValue()}
            </span>
    }),
    columnHelper.accessor("order.totalPrice", {
        header: () =>
            <span className="text-base">Total Harga</span>,
        cell: (info) =>
            <span className="text-base">{info.getValue()}</span>
    })

];

function OrdersDetail() {
    const { id } = useParams();


    const { isLoading, data } = useSWR(
        `${ORDERS}/${id}/order-items?_expand=order&_expand=product`,
        getAllItems
    );
    const { loadingIs, data: dataOrders } = useSWR(
        `${ORDERS}/${id}?_expand=payment-method&_expand=user`,
        getItemById
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

    if (isLoading && loadingIs) {
        return <Loading></Loading>;
    }




    return (
        <>
            <section>
                <div>
                    <div>
                        <h2 className="text-center"><b>Order Detail</b></h2>

                    </div>
                </div>
                <Card>
                    <div className="row-auto items-center">
                        <div className="lg:w-1/2 md:w-1/2 mb-lg-0 mb-15">
                            <span className=" ml-3 mt-3 block"><img src={imgCalendar} alt="" className="w-5 inline" /> {new Date().toLocaleString()}</span>
                            <span className="ml-3 text-slate-500">Order ID: {dataOrders?.id}</span>
                        </div>

                        <div className="lg:col-span-6 md:col-span-6 md:ms-auto md:text-right">
                            <Button className="mr-4">
                                <a href="#" >Print</a>
                            </Button>
                        </div>
                    </div>
                    <Card.Body>
                        <div className="flex justify-center space-x-4 mb-20 mt-10 md:mb-4">
                            <div className="md:flex">
                                <Card bordered={false} className="mr-40">
                                    <article className="inline-flex items-center md:items-start">
                                        <div>
                                            <Card.Title className="mb-4"><b>Customer</b></Card.Title>
                                            <p className="mb-1">
                                                {dataOrders?.user.name}<br />
                                                {dataOrders?.user.email}<br />
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
                                            <Card.Title className="mb-4"><b>Order Info</b></Card.Title>
                                            <p className="mb-1">

                                                Payment : {dataOrders ? dataOrders["payment-method"].name : ""} <br />
                                            </p>
                                        </div>
                                    </article>
                                </Card>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead className="bg-slate-400">
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
                                    <tr>
                                        <td colSpan="4">
                                            <article className="float-right">
                                                <dl className="mb-[5px]">
                                                    <dt>Total: <b>{idrPriceFormat("1000")}</b></dt>
                                                </dl>
                                                <dl className="mb-[5px]">
                                                    <dt className="text-muted">Status: <span className="badge rounded-pill alert-success text-success">Payment done</span></dt>
                                                </dl>
                                            </article>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
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
                                <div>Detail Per Page</div>
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
                                    <ChevronLeftLineIcon></ChevronLeftLineIcon>
                                </Button>
                                <Button
                                    className="join-item"
                                    disabled={!table.getCanPreviousPage()}
                                    onClick={handlePrevPage}
                                >
                                    <ChevronLeftIcon></ChevronLeftIcon>
                                </Button>
                                <Button
                                    className="join-item"
                                    disabled={!table.getCanNextPage()}
                                    onClick={handleNextPage}
                                >
                                    <ChevronRightIcon></ChevronRightIcon>
                                </Button>
                                <Button
                                    className="join-item"
                                    disabled={!table.getCanNextPage()}
                                    onClick={handleLastPage}
                                >
                                    <ChevronRightLineIcon></ChevronRightLineIcon>
                                </Button>
                            </Pagination>
                        </div>
                    </Card.Body>
                </Card>
            </section >
        </>
    );
}

export default OrdersDetail;