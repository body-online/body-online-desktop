import AddLocationBtn from '@/components/location/add-button';
import Card from '@/components/ui/card';
import PageHeader from '@/components/ui/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Mi organización - BodyOnline",
};

export default async function OrganizationPage() {
    // const { data } = await getOrganizatcontainer pb-12 px-default space-y-8 relativeion({ limit: '0' })

    return (
        <div>
            <PageHeader>
                <div className="mb-8 flex md:items-center flex-col md:flex-row justify-between gap-3">
                    <div className='space-y-2'>
                        <div className="flex-between">
                            <h1 className='title'>Mi organización
                                <span className='opacity-50'>({ })</span>
                            </h1>
                        </div>
                        <p className='text-sm tracking-tight font-medium text-slate-500'>Cree y consulte sus ubicaciones.</p>
                    </div>
                    <AddLocationBtn />
                </div>
            </PageHeader>

            <div className="container px-default -mt-12 mb-12">
                <Card>
                    <div></div>
                    {/* <OrganizationDataTable totalAmount={data?.totalOrganization} /> */}
                </Card>
            </div>
        </div>
    )

}