'use client'

import { useEffect, useState } from 'react'

import { getLocations } from '@/data/location'

import LoadingRowsSkeleton from '../ui/loading-rows-skeleton'
import StatePagination from '../ui/state-pagination'
import CheckButton from '../ui/check-button'
import { ProfileImage } from '../ui/navbar'
import { LocationProps } from '@/lib/types'
import InfoMessage from '../ui/info'
import AddLocationBtn from './add-location'
import FilterInput from '../ui/filter-input'

const LocationsList = ({
    selectedLocation,
    setSelectedLocation,
    // search,
    disabled,
    onlyOne,
}: {
    selectedLocation: LocationProps[],
    setSelectedLocation: React.Dispatch<React.SetStateAction<LocationProps[]>>,
    // search?: string,
    disabled: boolean,
    onlyOne?: boolean,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [search, setSearch] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [locations, setLocationList] = useState<LocationProps[]>([])
    // filters states
    const [page, setPage] = useState<number>(1)
    const [limit, setLocationLimit] = useState<number>(10)
    const [totalPages, setTotalPages] = useState<number>(1)

    const fetchLocations = async () => {
        setIsLoading(true);
        const { data, error } = await getLocations({ page, limit, name: search ?? undefined })

        if (data) {
            setLocationList(data.locations)
            setTotalPages(data.totalPages ?? 1)
        }
        if (error) setError(error)
        return setIsLoading(false)
    }

    const handleSelectLocation = (location: LocationProps) => {
        if (disabled) return
        if (!selectedLocation || onlyOne) {
            setSelectedLocation([location])
        } else if (selectedLocation.find(i => i._id === location._id)) {
            setSelectedLocation(selectedLocation?.filter(i => i._id !== location._id) ?? [])
        } else {
            setSelectedLocation([...selectedLocation, location])
        }
    }

    useEffect(() => {
        fetchLocations();
    }, [page, limit, search])


    return (
        <>
            <div className="px-4 mb-2 space-y-2">
                <p className="input_label">
                    Asignar ubicación
                </p>

                <FilterInput
                    placeholder={'Buscar por nombre...'}
                    disabled={(!search && !locations?.length) || (!search && isLoading)}
                    onChange={(e: any) => setSearch(e)}
                />
            </div>

            <div className="mb-2 px-4">
                <AddLocationBtn searchLocations={() => fetchLocations()} />
            </div>

            <div className='flex flex-col overflow-hidden h-full'>
                {/* list of locations */}
                {isLoading ? (
                    <LoadingRowsSkeleton />
                ) : error ? (
                    <div className="p-4">
                        <InfoMessage
                            type='warning'
                            title={`Error al cargar las ubicaciones`}
                            subtitle={error ?? 'Ha ocurrido un error al cargar las ubicaciones.'}
                        />
                    </div>
                ) : !locations?.length ? (
                    <div className="p-4">
                        {(search && search?.length > 0) ? (
                            <InfoMessage
                                type='info'
                                title="Sin resultados"
                                subtitle={`No se encontraron ubicaciones con "${search}"`}
                            />
                        ) : null}
                    </div>
                ) : (
                    <>
                        <div className="custom_list">
                            {locations?.map((location, index) => {
                                const selected = Boolean(selectedLocation?.find(i => i._id === location._id));

                                return (
                                    <CheckButton
                                        key={index}
                                        value={location.name as string}
                                        label={location.name}
                                        onClick={() => handleSelectLocation(location)}
                                        selected={selected}
                                        disabled={disabled}
                                    >
                                        <p className={`text-lg font-medium text-gray-600 dark:text-gray-300 ${selected ? 'text-opacity-100' : 'dark:text-opacity-50 text-opacity-50 enabled:md:hover:text-opacity-100'}`}>
                                            {location.name}
                                        </p>
                                    </CheckButton>
                                )
                            })}

                        </div>

                        <div className="px-2">
                            <StatePagination
                                page={page}
                                limit={limit}
                                changePage={(newPage: number) => setPage(newPage)}
                                totalPages={totalPages}
                                changeLimit={setLocationLimit}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default LocationsList