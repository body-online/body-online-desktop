import { Metadata } from 'next';
import { getGenetics } from '@/data/genetic';

import { columnsGenetic } from '@/components/genetic/columns';
import AddGeneticBtn from '@/components/genetic/add-genetic';
import GeneticsDataTable from '@/components/genetic/table';
import InfoMessage from '@/components/ui/info';
import Card from '@/components/ui/card';

export const metadata: Metadata = {
    title: "Genéticas - BodyOnline",
};

export default async function GeneticsPage() {
    const { data, error } = await getGenetics()

    return (
        <div className="container px-default py-default">
            <Card paddings=''>
                <div className="flex md:items-center justify-between gap-3  p-3 md:p-5">
                    <div className='space-y-2 w-full'>
                        <div className="w-full flex-between">
                            <h1 className='title'>
                                Genéticas <span className='opacity-50'>({data?.length ?? 0})</span>
                            </h1>
                            <AddGeneticBtn />
                        </div>
                    </div>
                </div>
                {error || !data ?
                    <InfoMessage type='warning' title='Algo ha salido mal..' /> :
                    Array.isArray(data) && data?.length == 0 ?
                        <InfoMessage
                            type='censored'
                            title='Crea tu primera genética para poder visualizar la tabla'
                        /> :
                        <GeneticsDataTable genetics={data} columns={columnsGenetic} />
                }
            </Card>
        </div>
    )

}