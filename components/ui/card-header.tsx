import React from 'react'

interface CardHeaderProps {
    label: string;
}

const CardHeader = ({ label }: CardHeaderProps) => {
    return (
        <h3 className='font-bold text-base tracking-tight mb-3'>{label}</h3>
    )
}

export default CardHeader   