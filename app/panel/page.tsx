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
      <div className="container px-default py-default gap-6">
        <div className="flex flex-col gap-6 max-w-lg">
          <h1 className="title">
            {user?.farmName}
          </h1>
          <Suspense
            key={`notifications-${searchParams?.pageNotifications ?? '1'}`}
            fallback={<Card><div className="w-full h-96 flex-center"><LoadingIcon /></div></Card>}
          >
            <NotificationsPage params={serializeParams(searchParams)} />
          </Suspense>
        </div>
      </div>
    </main >
  );
}
