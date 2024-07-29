"use client";

import { EventProps } from '@/lib/types';
import { ColumnDef } from "@tanstack/react-table";
import { ArrowsIcon, CalendarIcon } from '../ui/icons';
import ChipBodyCondition from '../cattle/chip-body-condition';
import { ProfileImage } from '../ui/navbar';



export const columnsEvent: ColumnDef<EventProps>[] = [
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center"
                >
                    <p>Creador</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "user",
        cell: ({ row }) => {

            return (
                <div className="flex items-center gap-2">
                    <ProfileImage url={''} type={row?.original?.userType} />
                    <p className='text-base font-medium'>{row.getValue('user')}</p>
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
                    <p>Fecha de creación</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "eventDate",
        cell: ({ row }) => {
            const eventDate = new Date(row.getValue('eventDate')).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' });

            return <div className="flex items-center gap-2 h-full w-full">
                <CalendarIcon fill='fill-slate-500 dark:fill-slate-500' />
                <p className='text-sm'>
                    {eventDate}
                </p>
            </div>
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
                    <p>Evento</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "eventType",
        cell: ({ row }) => {
            const allowedEventTypes = ['body_measure', 'pregnant', 'not_pregnant', 'death', 'cattle_birth']
            var eventType: string = row.getValue("eventType");
            var measure: string = row?.original?.measure ?? '';
            var bodyRanges: number[] = row?.original?.bodyRanges;

            if (!eventType || !allowedEventTypes.includes(eventType)) {
                return <p className='chip chip_gray'>Sin evento</p>
            } else if (eventType == 'death') {
                return <p className='chip chip_red'>Muerte</p>
            } else if (eventType == 'body_measure') {
                return <ChipBodyCondition bodyRanges={bodyRanges} measure={Number(measure)} />
            } else if (eventType == 'pregnant') {
                return <p className='chip chip_violet'>Servicio</p>
            } else if (eventType == 'not_pregnant') {
                return <p className='chip chip_gray'>No preñez</p>
            } else if (eventType == 'cattle_birth') {
                return <p className='chip chip_rose'>Parto ({row.original.eventDetail})</p>
            }
        },
    },
];
