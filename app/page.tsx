import { currentUser } from '@/lib/auth';

import OperatorsTablePage from '@/components/operator/operators-table-page';
import CattlesDashboard from '@/components/cattles/dashboard';
import GeneticsTablePage from '@/components/genetic/genetics-table-page';
import LocationsDataTable from '@/components/location/table';
import FarmForm from '@/components/farm-form';
import { redirect } from 'next/navigation';
import EventsDataTable from '@/components/event/table';
import { getCattles } from '@/data/cattle';
import InfoMessage from '@/components/ui/info';
import { InfoIcon } from '@/components/ui/icons';
import Card from '@/components/ui/card';
import Link from 'next/link';


export default async function Home() {
  const user = await currentUser()
  const { data } = await getCattles({ page: 1, limit: 1 })
  const hasAnyCattle = Boolean(data?.cattles?.length)

  if (!user) return redirect("/auth/login")

  if (!user?.farmId) {
    return (
      <div className="w-screen h-[calc(100vh-60px)] overflow-hidden flex-center px-default">
        <div className="-mt-12 w-full flex-center">
          <FarmForm />
        </div>
      </div>
    )
  }

  if (user?.type != 'owner') return redirect('/tareas')

  return (
    <div className="py-default px-default">

      <div className=' mb-4'>
        <h1 className="text-2xl font-bold">
          {user?.farmName}
        </h1>
        <h2 className='font-medium'>Bienvenido {user.name}</h2>
      </div>

      <div className="w-full flex flex-col gap-6 overflow-hidden">

        {!hasAnyCattle ? (

          <div className='bg-gradient-to-r from-white dark:from-clightgray to-transparent transition-all  p-6 rounded-2xl '>
            <div className="flex items-center gap-2 mb-4">
              <InfoIcon fill='fill-cgreen dark:fill-clime' />
              <h2 className='text-lg font-medium'>Primeros pasos</h2>
            </div>


            <p className="text-base font-medium text-slate-600 dark:text-slate-300">
              En esta sección podrás gestionar las <b>ubicaciones</b>, <b>genéticas</b>, <b>usuarios</b> y <b>eventos</b> de tu organización.
            </p>

            <p className="text-base font-medium text-slate-600 dark:text-slate-300">
              Podrás visualizar <b>tareas</b> y <b>eventos</b> al <span className='hover:opacity-50 transition-all underline underline-offset-2'><Link href={'/individuos'}>crear un individuo</Link></span>.
            </p>

          </div>
        ) :
          <EventsDataTable />
        }
        <div className="flex flex-col md:grid  md:grid-cols-2 gap-6 xl:grid-cols-3 w-full">
          <div className="md:col-span-2 xl:col-span-1">
            <OperatorsTablePage />
          </div>
          <LocationsDataTable />
          <GeneticsTablePage />
        </div>
      </div>
    </div >
  )
}
