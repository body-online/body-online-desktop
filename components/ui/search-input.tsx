"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import FilterInput from './filter-input';
import { useEffect, useState } from 'react';

export default function SearchInput({ paramName, disabled, placeholder }: { paramName?: string; disabled?: boolean; placeholder?: string; }) {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const [searchTerm, setSearchTerm] = useState<string>(paramName ? (params.get(paramName) ?? "") : "")
    const pathname = usePathname();
    const { push } = useRouter();


    function changeSearchParam(newSearchTerm?: string) {
        if (paramName) {
            if (newSearchTerm)
                params.set(paramName, `${newSearchTerm}`);
            else
                params.delete(paramName);

            push(`${pathname}?${params.toString()}`);
        }
    };

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            changeSearchParam(searchTerm);
        }, 300);
        return () => clearTimeout(delayInputTimeoutId);
    }, [searchTerm]);

    return (
        <FilterInput
            disabled={disabled}
            placeholder={placeholder ?? 'Buscar...'}
            value={searchTerm}
            onChange={(e: any) => { setSearchTerm(e?.target?.value); }}
        />
    );
}
