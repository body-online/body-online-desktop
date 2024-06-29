
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-screen h-screen flex justify-center items-center px-2 
        bg-slate-50 dark:bg-cblack
        '>
            {/* bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]
            from-1% from-caqua/80 via-caqua/30 to-cgreen bg-cgreen */}
            <div className='w-full max-w-md mx-auto'>
                <div className="w-max mx-auto mb-4">
                    <h1 className='text-2xl font-semibold text-white'>Body<span className='font-bold text-clime dark:text-clime'>Online</span></h1>
                </div>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout