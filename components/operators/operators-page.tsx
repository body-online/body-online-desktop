import React from 'react'
import InfoMessage from '../ui/info'
import { getOperators } from '@/data/operators'
import CardHeader from '../ui/card-header'
import CreateOperator from './create-operator'
import { ExtendedUser } from '@/next-auth'
import { ProfileImage } from '../ui/navbar'
import Pagination from '../ui/pagination'
import { SerializedSearchParamsProps } from '@/app/(main)/page'
import Card from '../ui/card'

export default async function OperatorsPage({ params }: { params: SerializedSearchParamsProps }) {
    // get the list of operators existents to this farm
    const { data, error } = await getOperators({ page: params?.pageOperators ?? 1, limit: 10 });

    return (
        <Card paddings='py-4 md:py-6 w-full flex flex-col overflow-hidden h-min'>
            <div className="px-3 md:px-5 pb-4 md:pb-6 border-b custom-border flex-between">
                <CardHeader label='Operarios' />
                <CreateOperator mode={'mini'} />
            </div>

            {!error && data ? (
                <div className='w-full flex flex-col h-full max-h-96'>
                    {data?.users && data?.users?.length > 0 ? (
                        <div className="w-full overflow-auto h-full">
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
                                    {data?.users?.map(
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
                        </div>
                    ) : <InfoMessage type='censored' title='No hemos encontrado operarios' />
                    }

                    <div className="px-3 md:px-5">
                        <Pagination
                            paramName="pageOperators"
                            page={params.pageOperators ?? 1}
                            totalPages={data?.totalPages ?? 1}
                        />
                    </div>
                </div>
            ) : <InfoMessage type='warning' title='Lista de operarios inaccesible' subtitle={error} />
            }

        </Card>
    )
}