import AddGeneticBtn from '@/components/genetic/add-button';
import { columnsGenetic } from '@/components/genetic/columns';
import GeneticsDataTable from '@/components/genetic/table';
import Card from '@/components/ui/card';
import PageHeader from '@/components/ui/header';
import InfoMessage from '@/components/ui/info';
import { getGenetics } from '@/data/genetic';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Genéticas - BodyOnline",
};

export default async function GeneticsPage() {
    const { data, error } = await getGenetics()

    return (
        <div className='h-full'>
            <PageHeader>
                <div className="mb-8 flex md:items-center flex-col md:flex-row justify-between gap-3">
                    <div className='space-y-2'>
                        <div className="flex-between">
                            <h1 className='title'>Genéticas <span className='opacity-50'>({data?.length ?? 0})</span></h1>
                        </div>
                        <p className='text-sm tracking-tight font-medium text-slate-500'>Cree y consulte sus genéticas.</p>
                    </div>
                    <AddGeneticBtn />
                </div>
            </PageHeader>

            <div className="container px-default -mt-12 mb-12">
                <Card>
                    {error || !data ?
                        <InfoMessage type='warning' title='Algo ha salido mal..' /> :
                        Array.isArray(data) && data?.length == 0 ?
                            <InfoMessage
                                type='censored'
                                title='Crea tu primera genética'
                                subtitle='Para poder visualizar la tabla'
                            /> :
                            <GeneticsDataTable genetics={data} columns={columnsGenetic} />
                    }
                </Card>
            </div>
        </div>
    )

}