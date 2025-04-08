"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// Esquema de validación con Zod basado en Cattle
const cattleSchema = z.object({
    caravan: z.string().min(1, "La caravana es obligatoria"),
    geneticId: z.string().min(1, "El ID genético es obligatorio"),
    farmId: z.string().min(1, "El ID de la granja es obligatorio"),
    motherCaravan: z.string().optional(),
    defaultCicles: z
        .number()
        .min(0, "Los ciclos por defecto deben ser un número positivo")
        .int("Debe ser un número entero"),
});

type CattleFormData = z.infer<typeof cattleSchema>;

export default function CattleForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    // Configuración de react-hook-form con Zod
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CattleFormData>({
        resolver: zodResolver(cattleSchema),
        defaultValues: {
            caravan: "",
            geneticId: "",
            farmId: "",
            motherCaravan: "",
            defaultCicles: 0,
        },
    });

    // Manejo del envío del formulario
    const onSubmit: SubmitHandler<CattleFormData> = async (data) => {
        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            // Datos simulados para enviar al servidor
            const payload = {
                ...data,
                deletedAt: null,
                syncStatus: "pending" as const,
                lastModified: new Date().toISOString(),
            };

            // Petición simulada con Axios
            const response = await axios.post(
                "https://api.example.com/cattle",
                payload
            );

            setSubmitMessage("¡Ganado registrado con éxito!");
            reset(); // Resetea el formulario tras éxito
        } catch (error) {
            setSubmitMessage("Error al registrar el ganado. Inténtalo de nuevo.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Registrar Nuevo Ganado
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Campo Caravana */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Caravana
                    </label>
                    <input
                        type="text"
                        {...register("caravan")}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.caravan && (
                        <p className="text-red-500 text-sm mt-1">{errors.caravan.message}</p>
                    )}
                </div>

                {/* Campo ID Genético */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        ID Genético
                    </label>
                    <input
                        type="text"
                        {...register("geneticId")}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.geneticId && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.geneticId.message}
                        </p>
                    )}
                </div>

                {/* Campo ID de Granja */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        ID de Granja
                    </label>
                    <input
                        type="text"
                        {...register("farmId")}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.farmId && (
                        <p className="text-red-500 text-sm mt-1">{errors.farmId.message}</p>
                    )}
                </div>

                {/* Campo Caravana de la Madre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Caravana de la Madre (Opcional)
                    </label>
                    <input
                        type="text"
                        {...register("motherCaravan")}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.motherCaravan && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.motherCaravan.message}
                        </p>
                    )}
                </div>

                {/* Campo Ciclos por Defecto */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Ciclos por Defecto
                    </label>
                    <input
                        type="number"
                        step="1"
                        {...register("defaultCicles", { valueAsNumber: true })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.defaultCicles && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.defaultCicles.message}
                        </p>
                    )}
                </div>

                {/* Botón de envío */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {isSubmitting ? "Enviando..." : "Registrar Ganado"}
                </button>

                {/* Mensaje de estado */}
                {submitMessage && (
                    <p
                        className={`text-center mt-4 ${submitMessage.includes("éxito")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        {submitMessage}
                    </p>
                )}
            </form>
        </div>
    );
}