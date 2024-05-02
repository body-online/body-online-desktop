"use client";

import { ColumnDef } from "@tanstack/react-table";

import DescriptionBtn from './description-button';
import DeleteLocationBtn from './delete-button';
import { LocationProps } from '@/lib/types';
import { ArrowsIcon } from '../ui/icons';


export const columnsLocation: ColumnDef<LocationProps>[] = [
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center gap-1"
                >
                    <p>Nombre</p>
                    <ArrowsIcon direction={column.getIsSorted()} />
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
                    className="flex-center gap-1"
                >
                    <p>Fecha de Creación</p>
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },

        accessorKey: "createdAt",
        cell: ({ row }) => {
            const created_at = row.getValue("createdAt");
            const formatted = new Date(created_at as string).toLocaleDateString("es-MX", { day: 'numeric', month: 'long', year: 'numeric' });

            return <p> {formatted}</p>;
        },
    },

    // Actions
    {
        header: () => {
            return <p></p>;
        },
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex-end gap-2">
                    <DescriptionBtn location={row.original} />
                    <DeleteLocationBtn id={row.original._id} name={row.original.name} />
                </div>
            );
        },
    },
];
