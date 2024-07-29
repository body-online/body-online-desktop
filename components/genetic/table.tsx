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

import { ArrowsIcon, SearchIcon } from '../ui/icons';
import React, { useEffect, useState } from "react";

import toast from 'react-hot-toast';
import InfoMessage from '../ui/info';
import { getGenetics } from '@/data/genetic';
import { GeneticProps } from '@/lib/types';
import { columnsGenetic } from './columns';
import LoadingRowsSkeleton from '../ui/loading-rows-skeleton';


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    genetics: TData[];
}

export function GeneticsDataTable<TData, TValue>({
    columns,
    genetics
}: DataTableProps<TData, TValue>) {
    const [searchTerm, setSearchTerm] = useState("")
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: genetics,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        // onColumnVisibilityChange: setColumnVisibility,
        // onRowSelectionChange: setRowSelection,

        state: {
            sorting,
            columnFilters,
            // columnVisibility,
            // rowSelection,
        },
    });

    // debounce input filter
    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchChange();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const onSearchChange = () => {
        table.getColumn("name")?.setFilterValue(searchTerm);
    }
    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); }}>
                <div className="px-3 md:px-5">
                    <label>
                        <div className="flex input gap-3 items-center w-full max-w-sm">
                            <SearchIcon fill={`fill-slate-400`} />
                            <input
                                className={`text-base h-12 border-none bg-transparent focus:outline-none w-full placeholder:text-slate-400 placeholder:font-normal disabled:opacity-50 md:max-w-sm`}
                                disabled={!genetics}
                                placeholder="Buscar ubicación..."
                                value={searchTerm}
                                onChange={({ target }) => setSearchTerm(target.value)}
                            />
                        </div>
                    </label>
                </div>
            </form>

            <div className='overflow-auto relative w-full flex flex-col max-h-[70vh]'>
                {genetics.length ? (
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
                    </Table>
                ) : (
                    <InfoMessage
                        type='censored'
                        title='No hemos encontrado resultados'
                        subtitle={!searchTerm ? 'Debes crear un ubicaciones para continuar' :
                            `No hemos encontrado caravanas que contengan ${searchTerm}`}
                    />
                )}
            </div>

            <div className="flex-end gap-3 p-3 md:p-5">
            </div>
        </div>
    );

}

export default GeneticsDataTable;