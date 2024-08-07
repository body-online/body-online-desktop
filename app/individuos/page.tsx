import { Metadata } from 'next';

import { getCattles } from '@/data/cattle';
import { getEvents } from '@/data/events';

import AddCattleBtn from '@/components/cattle/create-cattle';
import CattlesDataTable from '@/components/cattle/table';
import InfoMessage from '@/components/ui/info';
import Card from '@/components/ui/card';

export const metadata: Metadata = {
    title: "Individuos - BodyOnline",
};

export default async function CattlesPage() {
    const { data } = await getCattles({ limit: 1 })
    const { data: eventsData } = await getEvents({ limit: 1, page: 1 })

    return (
        <div className="container px-default py-default">
            <Card paddings=''>
                <div className="flex md:items-center justify-between gap-3  p-3 md:p-5">
                    <div className='space-y-2 w-full'>
                        <div className="w-full flex-between">
                            <h1 className='title'>
                                Individuos <span className='opacity-50'>({data?.totalCattles ?? 0})</span>
                            </h1>
                            <AddCattleBtn />
                        </div>
                    </div>
                </div>
                {data?.totalCattles == 0 ?
                    <InfoMessage
                        type='censored'
                        title='Sin resultados'
                    /> :
                    <CattlesDataTable totalAmount={data?.totalCattles} totalEvents={eventsData?.totalEvents} />
                }
            </Card>
        </div>
    )

}