import { currentUser } from '@/lib/auth';

import OperatorsTablePage from '@/components/operator/operators-table-page';
import CattlesDashboard from '@/components/cattles/dashboard';
import GeneticsTablePage from '@/components/genetic/genetics-table-page';
import LocationsDataTable from '@/components/location/table';
import FarmForm from '@/components/farm-form';
import { redirect } from 'next/navigation';
import EventsDataTable from '@/components/event/table';


export default async function Home() {
  const user = await currentUser()

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

      <h1 className="text-2xl font-bold mb-4">
        {user?.farmName}
      </h1>

      <div className="w-full flex flex-col gap-6 overflow-hidden">
        <EventsDataTable />
        <div className="flex flex-col md:grid  md:grid-cols-2 gap-6 xl:grid-cols-3 w-full">
          <div className="md:col-span-2 xl:col-span-1">
            <OperatorsTablePage />
          </div>
          <LocationsDataTable />
          <GeneticsTablePage />
        </div>
      </div>
    </div>
  )
}
