import { CattleState } from '@/lib/types'

const ChipState = ({ state }: { state?: CattleState }) => {
    switch (state?.toLocaleLowerCase()) {
        case 'dead':
            return <p className='chip chip_red'>Muerta</p>

        case 'pregnant':
            return <p className='chip chip_violet'>Gestante</p>

        case 'maternity':
            return <p className='chip chip_rose'>Maternidad</p>

        default:
            return <p className='chip chip_gray'>Vacía</p>
    }
}

export default ChipState