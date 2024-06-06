"use client";

import { ColumnDef } from "@tanstack/react-table";

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
            const created_at = row.getValue("createdAt");
            const formatted = new Date(created_at as string).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' });

            return <p>{formatted}</p>;
        },
    },

    {
        header: ({ column }) => {
            return (<p>Descripción</p>);
        },

        accessorKey: "description",
        cell: ({ row }) => {
            return <p> {row?.original?.description ?? '-'}</p>;
        },
    },

    // Actions
    {
        header: ({ column }) => {
            return <p>Acciones</p>;
        },
        accessorKey: "actions",
        cell: ({ row }) => {
            return (
                <div className='flex items-center gap-2'>
                    {/* <DescriptionBtn location={row.original} /> */}
                    <DeleteLocationBtn id={row.original._id} name={row.original.name} />
                </div>
            );
        },
    },
];
