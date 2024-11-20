'use client';

import React, { useEffect, useState } from 'react'
import { SearchIcon } from './icons';

const FilterInput = ({ label, instructions, placeholder, onChange, disabled, key }: {
    label?: string;
    instructions?: string;
    placeholder: string;
    key?: string;
    disabled?: boolean;
    onChange: (e: any) => void
}) => {
    const [searchTerm, setSearchTerm] = useState<string>('')

    useEffect(() => {
        const delayInputTimeoutId =
            setTimeout(() => {
                onChange(searchTerm)
            }, 300);
        return () => clearTimeout(delayInputTimeoutId);
    }, [searchTerm, onChange]);

    return (
        <label className="w-full" htmlFor={label?.replaceAll(' ', '')} key={key}>
            {label &&
                <p className="input_label">{label}</p>
            }
            {instructions &&
                <p className="input_instructions mb-3">{instructions}</p>
            }

            {/* search */}
            <div className="flex input gap-3 items-center w-full md:max-w-sm">
                <div className={`${disabled ? "opacity-50" : ""}`}>
                    <SearchIcon />
                </div>
                <input
                    key={`${placeholder}.${label}`}
                    disabled={disabled}
                    className={`bg-transparent border-0 focus:ring-0 outline-0 focus:outline-0`}
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm ?? ''}
                    onChange={(e) => { return setSearchTerm(e?.target?.value ?? '') }}
                />
            </div>
        </label>
    )
}

export default FilterInput