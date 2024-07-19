import DefaultLayout from '@/components/ui/default-layout'

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DefaultLayout customBackgrounds='bg-white dark:bg-cblack'>
            <div className="px-default py-default flex-center h-full">
                {children}
            </div>
        </DefaultLayout>
    )
}

export default OnboardingLayout