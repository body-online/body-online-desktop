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
import { LoadingIcon } from '@/components/ui/icons';
import PageHeader from '@/components/ui/header';
import { currentUser } from '@/lib/auth';
import Card from '@/components/ui/card';

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
        <div className="mb-12">
          <div className="px-3 md:px-0 pb-1 max-w-max w-full overflow-auto">
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
        </div>
      </PageHeader>

      <div className="container px-default -mt-12 mb-12 w-full">
        <div className="grid gap-6 lg:grid-cols-2 w-full">
          <div className="md:order-1">
            <Suspense
              key={`notifications-${searchParams?.pageNotifications ?? '1'}`}
              fallback={<Card headerLabel='Notificaciones'><div className="w-full h-60 flex-center"><LoadingIcon /></div></Card>}
            >
              <NotificationsPage params={serializeParams(searchParams)} />
            </Suspense>
          </div>

          <Suspense
            key={`operators-${searchParams?.pageOperators ?? '1'}`}
            fallback={<Card headerLabel='Usuarios'><div className="w-full h-60 flex-center"><LoadingIcon /></div></Card>}
          >
            <OperatorsPage params={serializeParams(searchParams)} />
          </Suspense>


        </div>
      </div>
    </div >
  );
}
