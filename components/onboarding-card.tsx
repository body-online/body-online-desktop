'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { LocationProps, GeneticProps } from '@/lib/types'
import { LocationForm } from './location/location-form'
import { AddGeneticBtn } from './genetic/add-genetic'

const OnboardingCard = ({ locations, genetics }: { locations: LocationProps[], genetics: GeneticProps[] }) => {
    const [hasLocations, setHasLocations] = useState(locations.length > 0)
    const [hasGenetics, setHasGenetics] = useState(genetics.length > 0)

    useEffect(() => {
        console.log(locations, genetics)
        setHasLocations(locations.length > 0)
        setHasGenetics(genetics.length > 0)
    }, [locations, genetics])

    const renderStep = (
        isChecked: boolean,
        title: string,
        children: React.ReactNode
    ) => (
        <div className="flex flex-col w-full py-4 gap-y-2">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    className="w-6 h-6 !cursor-not-allowed"
                    checked={isChecked}
                    readOnly
                />
                <p className="text-lg font-normal text-slate-700 dark:text-white">
                    {title}
                </p>
            </div>
            {!isChecked && children}
        </div>
    )

    return (
        <div className="custom-gradient p-6 w-full max-w-md mx-auto flex flex-col gap-y-4 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Para comenzar debes:
            </h2>

            <div className="bg-white dark:bg-cgray divide-y custom-divide rounded-lg overflow-hidden">
                {renderStep(
                    hasLocations,
                    `Crear una ubicación ${hasLocations ? 'completada' : ''}`,
                    <LocationForm callback={() => setHasLocations(true)} />
                )}

                {renderStep(
                    hasGenetics,
                    `Crear una genética ${hasGenetics ? 'completada' : ''}`,
                    <div className="pb-6">
                        <AddGeneticBtn handleRefresh={() => setHasGenetics(true)} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default OnboardingCard