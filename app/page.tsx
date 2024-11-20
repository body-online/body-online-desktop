import { redirect } from 'next/navigation';

import { getCattles } from '@/data/cattle';
import { currentUser } from '@/lib/auth';

import FarmForm from '@/components/farm-form';
import MainDashboard from '@/components/main-dashboard';

export default async function Home() {
  const user = await currentUser()

  if (!user) return redirect("/auth/login")
  if (user?.type != 'owner') return redirect('/tareas')

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

  return (<MainDashboard hasAnyCattle={hasAnyCattle} />)
}
