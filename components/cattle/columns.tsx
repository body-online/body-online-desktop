"use client";

import { ColumnDef } from "@tanstack/react-table";
import DeleteCattleBtn from './delete-button';
import { CattleProps } from '@/lib/types';
import { ArrowsIcon } from '../ui/icons';
import { AddEventBtn } from './add-event';
import ChipBodyCondition from './chip-body-condition';
import ChipState from './chip-state';
import HistoryBtn from './history-button';


export const columnsCattle: ColumnDef<CattleProps>[] = [
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center"
                >
                    <p>Caravana</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
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
                    className="flex-center"
                >
                    <p>Fecha de Creación</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
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

    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center"
                >
                    <p>Ubicación</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
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
                    className="flex-center"
                >
                    <p>Genética</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
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
                    className="flex-center"
                >
                    <p>Estado</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
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
                    className="flex-center"
                >
                    <p>Fecha último estado</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },

        accessorKey: "stateDate",
        cell: ({ row }) => {
            // const isDeath = row?.original?.state == 'death'
            const stateDate = row.getValue("stateDate");
            if (!stateDate)
                return <p>-</p>;
            const formatted = new Date(stateDate as string).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' });
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
                    <p>Condición Corporal</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "bodyCondition",
        cell: ({ row }) => {
            return (
                <ChipBodyCondition
                    bodyRanges={row?.original?.bodyRanges}
                    measure={Number(row?.original?.bodyCondition)}
                    state={row?.original?.state}
                />
            )
        }
    },
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center"
                >
                    <p>Última medición</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },

        accessorKey: "bodyConditionDate",
        cell: ({ row }) => {
            const bodyConditionDate = row.getValue("bodyConditionDate");
            if (!bodyConditionDate)
                return <p>-</p>;
            const formatted = new Date(bodyConditionDate as string).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' });
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
                    <p>Ciclos</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "defaultCicles",
        cell: ({ row }) => {
            return <p>{row.getValue("defaultCicles")}</p>;
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
                <div className="flex-end gap-3">
                    <HistoryBtn
                        cattle={row.original}
                    />
                    <AddEventBtn mode='chip' defaultCattle={row.original} />
                    <DeleteCattleBtn
                        id={row.original._id}
                        name={row.original.caravan}
                    />
                </div>
            );
        },
    },
];
