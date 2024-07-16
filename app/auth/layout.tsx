import DefaultLayout from '@/components/ui/default-layout'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DefaultLayout>
            <div className="px-default py-default flex-center">
                {children}
            </div>
        </DefaultLayout>
    )
}

export default AuthLayout