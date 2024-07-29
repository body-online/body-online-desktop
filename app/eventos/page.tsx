import { Metadata } from 'next';
import { getEvents } from '@/data/events';

import EventsDataTable from '@/components/events/table';
import AddEventBtn from '@/components/cattle/add-event';
import InfoMessage from '@/components/ui/info';
import Card from '@/components/ui/card';

export const metadata: Metadata = {
    title: "Eventos - BodyOnline",
};

export default async function EventsPage() {
    const { data } = await getEvents({ limit: 1, page: 1 })

    return (
        <div className="container px-default py-default">
            <Card paddings=''>
                <div className="flex md:items-center justify-between gap-3  p-3 md:p-5">
                    <div className='space-y-2 w-full'>
                        <div className="w-full flex-between">
                            <h1 className='title'>
                                Eventos <span className='opacity-50'>({data?.totalEvents ?? 0})</span>
                            </h1>
                            <AddEventBtn />
                        </div>
                    </div>
                </div>
                {data?.totalEvents == 0 ?
                    <InfoMessage
                        type='censored'
                        title='Sin resultados'
                    /> :
                    <EventsDataTable totalAmount={data?.totalEvents} />
                }
            </Card>
        </div>
    )

}