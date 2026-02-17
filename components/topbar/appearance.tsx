"use client";
import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { setActive } from '@/store/features/sidebar/navSlice'
import type { RootState } from '@/store/store'
import { tr } from "motion/react-client";

export default function Icon({ id, IconSVG }: { id: string, IconSVG: any}) {
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
            setBorderColor("border-l-black");
        } else {
            setBorderColor("border-l-transparent");
        }

    }, [isactive]);

    const setMeActive = () => {
        setIsActive(true);
        dispatch(setActive(id))
    }

    return (
        <div className={`w-9 h-8 hover:cursor-pointer flex justify-end items-end border-l-2 border-transparent ${borderColor}`} onClick={setMeActive}>
            <IconSVG className={`${isactive ? "text-black" : "text-gray-400"}`} />
        </div>
    );
}  