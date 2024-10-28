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
        <div className="flex-end gap-3">
            {limit && changeLimit ? (
                <label htmlFor='rowsPerPage' className='pagination'>
                    <p className='text-sm pl-2 m-auto pointer-events-none'>Filas</p>
                    <select
                        name='rowsPerPage'
                        disabled={!totalPages || disabled}
                        className='dark:bg-cgray dark:text-white text-sm outline-0 ring-0'
                        value={limit}
                        onChange={({ target }) => { changePage(1); changeLimit(Number(target.value)) }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </label>
            ) : null
            }
            {totalPages ?
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

                    <p className="text-xs px-2 m-auto">{page} / {totalPages}</p>

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
                </div> : null
            }
        </div>
    )
}

export default StatePagination