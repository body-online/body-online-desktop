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


export default async function Home() {
  const user = await currentUser()

  if (!user?.farmId) {
    return redirect('/onboarding')
  }

  const { data: notificationsObj, error: errorNotifications } = await getPendingMeasures({ limit: '1' })
  const { data: cattles, error: errorCattles } = await getCattles({ limit: '1' })
  const { data: locations, error: errorLoc } = await getLocations({ limit: '1' })
  const { data: events, error: errorEvents } = await getEvents({ limit: '1' })
  const { data: genetics, error: errorGen } = await getGenetics()

  return (
    <main>
      <div className='w-full py-default'>
        {/* my organization and basic stats */}
        {!errorLoc || errorCattles || errorGen ?
          <div className="flex gap-6 w-full overflow-auto px-default pb-2">

            <div className='w-max flex flex-col gap-2 justify-center items-center'>
              <div className=' rounded-2xl bg-white p-4'>
                <h1 className='text-2xl text-center font-bold text-cgreen'>
                  {cattles?.totalCattles}
                </h1>
                <h2 className='text-center text-slate-500 font-medium text-sm tracking-tight'>Invididuos</h2>
              </div>

              <AddCattleBtn chipMode={true} />
            </div>

            <div className='w-max flex flex-col gap-2 justify-center items-center'>
              <div className=' rounded-2xl bg-white p-4'>
                <h1 className='text-2xl text-center font-bold text-cgreen'>
                  {events?.events?.length ?? '-'}
                </h1>
                <h2 className='text-center text-slate-500 font-medium text-sm tracking-tight'>Eventos</h2>
              </div>

              <AddEventBtn />
            </div>

            <div className='w-max flex flex-col gap-2 justify-center items-center'>
              <div className=' rounded-2xl bg-white p-4'>
                <h1 className='text-2xl text-center font-bold text-cgreen'>
                  {locations?.locations.length}
                </h1>
                <h2 className='text-center text-slate-500 font-medium text-sm tracking-tight'>Ubicaciones</h2>
              </div>

              <AddLocationBtn chipMode={true} />
            </div>

            <div className='w-max flex flex-col gap-2 justify-center items-center'>
              <div className=' rounded-2xl bg-white p-4'>
                <h1 className='text-2xl text-center font-bold text-cgreen'>
                  {genetics?.length}
                </h1>
                <h2 className='text-center text-slate-500 font-medium text-sm tracking-tight'>Genéticas</h2>
              </div>

              <AddGeneticBtn chipMode={true} />
            </div>



          </div> : <InfoMessage type='warning' title='Recursos inaccesibles' />
        }

        <div className="mt-6 space-y-4 w-full">
          <div className='grid sm:grid-cols-2'>
            <div className="w-full overflow-hidden px-default">
              <Card headerLabel={`${notificationsObj?.totalNotifications} Mediciones pendientes`}>
                {Array.isArray(notificationsObj?.notifications) && notificationsObj?.notifications?.length == 0 ?
                  <InfoMessage
                    type='censored'
                    title='Crea tu primer evento de servicio'
                    subtitle='Para poder visualizar las mediciones en esta tabla'
                  /> :
                  <PendingMeasuresDataTable totalAmount={notificationsObj?.totalNotifications} />
                }
              </Card>
            </div>
          </div>
        </div>
      </div>

    </main >
  );
}
