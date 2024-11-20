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
import { getLocations } from '@/data/location';
import { LocationProps } from '@/lib/types';
import { columnsLocation } from './columns';
import LoadingTableSkeleton from '../ui/loading-table-skeleton';
import StatePagination from '../ui/state-pagination';
import DeleteLocationBtn from './delete-button';
import AddLocationBtn from './add-location';
import FilterInput from '../ui/filter-input';
import useOnlineStatus from '@/hooks/useOnlineStatus';

export function LocationsDataTable({ totalLocations }: { totalLocations?: number }) {
    const isOnline = useOnlineStatus()
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchTerm, setSearchTerm] = useState("")

    const [locations, setLocations] = useState<LocationProps[]>([])
    const [totalPages, setTotalPages] = useState<number>()
    const [limit, setLimit] = useState<number>(10)
    const [page, setPage] = useState<number>(1)

    const table = useReactTable({
        data: locations,
        columns: columnsLocation,
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

    const searchLocations = async () => {
        setIsLoading(true)
        try {
            const { data } = await getLocations({ page, limit, name: searchTerm })
            if (data) {
                setTotalPages(Number(data.totalPages) > 0 ? Number(data.totalPages) : 1)
                setLocations(data.locations)
            }
        } catch (error) {
            toast.error('Ha ocurrido un error al encontrar los resultados')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isOnline)
            searchLocations();
    }, [page, limit, totalLocations, searchTerm])

    return (
        <div className='card max-h-max w-full'>
            <div className="pt-4 px-4">
                <div className="flex-between mb-2">

                    <h2 className='font-semibold text-xl'>Ubicaciones</h2>


                    <div className="flex gap-2 items-center">
                        {isLoading ? <LoadingIcon /> :
                            <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                                {locations?.length} {(locations?.length ?? 0) != 1 ? 'registros' : 'registro'}
                            </p>
                        }
                    </div>
                </div>
            </div>


            <div className="mb-2 px-4 space-y-2">
                <FilterInput
                    placeholder='Buscar por nombre...'
                    onChange={(e) => setSearchTerm(e)}
                    disabled={!locations?.length && !searchTerm}
                />

                <AddLocationBtn customText='Nueva' searchLocations={searchLocations} />
            </div>


            {isLoading ? (
                <LoadingTableSkeleton />
            ) : locations?.length == 0 ? (
                <div className='p-4'>
                    <InfoMessage
                        type='info'
                        title='Sin resultados'
                        subtitle={
                            searchTerm ? `No hemos encontrado resultados con "${searchTerm}".` : 'Crea una ubicación para visualizarla en la tabla.'}
                    />
                </div>
            ) : (
                <>
                    <div className='overflow-auto relative w-full flex flex-col max-h-[58vh] md:max-h-[65vh] '>
                        <Table>
                            <TableHeader className='sticky top-0'>
                                {table?.getHeaderGroups().map((headerGroup) => {
                                    return (
                                        <TableRow key={headerGroup.id}>
                                            <th>
                                                <p>Acciones</p>
                                            </th>
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
                                        <td key={'actions'}>
                                            <DeleteLocationBtn
                                                id={row.original._id}
                                                name={row.original.name}
                                                searchLocations={searchLocations}
                                            />
                                        </td>
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
                    <div className="p-2">
                        <StatePagination
                            page={page}
                            changePage={(newPage) => setPage(newPage)}
                            limit={limit}
                            changeLimit={(newLimit) => setLimit(newLimit)}
                            totalPages={totalPages ?? 1}
                        />
                    </div>
                </>
            )}

        </div >
    );

}

export default LocationsDataTable;