"use client"
import { Radiation } from "lucide-react"
import { BrainIcon } from "@/components/icons/brain"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { setRadiologyMode  } from '@/store/features/settings/global'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'

export function ToggleRadiologyMode() {
    const isRadiologyMode = useSelector((state: RootState) => state.global.isRadiologyMode)
    const dispatch = useDispatch()
    const [mode, setMode] = useState("radiology")
  
    const toggleMode = ({mode}:{mode: string}) => {
        setMode(mode)
        dispatch(setRadiologyMode(mode === "radiology"))
        if (mode === "radiology") {
            const radiation = document.getElementById("Radiation")
            const neuroscience = document.getElementById("Neuroscience")
            if (radiation && neuroscience) {
                radiation.classList.add("scale-100", "rotate-0")
                radiation.classList.remove("scale-0", "rotate-90", "absolute")
                neuroscience.classList.add("scale-0", "rotate-90", "absolute")
                neuroscience.classList.remove("scale-100", "rotate-0")

            }
        } else {
            const radiation = document.getElementById("Radiation")
            const neuroscience = document.getElementById("Neuroscience")
            if (radiation && neuroscience) {
                radiation.classList.add("scale-0", "rotate-90", "absolute")
                radiation.classList.remove("scale-100", "rotate-0")
                neuroscience.classList.add("scale-100", "rotate-0")
                neuroscience.classList.remove("scale-0", "rotate-90", "absolute")
            }
        }
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer">
          <Radiation id="Radiation" className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
          <BrainIcon id="Neuroscience" className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleMode({mode: "radiology"})} className="hover:cursor-pointer">
          <Radiation /> Radiology
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleMode({mode: "neuroscience"})} className="hover:cursor-pointer">
          <BrainIcon /> Neuroscience 
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
