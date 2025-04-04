// components/EventTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventProps } from '@/lib/types';
import toast from 'react-hot-toast';
import { z } from 'zod';

// Definir el esquema de validación para los filtros con Zod
const filterSchema = z.object({
    farmId: z.string().min(1, 'Farm ID es requerido'),
    eventType: z.enum(['body_measure', 'not_pregnant', 'cattle_birth', 'pregnant', 'death', 'weaning']).optional(),
    creator: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
});

type FilterForm = z.infer<typeof filterSchema>;

export default function EventTable() {
    const [events, setEvents] = useState<EventProps[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    // _id
    // caravan
    // user
    // userType
    // bodyRanges
    // eventType: string;
    //     cattleId: string;
    //     eventDate: Date;
    //     eventDetail?: string | undefined;
    //     observations?: string | undefined;
    //     measure?: number | undefined;
    //     taskId?: string | undefined;
    // }


    // filtros
    const { register, handleSubmit, reset } = useForm<FilterForm>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            farmId: '',
            eventType: undefined,
            creator: '',
            startDate: '',
            endDate: '',
            page: 1,
            limit: 10,
        },
    });

    const fetchEvents = async (filters: FilterForm) => {
        try {
            const query = new URLSearchParams({
                farmId: filters.farmId,
                page: filters.page.toString(),
                limit: filters.limit.toString(),
                ...(filters.eventType && { eventType: filters.eventType }),
                ...(filters.creator && { creator: filters.creator }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
            }).toString();

            const response = await fetch(`/api/events?${query}`);
            if (!response.ok) throw new Error('Error al obtener los eventos');

            const data = await response.json();
            setEvents(data.events);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error('Error al cargar los eventos');
            console.error(error);
        }
    };

    const onSubmit = (data: FilterForm) => {
        fetchEvents(data);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        reset({ ...filterSchema.parse({}), page: newPage });
        fetchEvents({ ...filterSchema.parse({}), page: newPage });
    };

    // Efecto para cargar eventos iniciales
    useEffect(() => {
        fetchEvents({ farmId: 'your-farm-id-here', page: 1, limit: 10 }); // Reemplaza con el farmId real
    }, []);

    // Agrupar eventos por día para el diseño de la imagen
    // const eventsByDay = events.reduce((acc, event) => {
    //     const date = new Date(event.eventDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', weekday: 'short' });
    //     if (!acc[date]) acc[date] = [];
    //     acc[date].push(event);
    //     return acc;
    // }, {} as { [key: string]: EventProps[] });

    return (
        <div className='bg-white dark:bg-cgray rounded-3xl p-4 w-full mx-auto flex flex-col gap-y-2'>
            <div>
                <h1 className="text-xl font-semibold">Eventos</h1>
                <p className="text-gray-500 dark:text-gray-600">Visualiza los eventos programados para las chanchas.</p>
            </div>

            {/* Filtros */}
            <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
            </form>

            {/* Tabla de eventos (inspirada en la imagen) */}
            <div className="space-y-4">

            </div>
        </div>
    );
}