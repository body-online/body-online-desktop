'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { LocationProps, GeneticProps } from '@/lib/types'
import { LocationForm } from './location/location-form'
import { GeneticForm } from './genetic/genetic-form'

const OnboardingCard = ({ locations, genetics }: { locations: LocationProps[], genetics: GeneticProps[] }) => {
    const [hasLocations, setHasLocations] = useState<boolean>(locations.length > 0)
    const [hasGenetics, setHasGenetics] = useState<boolean>(genetics.length > 0)

    // useEffect(() => {
    //     console.log(locations, genetics)
    //     setHasLocations(locations.length > 0)
    //     setHasGenetics(genetics.length > 0)
    // }, [locations, genetics])

    const renderStep = (
        isChecked: boolean,
        title: string,
        children: React.ReactNode
    ) => {
        return (
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
    }

    return (
        <div className="p-6 w-full mx-auto max-w-[600px] flex flex-col gap-y-4 rounded-xl shadow-sm">
            <h2 className="text-base text-slate-800 dark:text-white">
                Para comenzar a crear individuos, primero debes crear una ubicación y una genética.
            </h2>

            <div className="flex flex-row w-full gap-3">
                <motion.div
                    className={`flex-1 ${hasLocations ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: hasLocations ? 0 : 1 }}
                >
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        {renderStep(
                            hasLocations,
                            `Crear una ubicación ${hasLocations ? 'completada' : ''}`,
                            <LocationForm callback={() => setHasLocations(true)} />
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className={`flex-1 ${hasLocations ? 'opacity-100' : 'opacity-50'} transition-opacity duration-500`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: hasLocations ? 1 : 0.5 }}
                >
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        {renderStep(
                            hasGenetics,
                            `Crear una genética ${hasGenetics ? 'completada' : ''}`,
                            <div className="pb-6">
                                <GeneticForm handleRefresh={() => setHasGenetics(true)} />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
        </div >
    )
}

export default OnboardingCard