import React from 'react'
import InfoMessage from '../ui/info'
import { getOperators } from '@/data/operators'
import CardHeader from '../ui/card-header'
import CreateOperator from './create-operator'
import { ExtendedUser } from '@/next-auth'
import { ProfileImage } from '../ui/navbar'
import Pagination from '../ui/pagination'
import { SerializedSearchParamsProps } from '@/app/(main)/page'



const OperatorsPage = async ({ params }: { params: SerializedSearchParamsProps }) => {
    const { data, error } = await getOperators({ page: params?.pageOperators, limit: 10 });

    if (error) return <InfoMessage type='warning' title='Lista de operarios inaccesible' subtitle={error} />

    return (
        <div className='w-full overflow-hidden custom-gradient custom-border border rounded-2xl py-4 md:py-6'>
            <div className="px-3 md:px-5 pb-4 md:pb-6 border-b custom-border flex-between">
                <CardHeader label='Operarios' />
                <CreateOperator chipMode={true} />
            </div>

            {data?.users && data?.users?.length > 0 ? (
                <div className="mt-4 w-full overflow-auto px-3 md:px-5">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.users?.map(
                                (user: ExtendedUser, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="w-max flex items-center gap-2">
                                                    <ProfileImage url={user.image} type={user.type} />
                                                    <p className='font-semibold text-black dark:text-white'>
                                                        {user.name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td>{user?.email}</td>
                                            <td>
                                                <div className={`chip ${user?.type == "operator" ? 'bg-blue-500 dark:bg-blue-500' : 'bg-red-500 dark:bg-red-400'}`}>
                                                    <p className='font-medium text-white'>{user?.type == 'operator' ? 'Operador' : 'Adminstrador'}</p>
                                                </div>
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
                </div>
            ) : (
                <InfoMessage type='censored' title='No hemos encontrado operarios' />
            )}

            <div className=" px-3 md:px-5">
                <Pagination page={params.pageOperators} paramName="pageOperators" />
            </div>
        </div>
    )
}

export default OperatorsPage