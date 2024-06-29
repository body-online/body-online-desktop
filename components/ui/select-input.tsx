"use client";

import { useEffect, useRef, useState } from "react";

export type SelectOptionProps = {
    label: string;
    value: string;
    subvalue?: string;
};


type SelectInputProps = {
    label: string;
    list: Array<SelectOptionProps>;
    onChange: Function;
    error?: string;
    disabled?: boolean;
    loading?: boolean;
    value?: any;
};

const SelectInput = ({
    list,
    label,
    onChange,
    value,
    error,
    disabled,
    loading,
}: SelectInputProps) => {
    const wrapperRef = useRef<any>(null);
    const [currentValue, setCurrentValue] = useState<SelectOptionProps | null>(
        null,
    );
    const [isOpen, setIsOpen] = useState(false);
    const listIsEmpty = Boolean(list.length <= 0);

    useEffect(() => {
        const selected = list.find((i) => i.value == value);
        if (selected) {
            setCurrentValue(selected);
        } else {
            setCurrentValue(null);
        }
    }, [value, list]);

    // onclick outside handler
    const handleClickListener = (event: MouseEvent) => {
        let clickedInside;

        clickedInside =
            wrapperRef?.current && wrapperRef.current.contains(event.target);

        if (clickedInside) return;
        else setIsOpen(false);
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickListener);

        return () => {
            document.removeEventListener("mousedown", handleClickListener);
        };
    }, []);

    return (
        <div ref={wrapperRef} className={`${disabled ? "opacity-50" : ""}`}>
            <label htmlFor={label}>
                <p className="input_label">{label}</p>

                {loading ? (
                    <div className="flex gap-2 items-center input">
                        <LoadingIcon />
                        <p>Buscando resultados...</p>
                    </div>
                ) : listIsEmpty ? (
                    <div className="flex gap-2 items-center input">
                        <EmptyIcon />
                        <p>No hay opciones para mostrar</p>
                    </div>
                ) : (
                    <div
                        className="relative"
                        onClick={() => (!isOpen ? setIsOpen(true) : null)}
                    >
                        <button
                            onClick={() => (isOpen && !listIsEmpty ? setIsOpen(false) : null)}
                            type="button"
                            className={`select_input ${error ? `border-red-500` : ``}`}
                        >
                            <p className="text-start">
                                {currentValue?.label ?? "Seleccione una opción"}
                            </p>

                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ArrowIcon direction={isOpen ? "up" : "down"} />
                            </span>
                        </button>

                        <ul
                            className={`z-10 bg-white dark:bg-slate-950 rounded-lg w-full  overflow-y-auto border
                        ${isOpen && !listIsEmpty ? `absolute` : `hidden`}`}
                        >
                            {list.map((i, index) => {
                                return (
                                    <li
                                        onClick={() => {
                                            if (!disabled) {
                                                onChange(i.value);
                                                setCurrentValue(i);
                                                return setIsOpen(false);
                                            }
                                        }}
                                        key={index}
                                        className="py-3 px-4 transition-all hover:bg-gray-100 cursor-pointer"
                                    >
                                        <div>{i.label}</div>
                                        {i.subvalue ? (
                                            <div className="text-xs">{i.subvalue}</div>
                                        ) : null}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                <div className="input_error">{error && <p>{error}</p>}</div>
            </label>
        </div>
    );
};

export default SelectInput;

const EmptyIcon = () => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 opacity-30"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
};
const LoadingIcon = () => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="animate-spin w-4 h-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
            </svg>
        </div>
    );
};
const ArrowIcon = ({ direction }: { direction: "up" | "down" }) => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className={`w-5 h-5 fill-black ${direction == "up" ? "rotate-180" : ""
                    }`}
            >
                <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
};
