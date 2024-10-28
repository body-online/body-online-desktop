'use client';

import { ExtendedUser } from '@/next-auth'
import { ProfileImage } from '../ui/navbar'

const UsersResume = ({ assignedTo }: { assignedTo: ExtendedUser[] }) => {
    const leftAssigned = (assignedTo?.length ?? 0) - 5

    if (!assignedTo) return <p className='input_instructions'>-</p>
    return (
        <div>
            <div className="w-max flex items-center">
                <div className="flex rounded-full bg-white dark:bg-clightgray bordercustom-border">
                    {assignedTo.slice(0, 5).map((assignedTo, index) => {
                        return (
                            <div
                                className='w-max border-[3px] rounded-full border-white dark:border-clightgray first:m-0 -ml-2 select-none'
                                key={index}
                            >
                                <ProfileImage user={assignedTo} height='h-7' width='w-7' />
                            </div>
                        )
                    })}
                </div>
                {
                    leftAssigned >= 1 ?
                        <p className='ml-1 font-medium text-sm text-slate-500 dark:text-slate-400'>
                            {leftAssigned} más
                        </p> : null
                }
            </div>
        </div>
    )
}

export default UsersResume