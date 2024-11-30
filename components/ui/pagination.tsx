"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ArrowsIcon } from './icons';


export default function Pagination({ page, paramName, totalPages }: { page: number; paramName?: string; totalPages?: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function changePage(newPage: number) {
    if (paramName) {
      const params = new URLSearchParams(searchParams as any);
      params.set(paramName, `${newPage}`);

      return replace(`${pathname}?${params.toString()}`);
    }
  };

  if (!page) return null;

  return (
    <div className="flex-end gap-3 px-3">
      {totalPages &&
        <div className="pagination">
          <button
            className="table_btn_pag"
            disabled={page === 1}
            onClick={() => changePage(1)}
          >
            <div className="flex">
              <ArrowsIcon direction="rotate-90 -mr-4" />
              <ArrowsIcon direction="rotate-90" />
            </div>
          </button>
          <button
            className="table_btn_pag"
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
          >
            <ArrowsIcon direction="rotate-90" />
          </button>

          <p className="text-xs px-2 m-auto">{page} / {totalPages}</p>

          <button
            className="table_btn_pag"
            disabled={page === totalPages || totalPages === 1 || !totalPages}
            onClick={() => changePage(page + 1)}
          >
            <ArrowsIcon direction="-rotate-90" />
          </button>
          <button
            className="table_btn_pag"
            disabled={page === totalPages || totalPages === 1 || !totalPages}
            onClick={() => changePage(totalPages)}
          >
            <div className="flex">
              <ArrowsIcon direction="-rotate-90 -mr-4" />
              <ArrowsIcon direction="-rotate-90" />
            </div>
          </button>
        </div>

      }
    </div>
  );
}
