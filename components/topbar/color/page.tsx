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
import { setSelectedLabel } from "@/store/features/tools/labels";

export default function ColorSelect({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const labels = useSelector((state: RootState) => state.labels.labels);
  const slectedLabel = useSelector((state: RootState) => state.labels.selectedLabel);

  const dispatch = useDispatch();

  const setSelectedLabel_ = (value: string) => {
    dispatch(setSelectedLabel(value));
  }

  return (
    <div className={className}>
      <Select onOpenChange={(open) => setIsOpen(open)} value={slectedLabel} onValueChange={(value) => setSelectedLabel_(value)}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select a label" />
        </SelectTrigger>

        <SelectContent position="popper">
          <SelectGroup>
            {labels.map((label) => (
              <SelectItem key={label.name} value={label.name}>
                <LabelItem isOpen={isOpen} color={label.color} label={label.name} value={label.mask_value} />
              </SelectItem>
            ))}
            {/* <SelectItem value="Edema">
            <LabelItem isOpen={isOpen} color="bg-amber-500" label="Edema"/>
          </SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="s" disabled={true} >Grapes</SelectItem> */}
            <AddMore />
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
