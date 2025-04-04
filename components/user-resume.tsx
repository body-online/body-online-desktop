import { ExtendedUser } from '@/next-auth'
import { getLocations } from '@/data/location'
import { getGenetics } from '@/data/genetic'
import ErrorComponent from './error-component'
import { ArrowsIcon } from './ui/icons'
import OnboardingCard from './onboarding-card'
import { Suspense } from 'react'

const UserResumeCard = async ({ user }: { user?: ExtendedUser }) => {

    if (!user) return null
    const { data: locationsData, error: locationsError } = await getLocations({ name: user.farmName })
    const { data: genetics, error: geneticsError } = await getGenetics()


    if (locationsError || !locationsData || geneticsError || !genetics) {
        return <ErrorComponent
            title="Error al cargar los datos"
            description="Por favor, inténtelo de nuevo más tarde"
            buttonText="Volver"
            buttonHref="/"
        />
    }

    const { locations, totalPages, totalLocations } = locationsData

    return (
        <div>
            <div className="bg-gradient-to-b from-white dark:from-cgray to-slate-100 dark:to-bg-cblack px-6 py-3 w-full mx-auto flex flex-col gap-y-2">
                <h1 className="title">
                    {user.farmName}
                </h1>
            </div>

            {Boolean(locations && locations.length > 0 || genetics && genetics.length > 0) ? (
                <div className='px-1'>

                </div>
            ) : (
                <Suspense fallback={<div>Loading...</div>}>
                    <OnboardingCard locations={locations} genetics={genetics} />
                </Suspense>
            )}


            {
                user.type === 'owner' && (
                    <div className='px-1'>

                    </div>
                )
            }
        </div >
    )
}

export default UserResumeCard