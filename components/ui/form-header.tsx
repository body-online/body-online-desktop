import React from 'react'
import BackButton from './back-button'

const FormHeader = ({ label, backUrl, step, totalSteps }:
    {
        label: string;
        backUrl?: string;
        step?: number
        totalSteps?: number
    }
) => {
    return (
        <div className="flex gap-4 px-2 items-end w-full justify-between">
            <div className="flex-center gap-1 md:gap-2">
                {backUrl ?
                    <BackButton url={backUrl} />
                    : null
                }

                <h2 className="text-xl lg:text-2xl font-semibold text-center">
                    {label}
                </h2>
            </div>
            {(step && totalSteps) ?
                <div className='ml-2'>
                    <p className='input_instructions text-sm font-medium'><b className='text-base'>{step}</b> de {totalSteps}</p>
                </div>
                : null
            }
        </div>
    )
}

export default FormHeader

