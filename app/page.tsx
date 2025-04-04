import { redirect } from 'next/navigation';

import { getCattles } from '@/data/cattle';
import { currentUser } from '@/lib/auth';

import CustomLayout from '@/components/custom-layout';
import EventTable from '@/components/event/EventTable';
import UserResumeCard from '@/components/user-resume';
import FarmForm from '@/components/farm-form';
export default async function Home() {
  const user = await currentUser()
  if (!user) return redirect("/auth/login")

  // const hasAnyCattle = await getCattles({ page: 1, limit: 1 })?.then((value) => value.data?.cattles?.length)
  const onboardingCompleted = Boolean(user?.farmId && user?.farmName)


  return (
    <CustomLayout user={user}>
      {onboardingCompleted ? (
        <UserResumeCard user={user} />
      ) : (
        <div className="h-[80vh] w-full flex-center">
          <FarmForm />
        </div>
      )
      }
    </CustomLayout >
  )
}
