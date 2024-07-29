"use client";

import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import {
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

import { getCattles } from '@/data/cattle';
import { CattleProps } from '@/lib/types';
import { columnsCattle } from './columns';

import LoadingRowsSkeleton from '../ui/loading-rows-skeleton';
import { ArrowsIcon, SearchIcon } from '../ui/icons';
import InfoMessage from '../ui/info';

export function CattlesDataTable({ totalAmount, totalEvents }: { totalAmount?: number; totalEvents?: number }) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState("")

    const [cattles, setCattles] = useState<CattleProps[]>([])
    const [totalPages, setTotalPages] = useState<number>()
    const [limit, setLimit] = useState<number>(10)
    const [page, setPage] = useState<number>(1)

    const table = useReactTable({
        data: cattles,
        columns: columnsCattle,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        initialState: {
            pagination: {
                pageSize: 60, //custom default page size
            },
        },

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
    });

    const searchCattles = async () => {
        setIsLoading(true)
        try {
            const { data } = await getCattles({ page, limit, name: searchTerm })
            if (data) {
                setTotalPages(Number(data.totalPages) > 0 ? Number(data.totalPages) : 1)
                setCattles(data.cattles)
            }
        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        searchCattles();
    }, [page, totalAmount, limit, totalEvents])

    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1)
            searchCattles();
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm])

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); searchCattles() }}>
                <div className="px-3 md:px-5">
                    <label>
                        <div className="flex input gap-3 items-center w-full max-w-sm">
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
                </div>
            </form>

            <div className='overflow-auto relative w-full flex flex-col max-h-[70vh]'>
                {isLoading ? (
                    <div className='py-default px-default'>
                        <LoadingRowsSkeleton />
                    </div>
                ) : (
                    <>
                        {cattles.length > 0 ?
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
                            </Table> : <InfoMessage
                                type='censored'
                                title='No hemos encontrado resultados'
                                subtitle={!searchTerm ? 'Debes crear un individuo para continuar' :
                                    `No hemos encontrado caravanas que contengan ${searchTerm}`}
                            />
                        }
                    </>
                )}
            </div>

            <div className="flex-end gap-3 p-3 md:p-5">
                <label className='pagination px-3'>
                    <p className='text-xs pl-2 m-auto'>Filas</p>
                    <select
                        disabled={isLoading}
                        className='dark:bg-cgray dark:text-white text-xs focus:outline-none active:outline-none'
                        value={limit}
                        onChange={({ target }) => { setPage(1); setLimit(Number(target.value)) }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                        <option value="60">60</option>
                    </select>
                </label>

                {totalPages &&
                    <div className="pagination">
                        <button
                            className="table_btn_pag"
                            disabled={page === 1}
                            onClick={() => setPage(1)}
                        >
                            <div className="flex">
                                <ArrowsIcon direction="rotate-90 -mr-4" />
                                <ArrowsIcon direction="rotate-90" />
                            </div>
                        </button>
                        <button
                            className="table_btn_pag"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ArrowsIcon direction="rotate-90" />
                        </button>

                        <p className="text-xs px-2 m-auto">{page} / {totalPages}</p>

                        <button
                            className="table_btn_pag"
                            disabled={page === totalPages || totalPages === 1 || !totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            <ArrowsIcon direction="-rotate-90" />
                        </button>
                        <button
                            className="table_btn_pag"
                            disabled={page === totalPages || totalPages === 1 || !totalPages}
                            onClick={() => setPage(totalPages)}
                        >
                            <div className="flex">
                                <ArrowsIcon direction="-rotate-90 -mr-4" />
                                <ArrowsIcon direction="-rotate-90" />
                            </div>
                        </button>
                    </div>

                }
            </div>
        </div >
    );
}

export default CattlesDataTable;