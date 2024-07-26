import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import NotificationsPage from '@/components/notifications/notifications-page';
import OperatorsCounter from '@/components/operators/operators-counter';
import LocationCounter from '@/components/location/location-counter';
import GeneticCounter from '@/components/genetic/genetic-counter';
import OperatorsPage from '@/components/operators/operators-page';
import CattleCounter from '@/components/cattle/cattle-counter';
import LoadingCounter from '@/components/ui/loading-counter';
import EventCounter from '@/components/events/event-counter';
import PageHeader from '@/components/ui/header';
import { currentUser } from '@/lib/auth';
import Card from '@/components/ui/card';
import LoadingRowsSkeleton from '@/components/ui/loading-rows-skeleton';
import CardHeader from '@/components/ui/card-header';

export type SearchParamsProps = {
  pageOperators?: string;
  pageNotifications?: string;
}
export type SerializedSearchParamsProps = {
  pageOperators?: number;
  pageNotifications: number;
}

function serializeParams(params: SearchParamsProps): SerializedSearchParamsProps {
  return {
    pageOperators: params?.pageOperators ? Number(params?.pageOperators?.replace(/^\D+/g, "")) : 1,
    pageNotifications: params?.pageNotifications ? Number(params?.pageNotifications?.replace(/^\D+/g, "")) : 1,
  }
}

export default async function Home({ searchParams }: { searchParams: SearchParamsProps }) {
  const user = await currentUser()

  if (!user?.farmId) {
    return redirect('/onboarding')
  }
  if (user?.type === 'operator') {
    return redirect('/panel')
  }

  return (
    <div className='h-full w-full'>
      <PageHeader>
        <h1 className="semititle">
          {user?.farmName}
        </h1>
        <Card paddings='py-4 md:py-6 px-0 max-w-max'>
          <div className="px-3 md:px-5 max-w-max w-full overflow-auto">
            <div className="flex items-end justify-end gap-2 w-max">
              <Suspense fallback={<LoadingCounter />}>
                <CattleCounter />
              </Suspense>

              <Suspense fallback={<LoadingCounter />}>
                <LocationCounter />
              </Suspense>

              <Suspense fallback={<LoadingCounter />}>
                <GeneticCounter />
              </Suspense>

              <Suspense fallback={<LoadingCounter />}>
                <EventCounter />
              </Suspense>

              <Suspense fallback={<LoadingCounter />}>
                <OperatorsCounter />
              </Suspense>
            </div>
          </div>
        </Card>
        <h1 className='hidden'>Inicio</h1>
      </PageHeader>


      <div className="container px-default w-full py-default space-y-6">

        <div className="grid gap-6 lg:grid-cols-2 w-full">
          <Suspense
            key={`notifications-${searchParams?.pageNotifications}`}
            fallback={<Card headerLabel='Notificaciones'><div className="w-full h-60 flex-center"><LoadingRowsSkeleton /></div></Card>}
          >
            <NotificationsPage params={serializeParams(searchParams)} />
          </Suspense>

          <Suspense
            key={`operators-${searchParams?.pageOperators}`}
            fallback={<Card headerLabel='Usuarios'><div className="w-full h-60 flex-center"><LoadingRowsSkeleton /></div></Card>}
          >
            <OperatorsPage params={serializeParams(searchParams)} />
          </Suspense>


        </div>
      </div>
    </div >
  );
}
