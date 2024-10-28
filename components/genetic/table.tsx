"use client";

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

import { columnsGenetic } from './columns';
import { GeneticProps } from '@/lib/types';
import DeleteGeneticBtn from './delete-button';
import { useState } from 'react';


export function GeneticsTable({ genetics, pagination, searchGenetics }: {
    genetics: GeneticProps[];
    pagination?: React.ReactNode
    searchGenetics?: any
}) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);


    const table = useReactTable({
        data: genetics,
        columns: columnsGenetic,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        initialState: {
            pagination: {
                pageSize: genetics.length //custom default page size
            },
        },

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className='overflow-auto relative w-full flex flex-col max-h-[70vh]'>
            <table className='w-full'>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => {
                        return (
                            <tr key={headerGroup.id}>
                                <th>Acciones</th>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th key={header.id}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>

                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            <td>
                                <DeleteGeneticBtn id={row.original._id} name={row.original.name} searchGenetics={searchGenetics} />
                            </td>
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
                </tbody>
            </table>
        </div>
    );
}

export default GeneticsTable;