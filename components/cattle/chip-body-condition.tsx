import { useSession } from 'next-auth/react'
import React from 'react'

const ChipBodyCondition = ({ measure }: { measure?: number }) => {
    const { data: session } = useSession()
    if (!session) return <p>Loading</p>

    const bodyCondition = !measure || measure == 0 ? undefined : measure > Number(session?.user?.maxIdeal) ? 'fat' : Number(session?.user?.minIdeal) > 10 ? 'ideal' : "skinny"

    if (bodyCondition == "fat") {
        return (
            <div>
                <p className='chip chip_orange'>Gorda {`(${measure})`}</p>
            </div>
        )
    }
    if (bodyCondition == "skinny") {
        return (
            <div>
                <p className='chip chip_yellow'>Flaca {`(${measure})`}</p>
            </div>
        )
    }
    if (bodyCondition == "ideal") {
        return (
            <div>
                <p className='chip chip_green'>Ideal {`(${measure})`}</p>
            </div>
        )
    }
    return (
        <div>
            <p className='chip chip_gray'>Sin mediciones</p>
        </div>
    )
}

export default ChipBodyCondition