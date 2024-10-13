import React from 'react'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { CattleProps, CreateTaskSchema } from '@/lib/types'
import { CheckIcon } from '../ui/icons'
import { motion } from 'framer-motion'
import InfoMessage from '../ui/info'

const AssignCaravans = ({ cattles, setValue, selectedCaravans }:
    {
        cattles: CattleProps[],
        setValue: UseFormSetValue<CreateTaskSchema>,
        register: UseFormRegister<CreateTaskSchema>,
        selectedCaravans: string[] | undefined
    }) => {

    if (!cattles.length) {
        return (
            <>
                <InfoMessage
                    type='warning'
                    title={`No posees individuos en la organización`}
                    subtitle={'Crea un individuo para comenzar'}
                />
                {/* <CreateCattle /> */}
            </>

        )
    }

    return (
        <div className="flex flex-col gap-2">
            {cattles.map((cattle, index) => {
                const selected = Boolean(selectedCaravans?.find(id => id === cattle._id));

                return (
                    <motion.button
                        layout
                        key={`${cattle._id}-${index}`}
                        value={cattle._id}
                        onClick={() => {
                            if (!selectedCaravans) {
                                setValue('caravan', [cattle._id])
                            } else if (selected) {
                                setValue('caravan', selectedCaravans?.filter(id => id !== cattle._id) ?? [])
                            } else {
                                setValue('caravan', [...selectedCaravans, cattle._id])
                            }
                        }}
                        className={`relative flex items-center gap-2 px-3 -mx-3 py-4 ${selected ? "bg-slate-50 dark:bg-clightgray" : "md:hover:bg-slate-50 md:dark:hover:bg-clightgray "} rounded-md`}
                    >
                        <div className={`h-5 overflow-hidden flex items-center justify-start transition-all duration-75 ${selected ? 'w-5' : 'w-0'}`}>
                            <div className='min-w-max min-h-max'>
                                <CheckIcon fill='fill-clightgreen dark:fill-clime' />
                            </div>
                        </div>

                        <motion.p layout className='font-medium'>{cattle.caravan}</motion.p>

                    </motion.button>
                )
            })}
        </div>
    )
}

export default AssignCaravans