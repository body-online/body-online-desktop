"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ExtendedUser } from '@/next-auth';
import { ArrowsIcon } from '../ui/icons';
import { ProfileImage } from '../ui/navbar';



export const columnsUser: ColumnDef<ExtendedUser>[] = [
    {
        header: ({ column }) => {
            return (
                <button
                    type="button"
                    onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
                    className="flex-center"
                >
                    <p>Nombre</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "name",
        cell: ({ row }) => {
            return (
                <div>
                    <div className="flex items-center gap-2">
                        <ProfileImage user={row.original} width='w-6' height='h-6' />
                        <p className='text-sm font-medium'>
                            {row.getValue("name")}
                        </p>
                    </div>
                </div>
            )
                ;
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
                    <p>Email</p>
                    <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
                </button>
            );
        },
        accessorKey: "email",
        cell: ({ row }) => {
            return <div className='text-sm font-medium'>{row.getValue("email")}</div>;
        },
    },
    // Actions
    // {
    //     header: () => {
    //         return <p>Acciones</p>;
    //     },
    //     accessorKey: "actions",
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex items-center gap-3">
    //                 {/* <DeleteUserBtn
    //                     id={row.original._id}
    //                     name={row.original.caravan}
    //                 /> */}
    //             </div>
    //         );
    //     },
    // },

    // {
    //     header: ({ column }) => {
    //         return (
    //             <button
    //                 type="button"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
    //                 className="flex-center"
    //             >
    //                 <p>Fecha de Creación</p>
    //                 <ArrowsIcon direction={column.getIsSorted() == "asc" ? 'rotate-180' : column.getIsSorted() == "desc" ? '' : 'hidden'} />
    //             </button>
    //         );
    //     },

    //     accessorKey: "createdAt",
    //     cell: ({ row }) => {
    //         const created_at = row.getValue("createdAt");

    //         const formatted = new Date(created_at as string).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' });

    //         return <p> {formatted}</p>;
    //     },
    // },
];
