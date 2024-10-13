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
import LoadingRowsSkeleton from '../ui/loading-rows-skeleton';
import AddEventBtn from '../cattles/add-event';
import StatePagination from '../ui/state-pagination';

export function EventsDataTable({ totalAmount, totalEvents }: { totalAmount?: number; totalEvents?: number }) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState("")

    const [events, setEvents] = useState<EventProps[]>([])
    const [totalPages, setTotalPages] = useState<number>()
    const [limit, setLimit] = useState<number>(10)
    const [page, setPage] = useState<number>(1)

    const table = useReactTable({
        data: events,
        columns: columnsEvent,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,

        state: {
            sorting,
            columnFilters,
        },
    });

    const searchEvents = async () => {
        setIsLoading(true)
        try {
            const { data } = await getEvents({ page, limit })
            if (data) {
                setTotalPages(Number(data.totalPages) > 0 ? Number(data.totalPages) : 1)
                setEvents(data.events)
            }
        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        searchEvents();
    }, [page, totalAmount, limit, totalEvents])

    useEffect(() => {
        const handler = setTimeout(() => {
            setPage(1)
            searchEvents();
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm])

    return (
        <div className='card max-h-max w-full'>
            <div className="pt-4 px-4">
                <div className="flex-between mb-2">

                    <h2 className='font-semibold text-xl'>Eventos</h2>


                    <div className="flex gap-2 items-center">
                        {isLoading ? <LoadingIcon /> :
                            <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                                {events?.length} {(events?.length ?? 0) != 1 ? 'registros' : 'registro'}
                            </p>
                        }
                        <AddEventBtn handleRefresh={searchEvents} />
                    </div>
                </div>
            </div>


            <div className="mb-2 px-4 space-y-2">
                {/* <FilterInput
                    placeholder='Buscar por nombre...'
                    onChange={(e) => setSearchTerm(e)}
                    disabled={!locations.length && !searchTerm}
                /> */}


            </div>

            {isLoading ? (
                <LoadingRowsSkeleton />
            ) : (
                <>
                    {events.length > 0 ?
                        <div className='overflow-auto relative w-full flex flex-col max-h-[70vh]'>
                            <table>
                                <thead>
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
                                </thead>

                                <tbody>
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
                                </tbody>
                            </table>
                        </div>
                        :
                        <InfoMessage
                            type='censored'
                            title='Sin resultados'
                            subtitle={!searchTerm ? 'Debes crear un evento para continuar' :
                                `No hemos encontrado eventos que contengan ${searchTerm}`}
                        />
                    }
                </>
            )}

            <div className="p-2">
                <StatePagination
                    changePage={setPage}
                    page={page}
                    totalPages={totalPages ?? 1}
                    changeLimit={setLimit}
                    limit={limit}
                />
            </div>
        </div >
    );

}

export default EventsDataTable;