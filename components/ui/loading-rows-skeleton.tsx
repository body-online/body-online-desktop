
const LoadingRowsSkeleton = () => {
    return (
        <div className='relative overflow-hidden w-full flex flex-col gap-y-3'>
            <div className="min-h-11 md:min-h-12 w-full rounded-lg animate-pulse bg-slate-200 dark:bg-clightgray border dark:border-0"></div>
            <div className="min-h-11 md:min-h-12 w-full rounded-lg animate-pulse bg-slate-200 dark:bg-clightgray border dark:border-0"></div>
            <div className="min-h-11 md:min-h-12 w-full rounded-lg animate-pulse bg-slate-200 dark:bg-clightgray border dark:border-0"></div>
            <div className="min-h-11 md:min-h-12 w-full rounded-lg animate-pulse bg-slate-200 dark:bg-clightgray border dark:border-0"></div>
        </div>
    )
}

export default LoadingRowsSkeleton