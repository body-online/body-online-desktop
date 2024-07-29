import { Metadata } from 'next';
import { getLocations } from '@/data/location';

import LocationsDataTable from '@/components/location/table';
import AddLocationBtn from '@/components/location/add-location';
import InfoMessage from '@/components/ui/info';
import Card from '@/components/ui/card';

export const metadata: Metadata = {
    title: "Ubicaciones - BodyOnline",
};

export default async function LocationsPage() {
    const { data } = await getLocations({ limit: 1, page: 1 })

    return (
        <div className="container px-default py-default">
            <Card paddings=''>
                <div className="flex md:items-center justify-between gap-3  p-3 md:p-5">
                    <div className='space-y-2 w-full'>
                        <div className="w-full flex-between">
                            <h1 className='title'>
                                Ubicaciones <span className='opacity-50'>({data?.totalLocations ?? 0})</span>
                            </h1>
                            <AddLocationBtn />
                        </div>
                    </div>
                </div>
                {data?.totalLocations == 0 ?
                    <InfoMessage
                        type='censored'
                        title='Sin resultados'
                    /> :
                    <LocationsDataTable totalAmount={data?.totalLocations} />
                }
            </Card>
        </div>
    )

}