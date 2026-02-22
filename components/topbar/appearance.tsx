import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'
import { ToggleDarkMode } from "./dark";
import { ToggleRadiologyMode } from "./radiology";

export default function Appearance() {
    return (
        <div className="flex justify-center items-center gap-2">
            <ToggleRadiologyMode />
            <ToggleDarkMode />
        </div>
    );
}  