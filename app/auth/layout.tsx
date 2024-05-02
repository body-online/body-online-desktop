
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-screen h-screen flex justify-center items-center px-2'>
            <div className='w-full max-w-md mx-auto'>
                <div className="w-max mx-auto mb-4">
                    <h1 className='text-2xl sm:text-3xl font-black'>BodyOnline</h1>
                    <div className="w-full h-[3px] relative bg-gradient-to-r from-cgreen via-caqua to-clime -mt-1 overflow-hidden" />
                </div>
                {children}
            </div>
        </div>
    )
}

export default AuthLayout