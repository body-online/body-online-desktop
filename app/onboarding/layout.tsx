import ThemeSwitch from '@/components/ui/theme-switch'

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-screen h-screen flex justify-center items-center px-2 dark:bg-gradient-to-b
        bg-slate-100 dark:from-clightgray/30 dark:via-cgray dark:to-cblack dark:bg-cblack
        '>
            <div className='w-full max-w-md mx-auto'>
                <div className="w-full mx-auto mb-4 flex-between">
                    <h1 className='text-2xl font-semibold dark:text-white'>Body<span className='font-bold text-cgreen dark:text-clime'>Online</span></h1>
                    <ThemeSwitch />
                </div>
                {children}
            </div>
        </div>
    )
}

export default OnboardingLayout