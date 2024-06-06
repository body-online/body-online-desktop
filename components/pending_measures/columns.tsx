"use client";

import { ColumnDef } from "@tanstack/react-table";

import { PendingMeasureProps } from '@/lib/types';
import { ArrowsIcon } from '../ui/icons';
import TakeMeasureBtn from './take-measure';


export const columnsPendingMeasures: ColumnDef<PendingMeasureProps>[] = [
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center"
                >
                    <p>Caravana</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'dark:rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "caravan",
        cell: ({ row }) => {
            return <div className='text-base font-medium'>{row.original?.caravan}</div>;
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
                    <p>Vencimiento</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'dark:rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "expiresAt",
        cell: ({ row }) => {
            const today: any = new Date()
            const expiresAt: any = new Date(row.original.expiresAt)

            let daysLeft = Math.round((expiresAt - today) / (1000 * 60 * 60 * 24));
            const isExpired = row?.original?.isExpired || daysLeft <= 0

            const bgColor = isExpired ? 'bg-red-500' : daysLeft >= 90 ? 'bg-green-200' : daysLeft >= 60 ? 'bg-yellow-200' : 'bg-orange-200'
            const textColor = isExpired ? 'text-white' : daysLeft >= 90 ? 'text-green-500' : daysLeft >= 60 ? 'text-yellow-500' : 'text-orange-500'

            return (
                <div className={`${bgColor} rounded-full px-3 py-2 max-w-max`}>
                    <p className={`${textColor}  text-sm font-medium`}>
                        {daysLeft == 0 ? `Hoy` : isExpired ? `hace ` : `en `}
                        {daysLeft == 0 ? `` : `${(daysLeft < 0 ? daysLeft * -1 : daysLeft)} días`} </p>
                </div>
            );
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
                <TakeMeasureBtn
                    cattleId={row.original.cattleId}
                    cattleCaravan={row.original.caravan}
                    dueDate={new Date(row.original.expiresAt)}
                />
            )
        },
    },
];
