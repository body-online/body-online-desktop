import InfoMessage from '@/components/ui/info';
import { getAllGenetics } from '@/data/genetic';
import { getAllLocations } from '@/data/location';
import { getAllCattles } from '@/data/cattle';
import { currentFarm, currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Cattles from '@/components/cattle/cattles';
import Genetics from '@/components/genetic/genetics';
import Locations from '@/components/location/locations';


export default async function Home() {
  const { data: locations, error: errorLoc } = await getAllLocations()
  const { data: genetics, error: errorGen } = await getAllGenetics()
  const { data: cattles, error: errorCattle } = await getAllCattles()
  const user = await currentUser()
  const farm = await currentFarm()

  if (!farm) {
    redirect('/onboarding')
  }

  return (
    <main>
      <div className='container pb-12 px-default space-y-8 relative'>
        {/* Accesos directos */}
        <div className="card">
          <div className="px-4 md:px-5 py-5 md:py-6">
            <h3 className="semititle">
              Accesos directos
            </h3>
          </div>
        </div>

        {/* Mi plantel */}
        {errorLoc || errorGen || errorCattle || errorCattle ?
          <InfoMessage type='warning' title='Sección inaccesible'
            subtitle='Hemos experimentado un contratiempo al obtener los recursos requeridos.'
          /> :
          <Cattles cattles={cattles} genetics={genetics} locations={locations} />
        }

        {/* Genéticas y Ubicaciones */}
        <div className="grid lg:grid-cols-2 gap-x-3 gap-y-8">
          <Genetics genetics={genetics} error={errorGen} />
          <Locations locations={locations} error={errorLoc} />
        </div>
      </div>

    </main>
  );
}
