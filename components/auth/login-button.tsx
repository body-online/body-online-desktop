'use client'

import { useRouter } from 'next/navigation';

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | 'redirect';
    asChild?: boolean;
}

export const LoginButton = ({
    children,
    mode = "redirect",
    asChild
}: LoginButtonProps) => {
    const router = useRouter()

    const onClick = () => {
        return router.push("/auth/login")
    }

    if (mode === 'modal') {
        return <p>Implement modal</p>

    }
    return (<span onClick={onClick}>
        {children}
    </span>)
}