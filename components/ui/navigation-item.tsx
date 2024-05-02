"use client";

import Link from "next/link";
import React from "react";

import { NavigationItemProps } from '@/lib/types';


const NavigationItem = ({ title, href, selected, handleClose }: NavigationItemProps) => {
  return (
    <Link href={href} onClick={() => handleClose ? handleClose() : null}>
      <span
        className={`group h-full lg:border-b ${selected ? `border-gray-700` : `border-transparent`
          } transition-all flex items-center px-4 md:py-2 active:bg-slate-100 lg:active:bg-transparent lg:p-0`}
      >
        <p
          className={`${selected
            ? `text-black font-semibold`
            : `lg:text-slate-400 lg:group-hover:text-black`
            } 
                        px-1.5 py-2 text-sm
                        lg:group-hover:bg-slate-100
                        transition-all rounded-lg`}
        >
          {title}
        </p>
      </span>
    </Link>
  );
};

export default NavigationItem;
