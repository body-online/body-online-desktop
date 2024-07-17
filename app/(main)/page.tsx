import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';

import PageHeader from '@/components/ui/header';
import CattleCounter from '@/components/cattle/cattle-counter';
import LocationCounter from '@/components/location/location-counter';
import GeneticCounter from '@/components/genetic/genetic-counter';
import EventCounter from '@/components/events/event-counter';
import OperatorsCounter from '@/components/operators/operators-counter';
import OperatorsPage from '@/components/operators/operators-page';
import { Suspense } from 'react';
import NotificationsPage from '@/components/notifications/notifications-page';
import LoadingCounter from '@/components/ui/loading-counter';
import Card from '@/components/ui/card';
import { LoadingIcon } from '@/components/ui/icons';
import Script from 'next/script';

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
        <div className="mb-12 lg:flex items-center">
          <div className='w-full mb-3 md:mb-0'>
            <p className='text-cblack dark:text-white text-base font-bold'>
              Body<span className='text-clime dark:text-clime font-bold'>Online</span>
            </p>
            <h1 className='title w-full'>{user?.farmName}</h1>
          </div>

          <div className="card px-3 py-4 border custom-border max-w-max w-full overflow-auto">
            <div className="ml-auto flex items-end justify-end gap-2 w-max">

              <Suspense fallback={<LoadingCounter />}
              >
                <CattleCounter />
              </Suspense>

              <Suspense fallback={<LoadingCounter />}
              >
                <LocationCounter />
              </Suspense>

              <Suspense fallback={<LoadingCounter />}
              >
                <GeneticCounter />
              </Suspense>

              <Suspense fallback={<LoadingCounter />}
              >
                <EventCounter />
              </Suspense>

              <Suspense fallback={<LoadingCounter />}
              >
                <OperatorsCounter />
              </Suspense>
            </div>
          </div>

        </div>
      </PageHeader>

      <div className="container px-default -mt-12 mb-12 w-full">
        <div className="grid gap-6 lg:grid-cols-2 w-full">

          <Suspense
            key={`notifications-${searchParams?.pageNotifications ?? '1'}`}
            fallback={<Card><div className="w-full h-96 flex-center"><LoadingIcon /></div></Card>}
          >
            <NotificationsPage params={serializeParams(searchParams)} />
          </Suspense>

          <Suspense
            key={`operators-${searchParams?.pageOperators ?? '1'}`}
            fallback={<Card><div className="w-full h-96 flex-center"><LoadingIcon /></div></Card>}
          >
            <OperatorsPage params={serializeParams(searchParams)} />
          </Suspense>

        </div>
      </div>
    </div >
  );
}
