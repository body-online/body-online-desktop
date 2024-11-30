import React from 'react'
import { ArrowsIcon } from './icons'

type StatePaginationProps = {
    totalPages: number;
    page: number;
    changePage: (number: number) => void;
    limit?: number;
    disabled?: boolean;
    changeLimit?: (number: number) => void;
}

const StatePagination = ({ totalPages, page, changePage, limit, changeLimit, disabled }: StatePaginationProps) => {
    return (
        <div className="flex-end gap-3 w-full">

            <div className='flex-center gap-2'>
                <p className='input_instructions font-medium text-sm'>Filas</p>
                <select
                    name='page'
                    disabled={!totalPages || disabled}
                    className='table_btn_pag bg-white dark:bg-cgray !pl-1 !pr-1 !w-max'
                    value={limit}
                    onChange={({ target }) => { changePage(1); if (changeLimit) changeLimit(Number(target.value)) }}
                >
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                </select>
            </div>

            <div className="pagination">
                <button
                    className="table_btn_pag"
                    disabled={page === 1 || disabled}
                    onClick={() => changePage(1)}
                >
                    <div className="flex">
                        <ArrowsIcon direction="rotate-90 -mr-4" />
                        <ArrowsIcon direction="rotate-90" />
                    </div>
                </button>
                <button
                    className="table_btn_pag"
                    disabled={page === 1 || disabled}
                    onClick={() => changePage(page - 1)}
                >
                    <ArrowsIcon direction="rotate-90" />
                </button>

                <p className="text-sm input_instructions px-2 m-auto font-medium">{page} / {totalPages}</p>

                <button
                    className="table_btn_pag"
                    disabled={page === totalPages || totalPages === 1 || !totalPages || disabled}
                    onClick={() => changePage(page + 1)}
                >
                    <ArrowsIcon direction="-rotate-90" />
                </button>
                <button
                    className="table_btn_pag"
                    disabled={page === totalPages || totalPages === 1 || !totalPages || disabled}
                    onClick={() => changePage(totalPages)}
                >
                    <div className="flex">
                        <ArrowsIcon direction="-rotate-90 -mr-4" />
                        <ArrowsIcon direction="-rotate-90" />
                    </div>
                </button>
            </div>
        </div>
    )
}

export default StatePagination