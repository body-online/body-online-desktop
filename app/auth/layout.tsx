import BodyOnlineLogo from '@/components/ui/body-online-logo'
import DefaultLayout from '@/components/ui/default-layout'
import ThemeSwitch from '@/components/ui/theme-switch'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DefaultLayout>
            <div className='w-full my-auto flex flex-col items-center gap-6 py-default px-default'>
                <BodyOnlineLogo />
                {children}
                <ThemeSwitch />
            </div>
        </DefaultLayout>
    )
}

export default AuthLayout

