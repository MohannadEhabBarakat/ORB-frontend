import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'
import { ToggleDarkMode } from "./dark";
import { ToggleRadiologyMode } from "./radiology";
import { ChangeViewMode } from "./viewMode";
import { ToggleFullscreen } from "./fullscreen";

export default function Appearance() {
    return (
        <div className="flex justify-center items-center gap-2">
            <ChangeViewMode />
            <ToggleRadiologyMode />
            <ToggleDarkMode />
            <ToggleFullscreen />
        </div>
    );
}  