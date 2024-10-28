"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GeneticProps } from '@/lib/types';
import { ArrowsIcon } from '../ui/icons';


export const columnsGenetic: ColumnDef<GeneticProps>[] = [
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center"
                >
                    <p>Nombre</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'dark:rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "name",
        cell: ({ row }) => {
            return <div className='text-base font-medium'>{row.getValue("name")}</div>;
        },
    },
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center"
                >
                    <p>Fecha de Creación</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'dark:rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },

        accessorKey: "createdAt",
        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt");
            if (!createdAt)
                return <p>-</p>;
            const formatted = new Date(createdAt as string).toLocaleDateString("es-AR", { day: 'numeric', month: 'short', year: 'numeric' });
            return <p>{formatted}</p>;
        },
    },

    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center"
                >
                    <p>Rango Ideal</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'dark:rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "bodyRanges",
        cell: ({ row }) => {
            const bodyRange: any = row.getValue("bodyRanges");
            return <div className='text-base font-medium w-20 chip chip_green'>{bodyRange?.[0]} - {bodyRange?.[1]}</div>;
        },
    },

    // {
    //     header: ({ column }) => {
    //         return (<p>Descripción</p>);
    //     },

    //     accessorKey: "description",
    //     cell: ({ row }) => {
    //         return <p> {row?.original?.description ?? '-'}</p>;
    //     },
    // }
];
