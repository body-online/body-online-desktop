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
        <div>
            {genetics.length > 0 && (
                <label className="flex gap-2 items-center px-4 md:px-5 w-full">
                    <SearchIcon fill="fill-slate-500" />
                    <input
                        className={`text-base h-12 border-none bg-transparent focus:outline-none w-full md:w-[200px] placeholder:text-slate-500`}
                        disabled={!genetics.length}
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={({ target }) => setSearchTerm(target.value)}
                    />
                </label>
            )}

            <ResizablePanel changeIndicator={`${table.getRowModel().rows?.length}`}>
                {table.getRowModel().rows?.length ? (
                    <>
                        <div className='realtive max-h-96 overflow-auto'>
                            <Table key={`table-${table.getRowModel().rows?.length ?? 0}`}>
                                <TableHeader className='sticky top-0 w-full z-20'>
                                    {table.getHeaderGroups().map((headerGroup) => {
                                        return (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => {
                                                    return (
                                                        <TableHead key={header.id} className='group'>
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

                        <div className="flex-end w-full gap-2 mt-4 pb-5 px-5">
                            <button
                                className="table_btn_pag"
                                disabled={!table.getCanPreviousPage()}
                                onClick={() => {
                                    table.previousPage();
                                }}
                            >
                                <ArrowIcon direction="left" />
                            </button>
                            <button
                                className="table_btn_pag"
                                disabled={!table.getCanNextPage()}
                                onClick={() => {
                                    table.nextPage();
                                }}
                            >
                                <ArrowIcon direction="right" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="px-4 md:px-5 py-6">
                        <InfoMessage
                            type={"censored"}
                            title={`Sin resultados`}
                            subtitle={searchTerm ? `No hemos econtrado resultados para "${searchTerm}"` : undefined}
                        />
                    </div>
                )}
            </ResizablePanel>

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
