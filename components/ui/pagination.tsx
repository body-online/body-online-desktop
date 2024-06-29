"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ArrowsIcon } from './icons';


export default function Pagination({ page, paramName }: { page: number | undefined; paramName: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, `${newPage}`);
    return replace(`${pathname}?${params.toString()}`);
  };

  if (!page) return null;

  return (
    <div className="flex-end w-full">
      <div className="gap-2 mt-4 bg-white dark:bg-cgray border custom-border rounded-full p-1 w-max flex">
        <p className="text-xs px-2 m-auto">Pág. {page}</p>
        <button
          className="table_btn_pag"
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
        >
          <ArrowsIcon direction="rotate-90" />
        </button>
        <button className="table_btn_pag" onClick={() => changePage(page + 1)}>
          <ArrowsIcon direction="-rotate-90" />
        </button>
      </div>
    </div>
  );
}
