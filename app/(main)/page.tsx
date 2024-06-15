import { redirect } from 'next/navigation';
import Link from 'next/link';

import { getPendingMeasures } from '@/data/pending-measures';
import { getLocations } from '@/data/location';
import { getGenetics } from '@/data/genetic';
import { getCattles } from '@/data/cattle';
import { currentUser } from '@/lib/auth';

import PendingMeasuresDataTable from '@/components/pending_measures/table';
import AddLocationBtn from '@/components/location/add-button';
import AddGeneticBtn from '@/components/genetic/add-button';
import AddCattleBtn from '@/components/cattle/add-button';
import AddEventBtn from '@/components/cattle/add-event';
import InfoMessage from '@/components/ui/info';
import Card from '@/components/ui/card';
import { getEvents } from '@/data/events';
import { EventIcon, LoadingIcon, MiniAddIcon } from '@/components/ui/icons';
import PageHeader from '@/components/ui/header';
import CattleCounter from '@/components/cattle/cattle-counter';
import { Suspense, useContext } from 'react';
import { StatusContext } from '../context/status-context';


export default async function Home() {
  const user = await currentUser()

  if (!user?.farmId) {
    return redirect('/onboarding')
  }

  // const { data: notificationsObj, error: errorNotifications } = await getPendingMeasures({ limit: '1' })
  // const { data: cattles, error: errorCattles } = await getCattles({ limit: '1' })
  // const { data: locations, error: errorLoc } = await getLocations({ limit: '1' })
  // const { data: events, error: errorEvents } = await getEvents({ limit: '1' })
  // const { data: genetics, error: errorGen } = await getGenetics()

  return (
    <main className='h-full'>
      <PageHeader>
        <div className="mb-12 flex md:items-center flex-col md:flex-row justify-between gap-3">
          <div className="flex-between">
            <h1 className='title'>San Fernando</h1>
          </div>


          <div className="grid sm:grid-cols-2 md:grid-cols-4 max-w-max">
            <div className="flex-center">

            </div>
            <div className='h-max w-20 flex flex-col items-center'>
              <div className="h-10 flex-center">
                {/* <Suspense fallback={<LoadingIcon />}> */}
                <CattleCounter />
                {/* <p>{cattles}</p> */}
                {/* </Suspense> */}
              </div>
              <p className='text-sm font-medium text-center'>Individuos</p>
            </div>
            {/* <div className="">
              <h3 className='title text-center text-cgreen'>12</h3>
              <p className='text-sm font-medium text-center'>Individuos</p>
            </div> */}
          </div>
        </div>
      </PageHeader>

      <div className="container px-default -mt-12 mb-12">
        <Card>
          <p>Mediciones pendientes...</p>

        </Card>
      </div>
    </main>
    // <div className='w-full pb-default'>
    //   {!errorLoc || errorCattles || errorGen ?
    //     <div className="flex w-full px-default container py-default">
    //       <AddCattleBtn>
    //         <div className="flex-center bg-white border border-slate-300 rounded-full w-max">
    //           <p className='text-base font-medium text-slate-600 px-4'>{cattles?.totalCattles} Individuos</p>
    //           <div className="rounded-full p-4 bg-cgreen active:bg-csemigreen md:hover:bg-csemigreen">
    //             <MiniAddIcon sizes='w-5 h-5' fill='fill-clime' />
    //           </div>
    //         </div>
    //       </AddCattleBtn>

    //     </div> : <InfoMessage type='warning' title='Recursos inaccesibles' />
    //   }

    //   <div className="mt-6 space-y-4 w-full">
    //     <div className='grid sm:grid-cols-2'>
    //       <div className="w-full overflow-hidden px-default">
    //         <Card headerLabel={`${notificationsObj?.totalNotifications} Mediciones pendientes`}>
    //           {Array.isArray(notificationsObj?.notifications) && notificationsObj?.notifications?.length == 0 ?
    //             <InfoMessage
    //               type='censored'
    //               title='Crea tu primer evento de servicio'
    //               subtitle='Para poder visualizar las mediciones en esta tabla'
    //             /> :
    //             <PendingMeasuresDataTable totalAmount={notificationsObj?.totalNotifications} />
    //           }
    //         </Card>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
