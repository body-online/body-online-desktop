"use client";

import React from "react";
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

import { columnsCattle } from './columns';
import { CattleProps } from '@/lib/types';
import AddEventBtn from './add-event';
import DeleteCattleBtn from './delete-button';
import { useRouter } from 'next/navigation';


export function CattlesTable({ cattles, pageSize, searchCattles }: {
    cattles: CattleProps[];
    pageSize: number;
    searchCattles: () => void;
}) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);


    const table = useReactTable({
        data: cattles,
        columns: columnsCattle,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        initialState: {
            pagination: {
                pageSize //custom default page size
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
        <div className="md:h-[60vh] overflow-auto relative">
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => {
                        return (
                            <tr key={headerGroup.id}>
                                <th> Acciones</th>
                                {headerGroup.headers.map((header, index) => {
                                    return (
                                        <th key={header.id}>
                                            <p>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                            </p>
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
                                <div className="flex items-center gap-3">
                                    <AddEventBtn defaultCattle={row.original} handleRefresh={() => searchCattles()} />
                                    {/* <HistoryBtn
                                    cattleId={row.original._id}
                                    cattleCaravan={row.original.caravan}
                                /> */}
                                    <DeleteCattleBtn
                                        handleRefresh={() => searchCattles()}
                                        id={row.original._id}
                                        name={row.original.caravan}
                                    />
                                </div>
                            </td>

                            {row.getVisibleCells().map((cell, index) => (
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

export default CattlesTable;