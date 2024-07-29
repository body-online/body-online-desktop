'use client'

interface CardProps {
    children: React.ReactNode,
    headerLabel?: string;
    paddings?: string;
    rounded?: string;
}

const Card = ({ children, headerLabel, paddings, rounded }: CardProps) => {
    return (
        <div
            className={`custom-gradient border custom-border flex flex-col w-full 
            ${rounded ?? `rounded-2xl`} ${paddings ?? `p-3 md:p-6`}`}
            onClick={(e) => { return e.stopPropagation() }}
        >
            {headerLabel ? <h2 className="semititle">{headerLabel}</h2> : <></>}

            {children}
        </div>
    )
}

export default Card