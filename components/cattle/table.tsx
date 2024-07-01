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
import { columnsCattle } from './columns';
import axios from 'axios';
import toast from 'react-hot-toast';

export function CattlesDataTable({ totalAmount }: { totalAmount?: number }) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState("")

    const [cattles, setCattles] = useState([])
    const [totalPages, setTotalPages] = useState<number>()
    const [limit, setLimit] = useState<string>('10')
    const [page, setPage] = useState<number>(1)

    const table = useReactTable({
        data: cattles,
        columns: columnsCattle,
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

    const searchCattles = async () => {
        setIsLoading(true)
        try {
            const { data } = await axios.get(`api/cattles`, { params: { page, limit, name: searchTerm } })

            if (data?.totalPages) setTotalPages(parseInt(data.totalPages))
            if (data?.cattles) setCattles(data.cattles)

        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        searchCattles()
    }, [page, totalAmount, limit])

    return (
        <div>

            <form
                className='flex flex-wrap gap-3 mb-3'
                onSubmit={(e) => { e.preventDefault(); searchCattles() }}
            >
                <label className='w-full max-w-sm'>
                    <div className="flex input gap-3 items-center w-full">
                        <SearchIcon fill={`${isLoading ? 'fill-slate-300' : 'fill-slate-400'}`} />
                        <input
                            className={`text-base h-12 border-none bg-transparent focus:outline-none w-full placeholder:text-slate-400 placeholder:font-normal disabled:opacity-50 md:max-w-sm`}
                            disabled={!cattles}
                            placeholder="Buscar caravana..."
                            value={searchTerm}
                            onChange={({ target }) => setSearchTerm(target.value)}
                        />
                    </div>
                </label>
            </form>

            <div className='h-max overflow-auto'>
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
                <label className='pagination'>
                    <p className='text-xs px-2 m-auto '>Cantidad de filas</p>
                    <select
                        disabled={isLoading}
                        className='dark:bg-cgray dark:text-white'
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
                    <label className='pagination'>
                        <button
                            className="table_btn_pag"
                            disabled={page == 1}
                            onClick={() => {
                                setPage(page ? page - 1 : 1)
                            }}
                        >
                            <ArrowsIcon direction="rotate-90" />
                        </button>

                        <p className={`text-xs px-2 m-auto ${isLoading ? 'opacity-50' : ''}`}>
                            Pág. {page} de {totalPages}
                        </p>

                        <button
                            className="table_btn_pag"
                            disabled={page == totalPages}
                            onClick={() => {
                                setPage(page ? page + 1 : totalPages ?? 1);
                            }}
                        >
                            <ArrowsIcon direction="-rotate-90" />
                        </button>

                    </label>
                }
            </div>
        </div >


    );
}

export default CattlesDataTable;

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
