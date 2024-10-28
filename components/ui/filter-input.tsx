'use client';

import React, { useEffect, useState } from 'react'
import { SearchIcon } from './icons';

const FilterInput = ({ label, instructions, placeholder, onChange, disabled }: {
    label?: string;
    instructions?: string;
    placeholder: string;
    // value: string;
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
    }, [searchTerm]);

    return (
        <label className="w-full" htmlFor={label?.replaceAll(' ', '')}>
            {label &&
                <p className="input_label">{label}</p>
            }
            {instructions &&
                <p className="input_instructions mb-3">{instructions}</p>
            }

            {/* search */}
            <div className="flex input gap-3 items-center w-full">
                <div className={`${disabled ? "opacity-50" : ""}`}>
                    <SearchIcon />
                </div>
                <input
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