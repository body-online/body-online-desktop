import React from 'react'

interface CardHeaderProps {
    label: string;
}

const CardHeader = ({ label }: CardHeaderProps) => {
    return (
        <h3 className='font-bold text-xl sm:text-2xl tracking-tight'>{label}</h3>
    )
}

export default CardHeader   