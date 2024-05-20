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
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },
        accessorKey: "cattleId",
        cell: ({ row }) => {
            return <div className='text-base font-medium'>{row.original?.cattleId?.caravan}</div>;
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
                    <ArrowsIcon direction={column.getIsSorted()} />
                </button>
            );
        },

        accessorKey: "expiresAt",
        cell: ({ row }) => {
            const notificationDate = new Date(row.original.expiresAt)

            const isExpired = notificationDate < new Date()
            const monthsLeft = notificationDate.getMonth() - new Date().getMonth()
            const daysLeft = new Date().getDate() - notificationDate.getDate() - 1

            return (
                <div className={`${isExpired ? `bg-red-500` : `bg-yellow-200`} rounded-full px-3 py-2 max-w-max`}>
                    <p className={`${isExpired ? `text-white` : `text-yellow-600`}  text-sm font-medium`}>
                        {isExpired ? // expired 
                            `hace ` : `en `
                        }
                        {monthsLeft * 60 + daysLeft} días

                        {/* {monthsLeft > 0 ? (
                            monthsLeft == 1 ?
                                '1 mes y ' :
                                `${monthsLeft} meses y `
                        ) : (monthsLeft * -1) == 1 ? `1 mes y` : `${monthsLeft * -1} meses y `
                        }
                        {daysLeft === 0 ? 'Hoy' :
                            daysLeft < 0 ?
                                `hace ${daysLeft * -1} ${daysLeft * -1 ? ' días' : ' día'}` :
                                `hace ${daysLeft} ${daysLeft > 1 ? ' días' : ' día'}`
                        } */}
                    </p>
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
                <TakeMeasureBtn cattleId={row.original.cattleId._id} cattleCaravan={row.original.cattleId.caravan} dueDate={new Date(row.original.expiresAt)} />
            )
        },
    },
];
