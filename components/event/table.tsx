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

import { LoadingIcon } from '../ui/icons';
import React, { useEffect, useState } from "react";

import toast from 'react-hot-toast';
import InfoMessage from '../ui/info';
import { getEvents } from '@/data/events';
import { EventProps } from '@/lib/types';
import { columnsEvent } from './columns';
import LoadingRowsSkeleton from '../ui/loading-rows-skeleton';
import AddEventBtn from '../cattles/add-event';
import StatePagination from '../ui/state-pagination';
import FilterInput from '../ui/filter-input';
;

export function Events() {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState("")

    const [events, setEvents] = useState<EventProps[]>([])
    const [totalAmount, setTotalAmount] = useState<number>()
    const [totalPages, setTotalPages] = useState<number>(1)
    const [limit, setLimit] = useState<number>(20)
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

        initialState: {
            pagination: { pageSize: 50 }
        },
        state: {
            sorting,
            columnFilters,
        },
    });

    const searchEvents = async () => {
        setIsLoading(true)
        try {
            const { data } = await getEvents({ page, limit, caravan: searchTerm })
            if (data) {
                setTotalAmount(Number(data?.totalEvents ?? 0))
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
    }, [page, limit])

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
        <div className='card max-h-max'>
            <div className="header_container">
                <h2 className='text-xl md:text-2xl font-semibold'>Eventos</h2>

                <div className="flex w-max gap-x-2 gap-y-1 items-center flex-wrap-reverse justify-end">
                    {isLoading ? <LoadingIcon /> :
                        <p className='text-sm md:text-base font-normal text-slate-600 dark:text-slate-400'>
                            {totalAmount} {(totalAmount ?? 0) != 1 ? 'registros' : 'registro'}
                        </p>
                    }
                    <AddEventBtn handleRefresh={searchEvents} />
                </div>
            </div>


            <div className="px-4 my-2">
                <FilterInput
                    placeholder='Buscar por caravana...'
                    onChange={(e) => setSearchTerm(e)}
                    disabled={!events.length && !searchTerm}
                />
            </div>

            {isLoading ? (
                <LoadingRowsSkeleton />
            ) : (
                <>
                    {events.length > 0 ?
                        <div className='overflow-auto relative w-full flex flex-col max-h-[58vh] md:max-h-[65vh]'>
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
                        <div className="p-4">
                            <InfoMessage
                                type='censored'
                                title='Sin resultados'
                                subtitle={!searchTerm ? 'Debes crear al menos un evento para visualizar la tabla' :
                                    `No hemos encontrado resultados con "${searchTerm}".`}
                            />
                        </div>
                    }
                </>
            )}

            <div className="buttons_container">
                <StatePagination
                    disabled={isLoading || totalPages >= 1 && !events?.length}
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

export default Events;