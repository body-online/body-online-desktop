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

export type SearchParamsProps = {
  pageOperators?: string;
  pageNotifications?: string;
}
export type SerializedSearchParamsProps = {
  pageOperators: number;
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

  return (
    <main className='h-full'>
      <PageHeader>
        <div className="mb-12 lg:flex items-center">

          <div className='w-full mb-3'>
            <p className='text-cblack dark:text-white text-base font-bold'>
              Body<span className='text-clime dark:text-clime font-bold'>Online</span>
            </p>
            <h1 className='title w-full'>{user?.farmName}</h1>
          </div>

          <div className="w-full overflow-auto pb-2">
            <div className="flex items-center gap-3 w-max">
              <CattleCounter />
              <LocationCounter />
              <GeneticCounter />
              <EventCounter />
              <OperatorsCounter />
            </div>
          </div>

        </div>
      </PageHeader>

      <div className="container px-default -mt-12 mb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <Suspense
            key={`${JSON.stringify(searchParams)}`}
            fallback={<p>loading...</p>}
          >
            <OperatorsPage
              params={serializeParams(searchParams)}
            />
          </Suspense>
          {/* <NotificationsPage params={searchParams} /> */}
        </div>
      </div>
    </main>
  );
}
