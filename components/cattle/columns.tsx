"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteCattleBtn from './delete-button';
import { CattleProps } from '@/lib/types';
import { ArrowsIcon } from '../ui/icons';
import AddEventButton from './new-event';
import ChipBodyCondition from './chip-body-condition';
import ChipState from './chip-state';


export const columnsCattle: ColumnDef<CattleProps>[] = [
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center gap-1"
                >
                    <p>Caravana</p>
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },
        accessorKey: "caravan",
        cell: ({ row }) => {
            return <div className='text-base font-medium'>{row.getValue("caravan")}</div>;
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
                    <p>Ubicación</p>
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },
        accessorKey: "locationName",
        cell: ({ row }) => {
            return <p>{row.getValue("locationName")}</p>;
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
                    <p>Genética</p>
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },
        accessorKey: "geneticName",
        cell: ({ row }) => {
            return <p>{row.getValue("geneticName")}</p>;
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
                    <p>Estado</p>
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },
        accessorKey: "state",
        cell: ({ row }) => {
            return (<ChipState state={row.getValue("state")} />)
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
                    <p>Condición Corporal</p>
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },
        accessorKey: "bodyCondition",
        cell: ({ row }) => {
            // check if the cattle is death
            if (row.getValue('state') == 'death')
                return <ChipBodyCondition type='death' />

            const bodyMeasure = Number(row.getValue("bodyCondition"))

            const bodyCondition = bodyMeasure == 0 ? undefined : bodyMeasure > 21 ? 'fat' : bodyMeasure > 10 ? 'ideal' : "skinny"
            return <ChipBodyCondition type={bodyCondition} />
        }
    },
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center gap-1"
                >
                    <p>Ciclos</p>
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },
        accessorKey: "defaultCicles",
        cell: ({ row }) => {
            return <p>{row.getValue("defaultCicles")}</p>;
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
                    <AddEventButton
                        cattle={row.original}
                    />
                    <DeleteCattleBtn
                        id={row.original._id}
                        name={row.original.caravan}
                    />
                </div>
            );
        },
    },
];
