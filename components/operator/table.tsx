"use client";

import React, { useEffect, useState } from "react";
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

import { columnsUser } from './columns';
import { ExtendedUser } from '@/next-auth';


export function OperatorsTable({ users, pageSize, pagination }: {
    users: ExtendedUser[];
    pageSize: number,
    pagination?: React.ReactNode
}) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);


    const table = useReactTable({
        data: users,
        columns: columnsUser,
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
        <>
            <div className="overflow-auto relative w-full flex flex-col max-h-[58vh] md:max-h-[65vh]">
                <table>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => {
                            return (
                                <tr key={headerGroup.id}>
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

            {pagination}
        </>

    );
}

export default OperatorsTable;