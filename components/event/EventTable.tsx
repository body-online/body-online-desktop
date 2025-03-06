// components/EventTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material'; // O usa react-select si prefieres
import toast from 'react-hot-toast';
import { EventInterface } from '@/lib/types';

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
    const [events, setEvents] = useState<EventInterface[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const { control, handleSubmit, reset } = useForm<FilterForm>({
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
    const eventsByDay = events.reduce((acc, event) => {
        const date = new Date(event.eventDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', weekday: 'short' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {} as { [key: string]: EventInterface[] });

    return (
        <div className='bg-white dark:bg-cgray rounded-3xl p-6 w-full mx-auto flex flex-col gap-y-2'>
            <h1 className="text-2xl font-bold mb-4">Eventos</h1>
            <p className="text-gray-600 mb-4">Visualiza los eventos programados para las chanchas.</p>

            {/* Filtros */}
            <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                        name="farmId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <input
                                {...field}
                                type="text"
                                placeholder="ID de la granja"
                                className={`border p-2 rounded ${fieldState.error ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        )}
                    />
                    <Controller
                        name="eventType"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Tipo de Evento</InputLabel>
                                <Select {...field} label="Tipo de Evento">
                                    <MenuItem value="">Todos</MenuItem>
                                    {Object.values(['body_measure', 'not_pregnant', 'cattle_birth', 'pregnant', 'death', 'weaning']).map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="creator"
                        control={control}
                        render={({ field, fieldState }) => (
                            <input
                                {...field}
                                type="text"
                                placeholder="Creador"
                                className={`border p-2 rounded ${fieldState.error ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        )}
                    />
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <input
                                {...field}
                                type="date"
                                placeholder="Fecha de inicio"
                                className={`border p-2 rounded ${fieldState.error ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        )}
                    />
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <input
                                {...field}
                                type="date"
                                placeholder="Fecha de fin"
                                className={`border p-2 rounded ${fieldState.error ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        )}
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Filtrar
                </button>
            </form>

            {/* Tabla de eventos (inspirada en la imagen) */}
            <div className="space-y-4">
                {Object.entries(eventsByDay).map(([day, dayEvents]) => (
                    <div key={day} className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">{day}</h2>
                        {dayEvents.map((event) => (
                            <div key={event._id} className="border-b py-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600">{new Date(event.eventDate).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="font-medium">{event.eventType} - Caravana: {event.caravan}</p>
                                        <p className="text-sm text-gray-500">Creado por: {event.user} ({event.userType})</p>
                                    </div>
                                    {/* Por ahora, no incluimos el botón de edición según tu indicación */}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Paginación */}
            <div className="mt-4 flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}