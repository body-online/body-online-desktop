'use client'


const ChipIsOnline = ({ isOnline = false }: { isOnline?: boolean }) => {

    return (
        <div className="flex-center gap-1 max-w-max">
            {isOnline ? (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
            ) : (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
            )}
            <p className='font-medium text-xs input_instructions'>
                {isOnline ? 'Online' : 'Offline'}
            </p>
        </div>
    )
}

export default ChipIsOnline