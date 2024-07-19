import AddCattleBtn from '@/components/cattle/create-cattle';
import CattlesDataTable from '@/components/cattle/table';
import Card from '@/components/ui/card';
import PageHeader from '@/components/ui/header';
import InfoMessage from '@/components/ui/info';
import { getCattles } from '@/data/cattle';
import { getEvents } from '@/data/events';
import { getLocations } from '@/data/location';
import { currentUser } from '@/lib/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Individuos - BodyOnline",
};

export default async function CattlesPage() {
    const user = await currentUser()
    const { data } = await getCattles({ limit: 1 })
    const { data: locationsData } = await getLocations({ limit: 1, page: 1 })
    const { data: eventsData } = await getEvents({ limit: 1, page: 1 })

    return (
        <div>
            <PageHeader>
                <div className="mb-12 flex md:items-center flex-col md:flex-row justify-between gap-3">
                    <div className='space-y-2'>
                        <div className="flex-between">
                            <h1 className='title'>Individuos <span className='opacity-50'>({data?.totalCattles ?? 0})</span></h1>
                        </div>
                        <p className='text-sm tracking-tight font-medium text-slate-500'>Cree y consulte sus individuos.</p>
                    </div>
                    <AddCattleBtn />
                </div>
            </PageHeader>

            <div className="container px-default -mt-12 mb-12">
                <Card paddings=''>
                    {data?.totalCattles == 0 ?
                        <InfoMessage
                            type='censored'
                            title='Sin resultados'
                        /> :
                        <CattlesDataTable totalAmount={data?.totalCattles} totalEvents={eventsData?.totalEvents} />
                    }
                </Card>
            </div>
        </div>
    )

}