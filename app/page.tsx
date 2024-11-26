import { redirect } from 'next/navigation';

import { getCattles } from '@/data/cattle';
import { currentUser } from '@/lib/auth';

import OperatorsTablePage from '@/components/operator/operators-table-page';
import GeneticsTablePage from '@/components/genetic/genetics-table-page';
import LocationsDataTable from '@/components/location/table';
import EventsDataTable from '@/components/event/table';
import FarmForm from '@/components/farm-form';
import OfflinePage from '@/components/offline';
import CustomLayout from '@/components/custom-layout';

export default async function Home() {
  const user = await currentUser()
  if (!user) return redirect("/auth/login")

  const { data: cattles } = await getCattles({ page: 1, limit: 1 })
  const hasAnyCattle = Boolean(cattles?.cattles?.length)

  return (
    <CustomLayout>
      {!user?.farmId ?
        <div className="w-screen h-[calc(100vh-60px)] overflow-hidden flex-center px-default">
          <div className="-mt-12 w-full flex-center">
            <FarmForm />
          </div>
        </div>
        :
        <div className="w-full flex flex-col gap-6 overflow-hidden px-default py-default">
          {hasAnyCattle && <EventsDataTable />}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 xl:grid-cols-3 w-full">
            <div className="md:col-span-2 xl:col-span-1 w-full">
              <OperatorsTablePage />
            </div>
            <LocationsDataTable />
            <GeneticsTablePage />
          </div>
        </div >
      }
    </CustomLayout>
  )
}
