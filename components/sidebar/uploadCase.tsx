"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const initialFrameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
]

interface CreatableComboboxTypes {
    initialOptions: { value: string; label: string }[]
    msg: string
    value: string
    setValue: (value: string) => void
}

export function CreatableCombobox({initialOptions, msg, value, setValue} : CreatableComboboxTypes) {
  const [open, setOpen] = useState(false)
  // const [value, setValue] = React.useState("")
  const [options, setOptions] = useState(initialOptions)
  const [inputValue, setInputValue] = useState("")
  const [internalValue, setInternalValue] = useState(value)

  useEffect(()=>{
    setOptions(initialOptions)
  }, [initialOptions])
  
  const handleCreate = (newLabel: string) => {
    const newValue = newLabel.toLowerCase().replace(/\s+/g, "-")
    const newOption = { value: newValue, label: newLabel }
    
    setOptions((prev) => [...(prev || []), newOption])
    setValue(newValue)
    setOpen(false)
    setInternalValue(newValue)
  }

  useEffect(() => {
    if (!options.find((opt)=>{return opt.value===value})) {
      handleCreate(value)
    }
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[70%] justify-between"
        >
          {value
            ? options?.find((opt) => opt.value === value)?.label
            : `${msg}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-150 p-0">
        <Command>
          <CommandInput 
            placeholder="Search..." 
            onValueChange={setInputValue} 
          />
          <CommandList>
            <CommandEmpty>
              <Button
                variant="ghost"
                className="w-full justify-start text-xs"
                onClick={() => handleCreate(inputValue)}
              >
                <Plus className="mr-2 h-3 w-3" />
                Create "{inputValue}"
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue:string) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setInputValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}