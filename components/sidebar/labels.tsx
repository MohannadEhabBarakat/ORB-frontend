"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronUp, File, Settings } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Case from "./case"

export default function Labels() {
   const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 px-4"
    >
      <div className="flex items-center justify-start gap-4 px-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronUp  className={` transition-all  ease-in duration-200 ${isOpen ? "rotate-180" : "rotate-90"}`}/>
            <span className="sr-only">Toggle details</span>
          </Button>
        </CollapsibleTrigger>
        <h4 className="text-sm font-semibold">Labels</h4>
      </div>

    
      <CollapsibleContent className="flex flex-col gap-2">
        <ScrollArea className="h-full w-full rounded-md border">
            <Case />
            <Case />

            </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  )
}   

