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

export type SearchParamsProps = {
  pageNotifications?: string;
}
export type SerializedSearchParamsProps = {
  pageNotifications: number;
}

function serializeParams(params: SearchParamsProps): SerializedSearchParamsProps {
  return {
    pageNotifications: params?.pageNotifications ? Number(params?.pageNotifications?.replace(/^\D+/g, "")) : 1,
  }
}

export default async function OperatorPanel({ searchParams }: { searchParams: SearchParamsProps }) {
  const user = await currentUser()

  return (
    <main className='h-full w-full'>
      <PageHeader>


        <div className='w-full'>
          <p className='text-cblack dark:text-white text-base font-bold'>
            Body<span className='text-clime dark:text-clime font-bold'>Online</span>
          </p>
          <h1 className='title w-full'>{user?.farmName}</h1>
        </div>

      </PageHeader>

      <div className="container px-default w-full">
        <div className="grid gap-6 w-full">

          <Suspense
            key={`notifications-${searchParams?.pageNotifications ?? '1'}`}
            fallback={<Card><div className="w-full h-96 flex-center"><LoadingIcon /></div></Card>}
          >
            <NotificationsPage params={serializeParams(searchParams)} />
          </Suspense>

        </div>
      </div>
    </main>
  );
}
