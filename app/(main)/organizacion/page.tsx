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
import Navbar from '@/components/ui/navbar';


export default async function Organization() {
    const farm = await currentFarm()

    if (!farm) {
        return redirect('/onboarding')
    }

    const { data: dataLoc, error: errorLoc } = await getAllLocations()
    const { data: genetics, error: errorGen } = await getAllGenetics()
    const { data: cattles, error: errorCattle } = await getAllCattles()

    return (
        <main>

            {/* <Cattles cattles={cattles} genetics={genetics} locations={locations} /> */}
            <div className="grid lg:grid-cols-2 gap-x-3 gap-y-8">
                <Genetics genetics={genetics} error={errorGen} />
                <Locations dataLoc={dataLoc} error={errorLoc} />
            </div>
        </main>)
}