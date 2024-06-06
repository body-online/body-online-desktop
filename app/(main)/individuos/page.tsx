import AddCattleBtn from '@/components/cattle/add-button';
import CattlesDataTable from '@/components/cattle/table';
import Card from '@/components/ui/card';
import PageHeader from '@/components/ui/header';
import InfoMessage from '@/components/ui/info';
import { getCattles } from '@/data/cattle';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Individuos - BodyOnline",
};

export default async function CattlesPage() {
    const { data } = await getCattles({ limit: '0' })

    return (
        <div>
            <PageHeader>
                <div className="mb-8 flex md:items-center flex-col md:flex-row justify-between gap-3">
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
                <Card>
                    {data?.totalCattles == 0 ?
                        <InfoMessage
                            type='censored'
                            title='Crea tu primer individuo'
                            subtitle='Para poder visualizar la tabla'
                        /> :
                        <CattlesDataTable totalAmount={data?.totalCattles} />
                    }
                </Card>
            </div>
        </div>
    )

}