
const LoadingTableSkeleton = () => {
    return (
        <div className='w-full h-max'>
            <div className='overflow-hidden w-full flex flex-col gap-y-1 divide-y custom-divide'>

                <div className="grid grid-cols-3 gap-2 p-2">
                    <div className="w-12 rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-20 rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-12 hidden md:block rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                </div>


                <div className="grid grid-cols-3 gap-2 p-2">
                    <div className="w-full rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-32 rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-20 hidden md:block rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                </div>


                <div className="grid grid-cols-3 gap-2 p-2">
                    <div className="w-full rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-32 rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-20 hidden md:block rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                </div>


                <div className="grid grid-cols-3 gap-2 p-2">
                    <div className="w-full rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-32 rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-20 hidden md:block rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                </div>


                <div className="grid grid-cols-3 gap-2 p-2">
                    <div className="w-full rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-32 rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-20 hidden md:block rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                </div>


                <div className="grid grid-cols-3 gap-2 p-2">
                    <div className="w-full rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-32 rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                    <div className="w-20 hidden md:block rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6"></div>
                </div>


                <div className="flex-end p-2">
                    <div className=" rounded-full bg-slate-200 dark:bg-clightgray animate-pulse h-6 w-32 ml-auto"></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingTableSkeleton