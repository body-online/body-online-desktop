import React from 'react'
import CleanButton from './clean-button'

const Resume = ({
    children,
    handleClean,
    disabled,
    amount
}: {
    children: React.ReactNode
    handleClean: () => void
    disabled: boolean
    amount: number

}) => {
    return (
        <div className="relative w-full h-9 my-2">
            <div className="overflow-x-auto gap-2 flex px-4">
                <div className="sticky left-0">
                    <CleanButton
                        onClick={handleClean}
                        disabled={disabled}
                        amount={amount}
                    />
                </div>

                {children}
            </div>
        </div>
    )
}

export default Resume