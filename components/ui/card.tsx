'use client'

import CardHeader from './card-header';

interface CardProps {
    children: React.ReactNode,
    headerLabel?: string;
    paddings?: string;
}

const Card = ({ children, headerLabel, paddings }: CardProps) => {
    return (
        <div className={`card ${paddings ?? `py-4 md:py-6 px-3 md:px-5`}`}>
            {headerLabel ?
                <CardHeader label={headerLabel} />
                : <></>
            }
            {children}
        </div>
    )
}

export default Card