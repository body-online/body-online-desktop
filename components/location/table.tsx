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

import { ArrowsIcon, LoadingIcon, SearchIcon } from '../ui/icons';
import React, { useEffect, useState } from "react";
import { columnsLocation } from './columns';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getLocations } from '@/data/location';
import { LocationProps } from '@/lib/types';

export function LocationsDataTable({ totalAmount }: { totalAmount?: number }) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState("")

    const [locations, setLocations] = useState<LocationProps[]>([])
    const [totalPages, setTotalPages] = useState<number>()
    const [limit, setLimit] = useState<number>(10)
    const [page, setPage] = useState<number>(1)

    const table = useReactTable({
        data: locations,
        columns: columnsLocation,
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

    const searchLocations = async () => {
        setIsLoading(true)
        try {
            const { data } = await getLocations({ page, limit, name: searchTerm })
            if (data?.totalPages) setTotalPages(Number(data.totalPages))
            if (data?.locations) setLocations(data.locations)

        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        searchLocations()
    }, [page, totalAmount, limit])

    return (
        <div className='space-y-3'>
            <form onSubmit={(e) => { e.preventDefault(); searchLocations() }}>

                <div className=" p-3 md:p-5">
                    <label>
                        <div className="flex input gap-3 items-center w-full max-w-sm">
                            <SearchIcon fill={`${isLoading ? 'fill-slate-300' : 'fill-slate-400'}`} />
                            <input
                                className={`text-base h-12 border-none bg-transparent focus:outline-none w-full placeholder:text-slate-400 placeholder:font-normal disabled:opacity-50 md:max-w-sm`}
                                disabled={!locations}
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={({ target }) => setSearchTerm(target.value)}
                            />
                        </div>
                    </label>
                    <p className="opacity-50 text-xs mt-1">
                        Presione <b>Enter / Ir</b> para buscar
                    </p>
                </div>
            </form>

            <div className='overflow-auto relative w-full flex flex-col h-full max-h-96'>
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

export default LocationsDataTable;

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
