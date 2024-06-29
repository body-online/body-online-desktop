import React, { useState } from 'react'

type ToastCardProps = {
    title?: string | null;
    children?: React.ReactNode;
    type: 'warning' | 'success' | 'info';
    handleClose?: Function;
}

const ToastCard = ({ title, children, type, handleClose }: ToastCardProps) => {

    if (!title) return null

    return (
        <div className='rounded-xl bg-white dark:bg-slate-950 border p-4'>
            <div className="flex gap-2 items-center justify-between">
                <div className='flex gap-2 items-center justify-start'>
                    <div className="mt-[3px]">
                        <ToastIcon type={type} />
                    </div>

                    {title && <h4 className='font-medium'>{title}</h4>}
                </div>

                {handleClose &&
                    <button type='button' onClick={() => handleClose()}>
                        <CloseIcon />
                    </button>
                }
            </div>

            {children}
        </div>
    )
}

export default ToastCard


const ToastIcon = ({ type }: { type: ToastCardProps['type'] }) => {
    switch (type) {
        case 'warning':
            return <AlertIcon />

        case 'success':
            return <SuccessIcon />

        case 'info':
            return <InfoIcon />

        default:
            break;
    }
}
const InfoIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 fill-blue-500">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
        </div>
    )
}
const SuccessIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-green-500">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
            </svg>

        </div>
    )
}
const AlertIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-red-600">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
        </div>
    )
}

const CloseIcon = () => {
    return (
        <div className='hover:bg-gray-100 rounded-full p-1'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
        </div>
    )
}