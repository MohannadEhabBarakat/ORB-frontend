"use client";
import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setActive } from '@/store/features/sidebar/navSlice'
import type { RootState } from '@/store/store'
import { tr } from "motion/react-client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Icon({ id, IconSVG, description }: { id: string, IconSVG: any, description: string}) {
    const activeID = useSelector((state: RootState) => state.nav.active)
    const dispatch = useDispatch()

    const [isactive, setIsActive] = useState(false);
    const [borderColor, setBorderColor] = useState("transparent");

    useEffect(() => {
        if (activeID === id) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [activeID]);

    useEffect(() => {
        if (isactive) {
            setBorderColor("border-l-sidebar-primary-foreground");
        } else {
            setBorderColor("border-l-transparent");
        }

    }, [isactive]);

    const setMeActive = () => {
        setIsActive(true);
        dispatch(setActive(id))
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
            <div className={`w-9 h-8 hover:cursor-pointer flex justify-center items-center border-l-2 border-transparent ${borderColor}`} onClick={setMeActive}>
                <IconSVG size={24} className={`${isactive ? "text-sidebar-primary-foreground" : "text-sidebar-ring"}`} />
            </div>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>{description}</p>
            </TooltipContent>
        </Tooltip>
    );
}  