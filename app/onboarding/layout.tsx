
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-screen h-screen flex justify-center items-center px-2 
        bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]
        from-1% from-caqua/80 via-caqua/30 bg-cgreen
        '>
            {/* bg-gradient-to-t from-slate-950/30 via-cgreen to-caqua/50 bg-cgreen */}
            <div className='w-full max-w-md mx-auto'>
                <div className="w-max mx-auto mb-4">
                    <h1 className='text-2xl font-semibold text-white'>Body<span className='font-bold text-clime'>Online</span></h1>
                    {/* <div className="w-full h-[3px] relative bg-gradient-to-r from-cgreen via-caqua to-clime -mt-1 overflow-hidden" /> */}
                </div>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout