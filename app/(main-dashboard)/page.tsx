import InfoMessage from '@/components/ui/info';
import { getAllGenetics } from '@/data/genetic';
import { getAllLocations } from '@/data/location';
import { getAllCattles } from '@/data/cattle';
import { currentFarm } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Cattles from '@/components/cattle/cattles';
import Genetics from '@/components/genetic/genetics';
import Locations from '@/components/location/locations';
import DirectAccess from '@/components/ui/direct-access';
import { getPendingMeasures } from '@/data/pending-measures';


export default async function Home() {
  const farm = await currentFarm()
  if (!farm) {
    return redirect('/onboarding')
  }

  const { data: locations, error: errorLoc } = await getAllLocations()
  const { data: genetics, error: errorGen } = await getAllGenetics()
  const { data: cattles, error: errorCattle } = await getAllCattles()
  const { data: pendingMeasures, error: errorPendingMeasures } = await getPendingMeasures()

  return (
    <main>
      <div className='container pb-12 px-default space-y-8 relative mt-4'>

        {/* my organization and basic stats */}

        {errorLoc || errorGen || errorCattle || errorCattle || !cattles ?
          <div className="card">
            <InfoMessage type='warning' title='Sección inaccesible'
              subtitle='Hemos experimentado un contratiempo al obtener los recursos requeridos.'
            />
          </div>
          :
          <>
            <DirectAccess
              cattles={cattles}
              pendingMeasures={pendingMeasures}
              error={errorPendingMeasures}
            />
            <Cattles cattles={cattles} genetics={genetics} locations={locations} />
          </>
        }

        {/* genetics and locations */}
        <div className="grid lg:grid-cols-2 gap-x-3 gap-y-8">
          <Genetics genetics={genetics} error={errorGen} />
          <Locations locations={locations} error={errorLoc} />
        </div>
      </div>

    </main>
  );
}
