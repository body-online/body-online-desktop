"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
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

import { ArrowsIcon, LoadingIcon, SearchIcon } from '../ui/icons';
import React, { useEffect, useState } from "react";

import toast from 'react-hot-toast';
import InfoMessage from '../ui/info';
import { getEvents } from '@/data/events';
import { EventProps } from '@/lib/types';
import { columnsEvent } from './columns';

export function EventsDataTable({ totalAmount, totalEvents }: { totalAmount?: number; totalEvents?: number }) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState("")

    const [events, setEvents] = useState<EventProps[]>([])
    const [totalPages, setTotalPages] = useState<number>()
    const [limit, setLimit] = useState<number>(10)
    const [page, setPage] = useState<number>(1)

    const table = useReactTable(
        {
            data: events,
            columns: columnsEvent,
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
        }
    );

    const searchEvents = async () => {
        setIsLoading(true)
        try {
            const { data } = await getEvents({ page, limit })

            if (data?.totalPages) setTotalPages(Number(data.totalPages))
            if (data?.events) setEvents(data.events)

        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        searchEvents()
    }, [page, totalAmount, limit, totalEvents])

    useEffect(() => {
        const handler = setTimeout(() => {
            searchEvents();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm])

    return (
        <div className='space-y-3'>
            <form onSubmit={(e) => { e.preventDefault(); searchEvents() }}>

                <div className=" p-3 md:p-5">
                    <label>
                        <div className="flex input gap-3 items-center w-full max-w-sm">
                            <SearchIcon fill={`${isLoading ? 'fill-slate-300' : 'fill-slate-400'}`} />
                            <input
                                className={`text-base h-12 border-none bg-transparent focus:outline-none w-full placeholder:text-slate-400 placeholder:font-normal disabled:opacity-50 md:max-w-sm`}
                                disabled={!events}
                                placeholder="Buscar caravana..."
                                value={searchTerm}
                                onChange={({ target }) => setSearchTerm(target.value)}
                            />
                        </div>
                    </label>
                </div>
            </form>

            <div className='overflow-auto relative w-full flex flex-col h-full max-h-96'>
                {isLoading ? (
                    <div className='py-default'>
                        <LoadingIcon />
                    </div>
                ) : (
                    <>
                        {events.length > 0 ?
                            <Table className='relative'>
                                <TableHeader className='sticky top-0'>
                                    {table.getHeaderGroups().map((headerGroup) => {
                                        return (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => {
                                                    return (
                                                        <TableHead key={header.id}>
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
                            </Table> : <InfoMessage type='censored' title='No hemos encontrado resultados' />
                        }
                    </>
                )}
            </div>

            <div className="flex-end gap-3 p-3 md:p-5">
                <label className='pagination'>
                    <p className='text-xs pl-2 m-auto'>Cantidad de filas</p>
                    <select
                        disabled={isLoading}
                        className='dark:bg-cgray dark:text-white'
                        value={limit}
                        onChange={({ target }) => { setPage(1); setLimit(Number(target.value)) }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </label>

                {totalPages &&
                    <div className="pagination">
                        <button
                            className="table_btn_pag"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ArrowsIcon direction="rotate-90" />
                        </button>

                        <p className="text-xs px-2 m-auto">Pág. {page} de {totalPages}</p>

                        <button
                            className="table_btn_pag"
                            disabled={page === totalPages || totalPages === 1 || !totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            <ArrowsIcon direction="-rotate-90" />
                        </button>
                    </div>

                }
            </div>
        </div >


    );
}

export default EventsDataTable;

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
