import React from 'react'

import { SerializedSearchParamsProps } from '@/app/page'

import CreateOperator from './create-operator'
import { getOperators } from '@/data/operators'

import OperatorsTable from './operators-table'
import Pagination from '../ui/pagination'
import InfoMessage from '../ui/info'
import Card from '../ui/card'

export default async function OperatorsPage({ params }: { params: SerializedSearchParamsProps }) {
    // get the list of operators existents to this farm
    const { data, error } = await getOperators({ page: params?.pageOperators ?? 1, limit: 10 });

    return (
        <Card paddings='py-4 md:py-6 w-full flex flex-col overflow-hidden h-min'>
            <div className="px-3 md:px-5 pb-4 md:pb-6 flex-between border-b custom-border">
                <h2 className='semititle'>Usuarios</h2>
                <CreateOperator mode={'mini'} />
            </div>

            {!error && data ? (
                <div className='w-full flex flex-col h-full'>
                    {data?.users && data?.users?.length > 0 ? (
                        <div className="w-full overflow-auto h-full">
                            <OperatorsTable users={data.users} />
                        </div>
                    ) : <InfoMessage type='censored' title='No hemos encontrado usuarios' />
                    }

                    <div className="px-3 md:px-5 mt-3">
                        <Pagination
                            paramName="pageOperators"
                            page={params.pageOperators ?? 1}
                            totalPages={data?.totalPages ?? 1}
                        />
                    </div>
                </div>
            ) : <InfoMessage type='warning' title='Lista de usuarios inaccesible' subtitle={error} />
            }

        </Card>
    )
}