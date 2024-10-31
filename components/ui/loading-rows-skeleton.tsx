
const LoadingRowsSkeleton = () => {
    return (
        <div className='w-full h-max'>
            <div className='overflow-hidden w-full flex flex-col gap-y-1'>
                <div className="min-h-11 md:min-h-12 w-full animate-pulse bg-slate-200 dark:bg-clightgray border dark:border-0"></div>
                <div className="min-h-11 md:min-h-12 w-full animate-pulse bg-slate-200 dark:bg-clightgray border dark:border-0"></div>
                <div className="min-h-11 md:min-h-12 w-full animate-pulse bg-slate-200 dark:bg-clightgray border dark:border-0"></div>
                <div className="min-h-11 md:min-h-12 w-full animate-pulse bg-slate-200 dark:bg-clightgray border dark:border-0"></div>
                <div className="min-h-11 md:min-h-12 w-full animate-pulse bg-slate-200 dark:bg-clightgray border dark:border-0"></div>
            </div>
            <div className="flex-end p-2">
                <div className=" rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6 w-32 ml-auto"></div>
            </div>
        </div>
    )
}

export default LoadingRowsSkeleton