"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { addLabel, setSelectedLabel } from "@/store/features/tools/labels";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'
import { cn } from "@/lib/utils"
import { Check, Ban } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function LabelForm({ className, setOpen }: { className?: string, setOpen: (open: boolean) => void }) {
  const [selectedColor, setSelectedColor] = useState("bg-blue-500")
  const [labelName, setLabelName] = useState("Edema");
  const labels = useSelector((state: RootState) => state.labels.labels);

  const dispatch = useDispatch();

  const maxMaskValue = labels.reduce((max, label) => Math.max(max, label.mask_value), 0);
  const [maskValue, setMaskValue] = useState(maxMaskValue + 1);


  const validateMaskValue = (value: number) => {
    if (value <= 0) {
      toast("Mask value must be greater than 0", {
        description: "Please choose a different value for the mask.",
      })
      return false;
    }
    if (labels.some(label => label.mask_value === value)) {
      toast("Mask value already exists", {
        description: "Please choose a different value for the mask. Value " + value + " is already used by label " + labels.find(label => label.mask_value === value)?.name,
      })
      return false;
    }
    return true;
  }

  const validateLabelName = (name: string) => {
    if (labels.some(label => label.name === name)) {
      toast("Label name already exists", {
        description: "Please choose a different name for the label.",
      })
      return false;
    }
    return true;
  }

  const validateColor = (color: string) => {
    if (labels.some(label => label.color === color)) {
      toast("Color already exists", {
        description: "Please choose a different color for the label. Color " + color + " is already used by label " + labels.find(label => label.color === color)?.name,
      })
      return false;
    }
    return true;
  }

  const colors = [
    // Column 1: Slate (Neutrals)
    "bg-slate-900", "bg-slate-700", "bg-slate-500", "bg-slate-300", "bg-slate-100",
    // Column 2: Blue
    "bg-blue-900", "bg-blue-700", "bg-blue-500", "bg-blue-300", "bg-blue-100",
    // Column 3: Emerald
    "bg-emerald-900", "bg-emerald-700", "bg-emerald-500", "bg-emerald-300", "bg-emerald-100",
    // Column 4: Red/Orange/Amber
    "bg-red-900", "bg-red-700", "bg-orange-500", "bg-amber-300", "bg-yellow-100",
    // Column 5: Violet
    "bg-violet-900", "bg-violet-700", "bg-violet-500", "bg-violet-300", "bg-violet-100",
  ]
  const disabledColors = ["bg-slate-00"]

  const handleSubmit = (e?: React.SubmitEvent) => {
    e?.preventDefault();

    const validName = validateLabelName(labelName)
    const validMaskValue = validateMaskValue(maskValue)
    const validColor = validateColor(selectedColor)
    // alert("isLabelNameDuplicate" + validName ? "true" : "false")
    // alert("isMaskValueDuplicate" + validMaskValue ? "true" : "false")
    if (!validName || !validMaskValue || !validColor) {
      return;
    }
    dispatch(addLabel({ name: labelName, color: selectedColor, mask_value: maskValue }));
    setOpen(false);
    dispatch(setSelectedLabel(labelName));
  }

  return (
    <form className={cn("grid items-start gap-6", className)} onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <Label htmlFor="label">Label</Label>
        <Input type="text" id="label" defaultValue="Edema" required onChange={(e) => setLabelName(e.target.value)} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="label">Mask value</Label>
        <Input type="number" id="label" defaultValue={maskValue} required onChange={(e) => setMaskValue(Number(e.target.value))} />
      </div>
      <div className="grid gap-3 w-full">
        <Label>Select Color</Label>
        <div className="w-full flex items-center justify-center">
          <RadioGroup
            defaultValue={selectedColor}
            onValueChange={setSelectedColor}
            // submit the form when double clicking a color
            onDoubleClick={() => handleSubmit(new Event("submit") as any)}
            className="grid grid-cols-4 grid-rows-5 grid-flow-col gap-2 w-fit"
          >
            {colors.map((color) => (
              <div key={color} className="flex items-center justify-center">
                <RadioGroupItem
                  value={color}
                  id={color}
                  className={cn(
                    "peer sr-only", // Hide the actual radio circle
                  )}
                  disabled={disabledColors.includes(color)}
                />
                <Label
                  htmlFor={color}
                  className={cn(
                    "h-8 w-8 rounded-full cursor-pointer flex items-center justify-center transition-all",
                    "hover:scale-110 active:scale-95 border-2 border-transparent",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                    "peer-data-[state=checked]:border-black peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary",
                    color
                  )}
                >
                  {selectedColor === color && (
                    <Check className="h-4 w-4 text-black drop-shadow-sm" />
                  )}
                  {disabledColors.includes(color) && (
                    <Ban />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  )
}
