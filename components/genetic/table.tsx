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

import React, { useEffect, useState } from "react";
import InfoMessage from '../ui/info';
import { SearchIcon } from '../ui/icons';
import ResizablePanel from '../ui/resizable-panel';

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
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        [],
    );

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
        <div className='overflow-auto relative w-full flex flex-col h-full max-h-96'>
            {genetics.length > 0 && (
                <label className='flex flex-wrap gap-3 mb-3 max-w-sm'>
                    <div className="flex input gap-3 items-center w-full">
                        <SearchIcon fill={`${!genetics ? 'fill-slate-300' : 'fill-slate-400'}`} />
                        <input
                            className={`text-base h-12 border-none bg-transparent focus:outline-none w-full placeholder:text-slate-400 placeholder:font-normal disabled:opacity-50 md:max-w-sm`}
                            disabled={!genetics.length}
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={({ target }) => setSearchTerm(target.value)}
                        />
                    </div>
                </label>
            )}

            <div className='h-[65vh] sm:h-[50vh] overflow-auto'>
                {table.getRowModel().rows?.length ? (
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
                ) : (
                    <div className="px-4 md:px-5 py-6">
                        <InfoMessage
                            type={"censored"}
                            title={`Sin resultados`}
                            subtitle={searchTerm ? `No hemos econtrado resultados para "${searchTerm}"` : undefined}
                        />
                    </div>
                )}
            </div>

        </div >
    );
}

export default GeneticsDataTable;

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
