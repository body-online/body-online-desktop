
import React from 'react'
import { ArrowsIcon } from './icons'
import { useRouter } from 'next/navigation'

const BackButton = ({ url, label }: { url: string, label?: string }) => {
    const router = useRouter()

    const handleBack = () => {
        if (url) {
            router.push(url)
        } else {
            router.back()
        }
    }

    return (
        <button
            type='button'
            onClick={() => handleBack()}
            className='md:hover:bg-slate-200 md:hover:dark:bg-clightgray transition-all duration-150 enabled:md:hover:bg-opacity-50 rounded-full flex-center w-max h-8 px-1'
        >
            <ArrowsIcon direction='rotate-90' sizes='w-6 h-6 md:w-7 md:h-7' />
            {label && <p className='text-xs md:text-sm font-medium text-slate-500 dark:text-slate-300'>{label}</p>}
        </button>
    )
}

export default BackButton