import React from 'react'

interface CardHeaderProps {
    label: string;
}

const CardHeader = ({ label }: CardHeaderProps) => {
    return (
        <h3 className='text-lg font-semibold'>
            {label}
        </h3>
    )
}

export default CardHeader   