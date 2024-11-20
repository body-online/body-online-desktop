'use client'


const ChipIsOnline = ({ isOnline = false }: { isOnline?: boolean }) => {

    return (
        <div className={`chip chip_gray`}>
            <div className="flex-center gap-1 max-w-max">
                <div className={`w-full rounded-full h-full max-w-2 max-h-2 min-w-2 min-h-2 
            ${isOnline ? 'bg-green-500 dark:bg-green-400' : 'bg-gray-400'}`}
                ></div>
                <p className=' font-medium text-[15px]'>
                    {isOnline ? 'Online' : 'Offline'}
                </p>
            </div>
        </div>
    )
}

export default ChipIsOnline