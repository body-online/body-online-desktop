import { BodyMeasureIcon, CattleBirthIcon, DeathIcon, NotPregnantIcon, PregnantIcon } from '../ui/icons';
import ChipBodyCondition from './chip-body-condition';

type EventProps = {
    _id: string,
    caravan: string,
    eventType: string,
    eventDetail?: string;
    eventDate: string,
    farmId: string,
    measure: number,
    observations: string,
    bodyRanges: number[]
}
export default function EventItem({ event, prevEventDate }: { event: EventProps; prevEventDate?: Date }) {
    const lastEventDate = prevEventDate ? prevEventDate : undefined
    const eventDate = new Date(event.eventDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' });

    const hideEventDate = lastEventDate?.getDate() === new Date(event.eventDate)?.getDate()
    return (
        <div>
            {!hideEventDate &&
                <div className="flex gap-1 items-center w-full pt-3 pb-2">
                    <CalendarIcon />
                    <p className='text-sm sm:text-base text-slate-500'>
                        {eventDate}
                    </p>
                </div>
            }

            <div className="flex gap-1 px-1">
                {/* left */}
                <div className="w-max border-l ml-4 md:ml-5">
                    <EventTypeIcon event={event} />
                </div>

                {/* right */}
                <div className='w-full h-max'>
                    <div className="flex items-center gap-2 pb-8">
                        {/* event detail */}
                        <div className='w-full'>
                            <div className="flex items-start w-max gap-1">
                                <div className="min-w-[80px] max-w-max">
                                    {event?.measure ?
                                        // <p className='font-semibold'>Sujeto a update</p> : null
                                        <ChipBodyCondition bodyRanges={event.bodyRanges} measure={Number(event.measure)} /> : null
                                    }
                                    {event?.eventType == 'cattle_birth' ?
                                        <p className='chip chip_rose'>
                                            {event?.eventDetail} crías
                                        </p> : null
                                    }
                                    {event?.eventType != 'cattle_birth' && event?.eventDetail ?
                                        <p className={`chip ${event.eventType == 'death' ? 'chip_red' : 'chip_gray'}`}>
                                            {event?.eventDetail}
                                        </p> : null
                                    }
                                    {event?.eventType == 'pregnant' ?
                                        <p className='chip chip_violet'>
                                            Gestante
                                        </p> : null
                                    }
                                </div>

                                <div className='flex justify-between gap-2 w-full'>
                                    <p className='text-lg text-black leading-5'>
                                        {
                                            event.eventType == 'pregnant' ? 'Servicio' :
                                                event.eventType == 'not_pregnant' ? 'No preñez' :
                                                    event.eventType == 'body_measure' ? 'Medición corporal' :
                                                        event.eventType == 'cattle_birth' ? 'Parto' :
                                                            event.eventType == 'death' ? 'Muerte' : '-'
                                        }
                                    </p>

                                    <div className="flex gap-1 items-center">
                                        <ClockMiniIcon />
                                        <p className="text-sm font-medium text-black">
                                            {String(new Date(event.eventDate)?.getHours()).padStart(2, '0')}:
                                            {String(new Date(event.eventDate)?.getMinutes()).padStart(2, '0')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {event?.observations ?
                                    <>
                                        <span className="text-xs text-slate-400">Observaciones</span>
                                        <div className='w-full'>
                                            <p className='text-sm md:text-base text-slate-600 leading-6 font-normal'>{event?.observations}</p>
                                        </div>
                                    </> : null
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div >
        </div>
    )
}


const EventTypeIcon = ({ event }: { event: EventProps }) => {
    const hasMeasure = event?.measure ? Number(event?.measure) : undefined
    const fillBgColor = hasMeasure ? (hasMeasure > event?.bodyRanges[1] ? 'bg-orange-200' : hasMeasure > event?.bodyRanges[0] ? 'bg-green-200' : 'bg-yellow-200') : 'bg-slate-200'
    const fillColor = hasMeasure ? (hasMeasure > event?.bodyRanges[1] ? 'fill-orange-500' : hasMeasure > event?.bodyRanges[0] ? 'fill-green-500' : 'fill-yellow-500') : 'fill-slate-500'

    switch (event.eventType) {
        case 'death':
            return (
                <div className={`h-8 md:h-9 w-8 md:w-9 flex-center rounded-full bg-red-200 -ml-4 md:-ml-5`}>
                    <DeathIcon fill='fill-red-500' />
                </div>
            )
        case 'pregnant':
            return (
                <div className={`h-8 md:h-9 w-8 md:w-9 flex-center rounded-full bg-violet-200 -ml-4 md:-ml-5`}>
                    <PregnantIcon fill='fill-violet-500' />
                </div>
            )

        case 'not_pregnant':
            return (
                <div className={`h-8 md:h-9 w-8 md:w-9 flex-center rounded-full bg-slate-200 -ml-4 md:-ml-5`}>
                    <NotPregnantIcon stroke='stroke-slate-500' />
                </div>
            )

        case 'body_measure':
            return (
                <div className={`h-8 md:h-9 w-8 md:w-9 flex-center rounded-full ${fillBgColor} -ml-4 md:-ml-5`}>
                    <BodyMeasureIcon fill={fillColor} />
                </div>
            )

        case 'cattle_birth':
            return (
                <div className={`h-8 md:h-9 w-8 md:w-9 flex-center rounded-full bg-pink-200 -ml-4 md:-ml-5`}>
                    <CattleBirthIcon stroke='stroke-pink-500' />
                </div>
            )

        default:
            break;
    }
}
const ClockMiniIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="fill-slate-500 w-3.5 h-3.5">
                <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z" clipRule="evenodd" />
            </svg>

        </div>
    )
}
const CalendarIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="fill-slate-500 w-4 h-4">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
            </svg>
        </div>
    )
}