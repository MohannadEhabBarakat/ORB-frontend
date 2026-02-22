"use client";

import * as React from "react";
import { Laptop } from "lucide-react";
import { SunIcon } from "@/components/icons/sun";
import { MoonIcon } from "@/components/icons/moon";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setDarkMode } from "@/store/features/settings/global";
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'

export function ToggleDarkMode() {
  const { setTheme } = useTheme();
  const isDark = useSelector((state: RootState) => state.global.isDark)
  const dispatch = useDispatch()

  const handleSetTheme = (theme: string) => {
    setTheme(theme);
    if (theme === "system") {
      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      dispatch(setDarkMode(isSystemDark))
    } else {
      dispatch(setDarkMode(theme === "dark"))
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer">
          <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleSetTheme("light")}
          className="hover:cursor-pointer"
        >
          <SunIcon className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSetTheme("dark")}
          className="hover:cursor-pointer"
        >
          <MoonIcon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSetTheme("system")}
          className="hover:cursor-pointer"
        >
          <Laptop /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
