"use client"
import { Grid2x2, Rows3, Columns3 } from "lucide-react"
import { BrainIcon } from "@/components/icons/brain"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { setViewMode  } from '@/store/features/settings/global'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'

export function ChangeViewMode() {
    const viewMode = useSelector((state: RootState) => state.global.vieweMode)
    const dispatch = useDispatch()
    const [mode, setMode] = useState("multiplanar")
  
    const changeMode = ({mode}:{mode: "axial" | "sagittal" | "coronal" | "multiplanar" | "row2d"}) => {
        setMode(mode)
        dispatch(setViewMode(mode))
        
            const all = document.getElementsByClassName("viewMode")
            for (let i = 0; i < all.length; i++) {
                const element = all[i];
                element.classList.add("scale-0", "rotate-90", "absolute")
                element.classList.remove("scale-100", "rotate-0")
            }
            const axial = document.getElementById("Axial")
            const sagittal = document.getElementById("Sagittal")
            const coronal = document.getElementById("Coronal")
            const grid = document.getElementById("Multiplanar")
            const row2d = document.getElementById("Row2D")
            if (!axial || !sagittal || !coronal || !grid || !row2d) return

            if (mode === "axial") {
                axial.classList.add("scale-100", "rotate-0")
                axial.classList.remove("scale-0", "rotate-90", "absolute")
            } else if (mode === "sagittal") {
                sagittal.classList.add("scale-100", "rotate-0")
                sagittal.classList.remove("scale-0", "rotate-90", "absolute")
            } else if (mode === "coronal") {
                coronal.classList.add("scale-100", "rotate-0")
                coronal.classList.remove("scale-0", "rotate-90", "absolute")
            } else if (mode === "multiplanar") {
                grid.classList.add("scale-100", "rotate-0")
                grid.classList.remove("scale-0", "rotate-90", "absolute")
            } else if (mode === "row2d") {
                row2d.classList.add("scale-100", "rotate-0")
                row2d.classList.remove("scale-0", "rotate-90", "absolute")
            }
            
        }
    

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer">
          <span id="Axial" className="viewMode absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all">A</span>
          <span id="Sagittal" className="viewMode absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all" >S</span>
          <span id="Coronal" className="viewMode absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all" >C</span>
          <Grid2x2 id="Multiplanar" className="viewMode absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          <Columns3 id="Row2D" className="viewMode absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeMode({mode: "axial"})} className="hover:cursor-pointer">
           Axial
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeMode({mode: "sagittal"})} className="hover:cursor-pointer">
            Sagittal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeMode({mode: "coronal"})} className="hover:cursor-pointer">
            Coronal 
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeMode({mode: "multiplanar"})} className="hover:cursor-pointer">
            <Grid2x2 /> multiplanar 
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeMode({mode: "row2d"})} className="hover:cursor-pointer">
            <Columns3 /> Row 2D
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
