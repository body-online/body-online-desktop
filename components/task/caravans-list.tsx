'use client'

import { useEffect, useState } from 'react'

import { CattleProps } from '@/lib/types'

import LoadingRowsSkeleton from '../ui/loading-rows-skeleton'
import StatePagination from '../ui/state-pagination'
import CheckButton from '../ui/check-button'
import InfoMessage from '../ui/info'
import { getCattles } from '@/data/cattle'
import ChipState from '../cattles/chip-state'
import ChipBodyCondition from '../cattles/chip-body-condition'
import CattleResume from '../ui/cattle-resume'

const CaravansList = ({
    selectedCattles, setSelectedCattles, search, disabled, onlyOne,
}: {
    selectedCattles: CattleProps[],
    setSelectedCattles: React.Dispatch<React.SetStateAction<CattleProps[]>>,
    search?: string,
    disabled: boolean,
    onlyOne?: boolean,

}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [cattlesList, setCattlesList] = useState<CattleProps[]>([])
    // filters states
    const [page, setPage] = useState<number>(1)
    const [limit, setCattlesLimit] = useState<number>(10)
    const [totalPages, setTotalPages] = useState<number>(1)

    const handleGetCattles = async () => {
        setIsLoading(true);
        const { data, error } = await getCattles({ name: search, page, limit })

        if (data?.cattles) {
            setCattlesList(data.cattles)
            setTotalPages(data.totalPages ?? 1)
        }
        if (error) setError(error)
        return setIsLoading(false)
    }

    const handleSelectCattle = (cattle: CattleProps) => {
        if (disabled) return
        if (!selectedCattles || onlyOne) {
            setSelectedCattles([cattle])
        } else if (selectedCattles.find(i => i._id === cattle._id)) {
            setSelectedCattles(selectedCattles?.filter(i => i._id !== cattle._id) ?? [])
        } else {
            setSelectedCattles([...selectedCattles, cattle])
        }
    }

    useEffect(() => {
        handleGetCattles()
    }, [search, page, limit])

    return (
        <>
            {error ? (
                <div className="p-4">
                    <InfoMessage
                        type='warning'
                        title={`Error al cargar los ${error ? 'caravanas' : 'individuos'}`}
                        subtitle={error ??
                            'Ha ocurrido un error al cargar los individuos.'
                        }
                    />
                </div>
            ) : isLoading ? (
                <LoadingRowsSkeleton />
            ) : !cattlesList.length ? (
                <div className="p-4">
                    <InfoMessage
                        type='info'
                        title="Sin resultados"
                        subtitle={
                            (search && search?.length > 0) ? `No se encontraron caravanas con "${search}"` : 'No se encontraron caravanas'
                        }
                    />
                </div>
            ) : (
                <>
                    <div className="w-full overflow-auto divide-y custom-divide">
                        {cattlesList.map((cattle, index) => {
                            const selected = Boolean(selectedCattles?.find(i => i._id === cattle._id));

                            return (
                                <CheckButton
                                    key={index}
                                    value={cattle.caravan}
                                    label={cattle.caravan}
                                    onClick={() => handleSelectCattle(cattle)}
                                    selected={selected}
                                    disabled={disabled}
                                >
                                    <CattleResume cattle={cattle} withoutClasses={true} />
                                </CheckButton>
                            )
                        })}

                    </div>

                    <div className="px-2">
                        <StatePagination
                            page={page}
                            disabled={disabled}
                            limit={limit}
                            changePage={(newPage: number) => setPage(newPage)}
                            totalPages={totalPages}
                            changeLimit={setCattlesLimit}
                        />
                    </div>
                </>
            )}
        </>
    )
}

export default CaravansList