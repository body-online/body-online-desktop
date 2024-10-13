import { ExtendedUser } from '@/next-auth';
import { ProfileImage } from '../ui/navbar';

const CattlesTable = ({ users }: { users: ExtendedUser[] }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table>
                <thead className='sticky top-0'>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        {/* <th>Acciones</th> */}
                    </tr>
                </thead>

                <tbody>
                    {users?.map(
                        (user: ExtendedUser, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <ProfileImage user={user} width='w-6' height='h-6' />
                                            <p>
                                                {user?.name}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <p>{user?.email}</p>
                                    </td>
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default CattlesTable