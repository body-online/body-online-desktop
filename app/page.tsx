import { redirect } from 'next/navigation';

import { getCattles } from '@/data/cattle';
import { currentUser } from '@/lib/auth';

import FarmForm from '@/components/farm-form';
import OnboardingCard from '@/components/onboarding-card';
import EventsDataTable from '@/components/event/table';
import OperatorsTablePage from '@/components/operator/operators-table-page';
import LocationsDataTable from '@/components/location/table';
import GeneticsTablePage from '@/components/genetic/genetics-table-page';

export default async function Home() {
  const user = await currentUser()

  if (!user) return redirect("/auth/login")

  const { data: cattles } = await getCattles({ page: 1, limit: 1 });
  const hasAnyCattle = Boolean(cattles?.cattles?.length)

  if (!user?.farmId) {
    return (
      <div className="w-screen h-[calc(100vh-60px)] overflow-hidden flex-center px-default">
        <div className="-mt-12 w-full flex-center">
          <FarmForm />
        </div>
      </div>
    )
  }

  return (
    <div className='px-default py-default'>
      <div className="w-full flex flex-col gap-6 overflow-hidden">
        <div className='space-y-2'>
          <div className="py-2">
            <p className='text-cgreen dark:text-white font-semibold title'>
              {user?.farmName}
            </p>
            <h2 className='text-sm md:text-base font-normaltext-slate-600 dark:text-slate-400'>
              Bienvenido <span className='font-medium'>{user?.name}</span>
            </h2>
          </div>


          {!hasAnyCattle ? (
            <OnboardingCard />
          ) : null}
        </div>

        {hasAnyCattle && <EventsDataTable />}
        <div className="flex flex-col md:grid  md:grid-cols-2 gap-6 xl:grid-cols-3 w-full">
          <div className="md:col-span-2 xl:col-span-1">
            <OperatorsTablePage />
          </div>
          <LocationsDataTable />
          <GeneticsTablePage />
        </div>
      </div>
    </div >)
}
