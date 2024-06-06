"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { LoadingIcon } from '../ui/icons';
import React, { useEffect, useState } from "react";
import { columnsPendingMeasures } from './columns';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PendingMeasureProps } from '@/lib/types';

export function PendingMeasuresDataTable({ totalAmount }: { totalAmount?: number }) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [notifications, setNotifications] = useState<PendingMeasureProps[]>([])
    const [totalPages, setTotalPages] = useState<number>()
    const [limit, setLimit] = useState<string>('10')
    const [page, setPage] = useState<number>(1)

    const table = useReactTable({
        data: notifications,
        columns: columnsPendingMeasures,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        // onColumnVisibilityChange: setColumnVisibility,
        // onRowSelectionChange: setRowSelection,

        initialState: {
            pagination: {
                pageSize: 50, //custom default page size
            },
        },
        state: {
            sorting,
            columnFilters,
            // columnVisibility,
            // rowSelection,
        },
    });

    const searchPendingMeasures = async () => {
        setIsLoading(true)
        try {

            const { data } = await axios.get(`api/notificaciones`, { params: { page, limit } })

            if (data?.totalPages) setTotalPages(parseInt(data.totalPages))
            if (data?.notifications) setNotifications(data.notifications)

        } catch (error) {
            console.log(error)
            toast.error('Ha ocurrido un error al encontrar los resultados')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        searchPendingMeasures()
    }, [page, totalAmount, limit])

    return (
        <div className='w-full overflow-hidden'>
            <div className='h-[55vh] sm:h-[50vh] overflow-auto'>
                {isLoading ? (
                    <div className='h-full flex-center gap-2 py-default'>
                        <LoadingIcon />
                        <p className='text-base font-medium font-slate-300'>Buscando resultados</p>
                    </div>
                ) : (
                    <div className='relative'>
                        <Table>
                            <TableHeader className='sticky top-0'>
                                {table.getHeaderGroups().map((headerGroup) => {
                                    return (
                                        <TableRow key={headerGroup.id} className='w-min'>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id} className='w-min'>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext(),
                                                        )}
                                                    </TableHead>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableHeader>

                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>


            < div className="flex-end flex-wrap gap-6 h-9 mt-3">
                <label className='flex-center bg-slate-100 gap-2 border rounded-full overflow-hidden h-full'>
                    <p className='input_label pl-3 text-slate-400'> Cantidad de filas</p>
                    <select
                        disabled={isLoading}
                        className='p-2 disabled:opacity-50 rounded-full focus:outline-none bg-transparent font-medium'
                        value={limit}
                        onChange={({ target }) => { setPage(1); setLimit(target.value) }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </label>

                {totalPages &&
                    <label className='flex-center bg-slate-100 gap-2 border rounded-full overflow-hidden h-full'>

                        <button
                            className="rounded-full bg-slate-100 p-2 disabled:opacity-50"
                            disabled={page == 1}
                            onClick={() => {
                                setPage(page ? page - 1 : 1)
                            }}
                        >
                            <ArrowIcon direction="left" />
                        </button>

                        <p className={`p-2 ${isLoading ? 'opacity-50' : ''}`}>
                            {page}/{totalPages}
                        </p>

                        <button
                            className="rounded-full bg-slate-100 p-2 disabled:opacity-50"
                            disabled={page == totalPages}
                            onClick={() => {
                                setPage(page ? page + 1 : totalPages ?? 1);
                            }}
                        >
                            <ArrowIcon direction="right" />
                        </button>

                    </label>
                }
            </div>
        </div >

    );
}

export default PendingMeasuresDataTable;

const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-4 h-4 ${direction === "right" ? "rotate-180" : ""}`}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
            />
        </svg>
    );
};
