
import React from 'react'
import LocationsDataTable from './table'
import Card from '../ui/card'


const Locations = async () => {

    return (
        <div className="container px-default -mt-12 mb-12">
            <Card paddings=''>
                <LocationsDataTable />
                {/* :
                    <InfoMessage
                        type='warning'
                        title='Sección inaccesible'
                        subtitle='Hemos experimentado un contratiempo al obtener su listado de ubicaciones.'
                    /> */}

            </Card>
        </div>
    )
}

export default Locations