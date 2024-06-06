import Select, { Props } from 'react-select';

import React from 'react'
import { SelectInputSearchProps } from '@/lib/types';

const SelectInputSearch = ({
    options,
    label,
    handleChange,
    darkMode,
    error,
    ...props
}: SelectInputSearchProps) => {
    return (
        <div className='w-full'>
            <p className={`${darkMode ? `text-white` : ``} input_label`}>{label}</p>

            <Select
                isDisabled={props.isDisabled}
                unstyled
                classNames={{
                    control: ({ isDisabled }: { isDisabled: boolean }) => {
                        return (`select_input_search bg-white disabled:opacity-50
                        ${isDisabled ? `opacity-50` : ``} ${error ? `border-red-500` : ``}`)
                    },
                    placeholder: () => "text-gray-500 truncate",
                    input: () => "",
                    // valueContainer: () => "",
                    singleValue: () => "",
                    // multiValue: () => "bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5",
                    // multiValueLabel: () => "leading-6 py-0.5",
                    // multiValueRemove: () => "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md",
                    indicatorsContainer: () => "",
                    // clearIndicator: () => "text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800",
                    // indicatorSeparator: () => "bg-gray-300",
                    // dropdownIndicator: () => "rounded flex-center hover:bg-slate-100 h-full",
                    menu: () => "z-10 bg-white rounded-lg w-full max-h-xl overflow-y-auto border",
                    groupHeading: () => "ml-3 mt-2 mb-1 text-gray-500 text-sm",
                    option: ({ isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) => {
                        return (`hover:cursor-pointer p-3 transition-all
                  ${isFocused ? "bg-slate-100 active:bg-gray-200" : ``} 
                  ${isSelected ? "bg-slate-100" : ``} `)
                    },
                    noOptionsMessage: () => "p-3 w-full",
                }}
                onChange={(objSelected) => handleChange(objSelected)}
                options={options}
                {...props}
            />
            <div className="input_error">{error && <p>{error}</p>}</div>
        </div>
    )
}

export default SelectInputSearch