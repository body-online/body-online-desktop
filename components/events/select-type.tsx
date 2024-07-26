import React from 'react'
import { BodyMeasureIcon, CattleBirthIcon, DeathIcon, NotPregnantIcon, PregnantIcon } from '../ui/icons';
import { eventTypesList } from '@/lib/constants';
import { CattleProps, EventSchema } from '@/lib/types';
import { UseFormSetValue, UseFormUnregister, UseFormWatch } from 'react-hook-form';
import OptionSelector from '../ui/option-selector';

const SelectEventType = ({ selectedCattle, isSubmitting, watch, unregister, setValue }:
    {
        selectedCattle: CattleProps;
        isSubmitting?: boolean;
        unregister: UseFormUnregister<EventSchema>;
        watch: UseFormWatch<EventSchema>;
        setValue: UseFormSetValue<EventSchema>;
    }
) => {


    const eventTypes = eventTypesList.map((eventType) => {
        const cattleState = !selectedCattle?.state ? 'not_pregnant' : selectedCattle?.state;
        const eventAllowedByState = eventType.allowedStates.includes(cattleState)
        const hasNoEventsYet = !selectedCattle?.bodyConditionDate && !selectedCattle?.stateDate && eventType.value === 'body_measure';

        const isDisabled = !eventAllowedByState || isSubmitting || hasNoEventsYet

        return { ...eventType, disabled: isDisabled }
    })
    return (
        <div>
            <label htmlFor="eventType">
                <h3 className="semititle mb-3">Tipo de evento</h3>
                <OptionSelector
                    value={watch('eventType')}
                    options={eventTypes}
                    setValue={(e: EventSchema['eventType']) => { setValue('eventType', e); unregister('eventDetail'); unregister('measure') }}
                />
                {/* old but better version */}
                {/* <div className="w-full space-y-2">
                    {eventTypesList.map((event, index) => {
                        const cattleState = !selectedCattle?.state ? 'not_pregnant' : selectedCattle?.state;
                        const cattleCondition = selectedCattle?.bodyCondition ?? 'not_pregnant';

                        const eventAllowedByState = event.allowedStates.includes(cattleState)
                        const hasNoEventsYet = !selectedCattle?.bodyConditionDate && !selectedCattle?.stateDate && event.value === 'body_measure';

                        const isDisabled = !eventAllowedByState || isSubmitting || hasNoEventsYet
                        const selected = Boolean(watch('eventType') == event.value);
                        const fillIcon = selected ? `fill-csemigreen dark:fill-clime` : `fill-slate-400 dark:fill-slate-500`
                        const strokeIcon = selected ? `stroke-csemigreen dark:stroke-clime` : `stroke-slate-400 dark:stroke-slate-500`
                        const buttonStyles = selected ? `dark:border-clime border-caqua border` : ``

                        return (
                            <button
                                key={index}
                                type='button'
                                disabled={isDisabled}
                                className={`option_button disabled:opacity-50 ${buttonStyles}`}
                                onClick={() => {
                                    return setValue('eventType', event.value)
                                }}
                            >
                                <div className='flex items-center gap-2'>
                                    <div>
                                        {event.value == 'body_measure' ?
                                            <BodyMeasureIcon sizes="h-6 w-6" fill={fillIcon} /> :
                                            event.value == 'pregnant' ?
                                                <PregnantIcon sizes="h-6 w-6" fill={fillIcon} /> :
                                                event.value == 'not_pregnant' ?
                                                    <NotPregnantIcon sizes="h-6 w-6" stroke={strokeIcon} /> :
                                                    event.value == 'cattle_birth' ?
                                                        <CattleBirthIcon sizes="h-6 w-6" stroke={strokeIcon} /> :
                                                        event.value == 'death' ?
                                                            <DeathIcon sizes="h-6 w-6" fill={fillIcon} /> :
                                                            null
                                        }

                                    </div>
                                    <p className={`text-start leading-3 text-base font-medium ${selected ? `text-black dark:text-white` : `text-slate-600`}`}>
                                        {event?.label}
                                    </p>
                                </div>

                            </button>
                        )

                    })}
                </div> */}
            </label>
        </div>
    )
}

export default SelectEventType