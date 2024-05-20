"use client";

import { ColumnDef } from "@tanstack/react-table";

import DescriptionBtn from './description-button';
import DeleteGeneticBtn from './delete-button';
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
                    className="flex-center"
                >
                    <p>Fecha de Creación</p>
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },

        accessorKey: "createdAt",
        cell: ({ row }) => {
            const created_at = row.getValue("createdAt");
            const formatted = new Date(created_at as string).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' });

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
                    <DescriptionBtn genetic={row.original} />
                    <DeleteGeneticBtn id={row.original._id} name={row.original.name} />
                </div>
            );
        },
    },
];
