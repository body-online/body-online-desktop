'use client'

import { ArrowsIcon } from './ui/icons'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
const ErrorComponent = ({ title, description, buttonText, buttonHref }: { title: string, description: string, buttonText: string, buttonHref: string }) => {
    const router = useRouter()
    return (

        <div className='flex flex-col gap-1 px-6 py-3 z-20'>

            <motion.h1
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='font-medium text-2xl -mb-1'
            >
                {title}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className='text-default-600 text-base'
            >
                {description}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className='pt-3'
            >
                <button
                    onClick={() => router.back()}
                    className='bg-default-500/10 w-max rounded-full flex items-center gap-2 px-3 py-2'
                >
                    <ArrowsIcon direction="rotate-180" fill="fill-default-500" sizes="w-5 h-5" />
                    <p className='text-default-500 text-sm'>{buttonText}</p>
                </button>
            </motion.div>
        </div>
    )
}

export default ErrorComponent