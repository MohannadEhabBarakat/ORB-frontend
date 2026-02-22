"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LabelItem from "./label"
import { useState } from "react"
import AddMore from "./addMore"
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'

export default function ColorSelect({ className }:{className?: string}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")
  const labels = useSelector((state: RootState) => state.labels.labels);

  return (
    <div className={className}>
    <Select  onOpenChange={(open)=> setIsOpen(open)} value={selectedValue} onValueChange={(value) => setSelectedValue(value)}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a label" />
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectGroup>
          {labels.map((label) => (
            <SelectItem key={label.name} value={label.name}>
              <LabelItem isOpen={isOpen} color={label.color} label={label.name}/>
            </SelectItem>
          ))}
          {/* <SelectItem value="Edema">
            <LabelItem isOpen={isOpen} color="bg-amber-500" label="Edema"/>
          </SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="s" disabled={true} >Grapes</SelectItem> */}
          <AddMore setSelectedValue={setSelectedValue} />
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>
  )
}
