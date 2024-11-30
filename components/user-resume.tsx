'use client'

import { ExtendedUser } from '@/next-auth'

const UserResumeCard = ({ user }: { user?: ExtendedUser }) => {

    if (!user) return null

    return (
        <div>
            <div className="gradient_card">
                <h1 className="subtitle">
                    Bienvenido {user.name}
                </h1>



            </div>
        </div>
    )
}

export default UserResumeCard