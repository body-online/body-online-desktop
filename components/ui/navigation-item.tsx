"use client";

import Link from "next/link";
import React from "react";

import { NavigationItemProps } from '@/lib/types';


const NavigationItem = ({ title, href, selected, handleClose }: NavigationItemProps) => {
  return (
    <Link href={href} onClick={() => handleClose ? handleClose() : null}>
      <div
        className={`group menu_navigation_item`}
      >
        <p className={`${selected ? `text-black` : `lg:text-slate-400 lg:group-hover:text-black`} text-sm  transition-all`}>
          {title}
        </p>
      </div>
    </Link>
  );
};

export default NavigationItem;
