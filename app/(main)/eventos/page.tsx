import AddEventBtn from '@/components/events/add-event';
import EventsDataTable from '@/components/events/table';
import Card from '@/components/ui/card';
import PageHeader from '@/components/ui/header';
import InfoMessage from '@/components/ui/info';
import { getEvents } from '@/data/events';
import { currentUser } from '@/lib/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Eventos - BodyOnline",
};

export default async function EventsPage() {
    const user = await currentUser()
    const { data: eventsData } = await getEvents({ limit: 1, page: 1 })

    return (
        <div>
            <PageHeader>
                <div className="mb-12 flex md:items-center flex-col md:flex-row justify-between gap-3">
                    <div className='space-y-2'>
                        <div className="flex-between">
                            <h1 className='title'>Eventos <span className='opacity-50'>({eventsData?.totalEvents ?? 0})</span></h1>
                        </div>
                        <p className='text-sm tracking-tight font-medium text-slate-500'>Cree y consulte sus individuos.</p>
                    </div>
                    {user?.type === 'owner' ? <AddEventBtn /> : null}
                </div>
            </PageHeader>

            <div className="container px-default -mt-12 mb-12">
                <Card paddings=''>
                    {eventsData?.totalEvents == 0 ?
                        <InfoMessage
                            type='censored'
                            title='Sin resultados'
                        /> :
                        <EventsDataTable totalAmount={eventsData?.totalEvents} totalEvents={eventsData?.totalEvents} />
                    }
                </Card>
            </div>
        </div>
    )

}