
import { eventTypesList } from '@/lib/constants';
import InfoMessage from '../ui/info';

const CaliperMeasure = ({ min, max, measure, setMeasure, disabled }:
    {
        min: number;
        max: number;
        measure?: number;
        setMeasure: ({ measure, eventDetail }: { measure: number, eventDetail: string }) => void;
        disabled: boolean;
    }) => {

    if ((!min || !max) || (min >= max)) {
        return (
            <InfoMessage
                type='warning'
                title='Rango erróneo'
                subtitle={`Hubo un problema con los rangos de medida.`}
            />
        )
    }

    return (
        <div className="grid grid-cols-4 gap-2 place-items-center w-full max-w-sm mx-auto place-content-stretch min-h-[450px] max-h-[450px]">
            {eventTypesList?.[1]?.eventDetails?.map((measureObj, index) => {
                const measureValue = Number(measureObj.value);
                const selected = (measure && measureValue === Number(measure))

                const skinny = measureValue < min
                const ideal = measureValue >= min && measureValue <= max
                return (
                    <button
                        disabled={disabled}
                        className={`option_button
                                        ${skinny ? `bg-yellow-400 dark:bg-yellow-400` : ideal ? `bg-green-300 dark:bg-green-400` : `bg-orange-500 dark:bg-orange-400`}
                                        ${selected ? `ring-2 ring-csemigreen` : `opacity-50 active:opacity-100 md:hover:opacity-80`}
                                `}
                        key={index}
                        type='button'
                        onClick={() => setMeasure({ measure: Number(measureObj.value), eventDetail: skinny ? 'skinny' : ideal ? 'ideal' : 'fat' })}
                    >
                        <p className='text-2xl md:text-2xl text-center font-bold dark:text-cblack'>
                            {measureObj.label}
                        </p>
                    </button>
                )
            })}
        </div>
    )
}

export default CaliperMeasure