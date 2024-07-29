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
import CreateCattle from '@/components/cattle/create-cattle';
import AddEventBtn from '@/components/cattle/add-event';
import AddGeneticBtn from '@/components/genetic/add-genetic';
import AddLocationBtn from '@/components/location/add-location';
import CreateOperator from '@/components/operators/create-operator';

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
      <div className="container px-default py-default flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-6 max-w-lg">
          <h1 className="title">
            {user?.farmName}
          </h1>

          <Card paddings='py-4 md:py-6 px-0'>
            <div className="px-3 md:px-5 w-full overflow-auto">
              <div className="flex items-end justify-evenly gap-2 w-max mx-auto">
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


          <div className="px-3 md:px-5 py-2 flex flex-wrap justify-center gap-4 w-full ">
            <AddGeneticBtn />
            <AddLocationBtn />
            <CreateCattle />
            <AddEventBtn />
            <CreateOperator />
          </div>



          <Suspense key={`notifications-${searchParams?.pageNotifications}`} fallback={
            <Card headerLabel='Mediciones pendientes'>
              <div className="w-full h-60 flex-start overflow-y-hidden pt-4">
                <LoadingRowsSkeleton />
              </div>
            </Card>}
          >
            <NotificationsPage params={serializeParams(searchParams)} />
          </Suspense>

          <Suspense
            key={`operators-${searchParams?.pageOperators}`}
            fallback={
              <Card headerLabel='Usuarios'>
                <div className="w-full h-60 flex-center pt-4">
                  <LoadingRowsSkeleton />
                </div>
              </Card>
            }
          >
            <OperatorsPage params={serializeParams(searchParams)} />
          </Suspense>
        </div>

        <div className='w-full'>
        </div>
      </div>
    </div >
  );
}
