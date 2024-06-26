import AddLocationBtn from '@/components/location/add-button';
import LocationsDataTable from '@/components/location/table';
import Card from '@/components/ui/card';
import PageHeader from '@/components/ui/header';
import InfoMessage from '@/components/ui/info';
import { getLocations } from '@/data/location';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Ubicaciones - BodyOnline",
};

export default async function LocationsPage() {
    const { data } = await getLocations({ limit: '0' })

    return (
        <div>
            <PageHeader>
                <div className="mb-12 flex md:items-center flex-col md:flex-row justify-between gap-3">
                    <div className='space-y-2'>
                        <div className="flex-between">
                            <h1 className='title'>Ubicaciones <span className='opacity-50'>({data?.totalLocations})</span></h1>
                        </div>
                        <p className='text-sm tracking-tight font-medium text-slate-500'>Cree y consulte sus ubicaciones.</p>
                    </div>
                    <AddLocationBtn />
                </div>
            </PageHeader>

            <div className="container px-default -mt-12 mb-12">
                <Card>
                    {data?.totalLocations == 0 ?
                        <InfoMessage
                            type='censored'
                            title='Crea tu primera ubicación'
                            subtitle='Para poder visualizar la tabla'
                        /> :
                        <LocationsDataTable totalAmount={data?.totalLocations} />
                    }
                </Card>
            </div>
        </div>
    )

}