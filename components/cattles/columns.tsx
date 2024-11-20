"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CattleProps } from '@/lib/types';

import ChipBodyCondition from './chip-body-condition';
import { ArrowsIcon } from '../ui/icons';
import ChipState from './chip-state';


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
            return (
                <div className='text-xl font-medium'>
                    {row.getValue("caravan")}
                </div>
            );
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
            const formatted = new Date(stateDate as string).toLocaleDateString("es-AR",
                { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' });
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
                    <p>Condición corporal</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "bodyCondition",
        cell: ({ row }) => {
            // if (row?.original?.state == 'DEATH') return <p className='chip chip_red'>Muerta</p>

            return (
                <ChipBodyCondition
                    bodyRanges={row?.original?.bodyRanges}
                    measure={Number(row?.original?.bodyCondition)}
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
            const formatted = new Date(bodyConditionDate as string).toLocaleDateString("es-AR",
                { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' });
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
                    <p>Fecha de creación</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },

        accessorKey: "createdAt",
        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt");
            if (!createdAt)
                return <p>-</p>;
            const formatted = new Date(createdAt as string).toLocaleDateString("es-AR",
                { day: 'numeric', month: 'short', hour: '2-digit', year: '2-digit' });
            return <p>{formatted}</p>;
        },
    },
];
