import { EventProps } from '@/lib/types';
import { BodyMeasureIcon, CattleBirthIcon, DeathIcon, NotPregnantIcon, PregnantIcon } from '../ui/icons';
import ChipBodyCondition from './chip-body-condition';

export default function EventItem({ event, prevEventDate }: { event: EventProps; prevEventDate?: Date }) {
    const lastEventDate = prevEventDate ? prevEventDate : undefined
    const eventDate = new Date(event.eventDate).toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' });

    const hideEventDate = lastEventDate?.getDate() === new Date(event.eventDate)?.getDate()

    return (
        <>
            {!hideEventDate &&
                <div className='w-full sticky top-0 z-10 mb-5'>
                    <div className="backdrop-blur-md rounded-lg border custom-border overflow-hidden h-max p-2 bg-slate-500/50 dark:bg-clightgray/50 w-full">
                        <div className="flex-center gap-2 h-full w-full">
                            <CalendarIcon />
                            <p className='text-sm text-slate-700 dark:text-slate-100'>
                                {eventDate}
                            </p>
                        </div>
                    </div>
                </div>
            }

            <div className={`space-y-2 mb-3 pb-3 px-2 ${!hideEventDate ? 'border-b' : ''} custom-border`}>
                <div className="flex-between gap-3 items-center">
                    <div className="flex items-center gap-3">
                        <EventTypeIcon event={event} />
                        <p className='text-lg font-semibold text-black leading-5'>
                            {
                                event.eventType == 'pregnant' ? 'Servicio' :
                                    event.eventType == 'not_pregnant' ? 'No preñez' :
                                        event.eventType == 'body_measure' ? 'Medición corporal' :
                                            event.eventType == 'cattle_birth' ? 'Parto' :
                                                event.eventType == 'death' ? 'Muerte' : '-'
                            }
                        </p>
                    </div>

                    <div className="flex gap-1 items-center px-2 py-1 rounded-full bg-slate-100 dark:bg-clightgray">
                        <ClockMiniIcon />
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {String(new Date(event.eventDate)?.getHours()).padStart(2, '0')}:
                            {String(new Date(event.eventDate)?.getMinutes()).padStart(2, '0')}
                        </p>
                    </div>
                </div>


                <div className="ml-10 md:ml-11 space-y-3">
                    {event?.measure ?
                        <div>
                            <p className="text-sm opacity-50">Medida</p>
                            <div className='w-full'>
                                <p className='text-lg text-slate-600 leading-6 font-normal'>{event?.measure}</p>
                            </div>
                        </div> : null
                    }
                    {event?.eventDetail ?
                        <div>
                            <p className="text-sm opacity-50">
                                {event?.eventType == 'cattle_birth' ? 'Número de crías' : event?.eventType == 'death' ? 'Motivo de muerte' : 'Detalle'}
                            </p>
                            <div className='w-full'>
                                <p className='text-lg text-slate-600 leading-6 font-normal'>
                                    {event?.eventDetail}
                                </p>
                            </div>
                        </div> : null
                    }
                    {event?.observations ?
                        <div>
                            <p className="text-sm opacity-50">Observaciones</p>
                            <div className='w-full'>
                                <p className='text-lg text-slate-600 leading-6 font-normal'>{event?.observations}</p>
                            </div>
                        </div> : null
                    }
                </div>

            </div>
        </>
    )
}


const EventTypeIcon = ({ event }: { event: EventProps }) => {
    if (!event?.bodyRanges?.[0] || !event?.bodyRanges?.[0]) return null

    const hasMeasure = event?.measure ? Number(event?.measure) : undefined
    const fillBgColor = hasMeasure ? (hasMeasure > event.bodyRanges?.[1] ? 'bg-orange-500 dark:bg-orange-500' : hasMeasure > event.bodyRanges?.[0] ? 'bg-green-500 dark:bg-green-500' : 'bg-yellow-500 dark:bg-yellow-500') : 'bg-slate-500 dark:bg-slate-500'
    const fillColor = hasMeasure ? (hasMeasure > event?.bodyRanges?.[1] ? 'fill-white dark:fill-white' : hasMeasure > event?.bodyRanges?.[0] ? 'fill-white dark:fill-white' : 'fill-white dark:fill-white') : 'fill-slate-500'

    switch (event.eventType) {
        case 'death':
            return (
                <div className={`h-7 md:h-8 min-w-7 md:min-w-8 flex-center rounded-full bg-red-500 dark:bg-red-500`}>
                    <DeathIcon fill='fill-white dark:fill-white' />
                </div>
            )
        case 'pregnant':
            return (
                <div className={`h-7 md:h-8 min-w-7 md:min-w-8 flex-center rounded-full bg-violet-500 dark:bg-violet-500`}>
                    <PregnantIcon fill='fill-white dark:fill-white' />
                </div>
            )

        case 'not_pregnant':
            return (
                <div className={`h-7 md:h-8 min-w-7 md:min-w-8 flex-center rounded-full bg-slate-500 dark:bg-slate-500`}>
                    <NotPregnantIcon stroke='stroke-white dark:fill-white' />
                </div>
            )

        case 'body_measure':
            return (
                <div className={`h-7 md:h-8 min-w-7 md:min-w-8 flex-center rounded-full ${fillBgColor}`}>
                    <BodyMeasureIcon fill={fillColor} />
                </div>
            )

        case 'cattle_birth':
            return (
                <div className={`h-7 md:h-8 min-w-7 md:min-w-8 flex-center rounded-full bg-pink-500 dark:bg-pink-500`}>
                    <CattleBirthIcon stroke='stroke-white dark:stroke-white' />
                </div>
            )

        default:
            break;
    }
}
const ClockMiniIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/5000/svg" viewBox="0 0 16 16" className="fill-slate-500 w-3.5 h-3.5">
                <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z" clipRule="evenodd" />
            </svg>

        </div>
    )
}
const CalendarIcon = () => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/5000/svg" viewBox="0 0 20 20" className="fill-slate-500 w-4 h-4">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
            </svg>
        </div>
    )
}