import { redirect } from 'next/navigation';

import { getCattles } from '@/data/cattle';
import { currentUser } from '@/lib/auth';

import CustomLayout from '@/components/custom-layout';
import EventTable from '@/components/event/EventTable';
import FarmForm from '@/components/farm-form';

export default async function Home() {
  const user = await currentUser()
  if (!user) return redirect("/auth/login")

  const hasAnyCattle = await getCattles({ page: 1, limit: 1 })?.then((value) => value.data?.cattles?.length)
  const onboardingCompleted = Boolean(user?.farmId && user?.farmName)

  return (
    <CustomLayout user={user}>
      {onboardingCompleted ? (
        <EventTable />
        // <div>
        //   <div className="lg:grid lg:grid-cols-3 gap-4 w-full py-default flex flex-col">
        //     <div className="lg:col-span-2 w-full">
        //       <Events />
        //     </div>
        //     <Operators />
        //   </div>

        //   <CattlesDashboard />
        // </div>
      ) : (
        <div className="h-[80vh] w-full flex-center">
          <FarmForm />
        </div>
      )}
    </CustomLayout>
  )
}
