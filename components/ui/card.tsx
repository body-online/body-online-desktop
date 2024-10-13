'use client'

import { motion, AnimatePresence } from 'framer-motion'
interface CardProps {
    children: React.ReactNode,
    headerLabel?: string;
    paddings?: string;
    rounded?: string;
}

const Card = ({ children, headerLabel, paddings, rounded }: CardProps) => {
    return (
        <AnimatePresence mode='wait'>
            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className={`card ${paddings ?? `p-4`}`}
                onClick={(e) => { return e.stopPropagation() }}
            >
                {headerLabel ? <h2 className="semititle">{headerLabel}</h2> : <></>}
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default Card