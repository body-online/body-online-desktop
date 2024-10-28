import React, { Suspense } from 'react'
import { ExtendedUser } from '@/next-auth'
import { getGenetics } from '@/data/genetic'
import { getLocations } from '@/data/location'
import { createGenetic } from '@/actions/genetic'
import Link from 'next/link'

const WelcomeComponent = async ({ user }: { user?: ExtendedUser }) => {
    const { data: locations, error: errLoc } = await getLocations({ limit: 1 })
    const { data: genetics, error: errGen } = await getGenetics()
    return (
        <div className='mb-2'>
            {/* <h1 className="semititle">
                <span className="opacity-80">Bienvenido</span> {user?.name}
            </h1>
            <div className="flex gap-2">
                <h1 className="semititle">
                    <span className="opacity-80">Organización</span> {user?.farmName}
                </h1>
            </div> */}

            {locations?.totalLocations == 0 || genetics?.length == 0 ?
                <div className='bg-dark:bg-csemigreen/10 py-4 md:py-6 px-3 md:px-5 rounded-md my-3'>
                    <p className='font-medium text-base text-clime dark:text-clime mb-3'>
                        Para comenzar con tus mediciones
                    </p>

                    <Link href='/geneticas' className="p-4 rounded-lg bg-slate-100 dark:bg-opacity-10 w-full flex gap-3 items-center justify-between">
                        <div className='flex-center gap-2'>
                            <div className='w-3 h-3 rounded border-2 border-slate-300 dark:border-cgray bg-slate-100 dark:bg-slate-100/5' />
                            <p className='text-lg text-cblack'>
                                Crea una genética
                            </p>
                        </div>
                        <ArrowIcon />
                    </Link>
                </div> : null
            }
            <div>

            </div>


        </div>
    )
}

export default WelcomeComponent;

const ArrowIcon = ({ stroke }: { stroke?: string }) => {
    return (
        <div>
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            className={`w-4 h-4 ${stroke ?? 'stroke-cblack dark:stroke-white'}`} >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
        </div>
    )
}