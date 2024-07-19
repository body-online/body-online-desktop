import { ExtendedUser } from '@/next-auth';
import React from 'react'
import { ProfileImage } from '../ui/navbar';

const OperatorsTable = ({ users }: { users: ExtendedUser[] }) => {
    return (
        <table className='relative'>
            <thead className='sticky top-0'>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {users?.map(
                    (user: ExtendedUser, index: number) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <div className="w-max flex items-center gap-2">
                                        <ProfileImage url={user.image} type={user.type} />
                                        <p className='font-semibold text-black dark:text-white test-sm'>
                                            {user.name}
                                        </p>
                                    </div>
                                </td>
                                <td>{user?.email}</td>
                                <td>
                                    <p className={`chip ${user?.type == "operator" ? 'chip_blue' : 'chip_red'}`}>
                                        {user?.type == 'operator' ? 'Operario' : 'Adminstrador'}
                                    </p>
                                </td>
                                <td>
                                    <div className="flex gap-2 items-center">

                                    </div>
                                </td>
                            </tr>
                        );
                    }
                )}
            </tbody>
        </table>
    )
}

export default OperatorsTable