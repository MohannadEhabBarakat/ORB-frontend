import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import LabelForm from "./colorSelector";

import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react";


export default function AddMore() {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="hover:cursor-pointer w-full flex flex-row items-center justify-start">
            <span className={`text-sm text-muted-foreground w-3 h-3 mr-5`}><Plus /></span>
            <span className="text-sm text-muted-foreground mr-5">Add label</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add label</DialogTitle>
            <DialogDescription>
              Add a new label to the dataset
            </DialogDescription>
          </DialogHeader>
          <LabelForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="hover:cursor-pointer w-full flex flex-row items-center justify-start">
          <span className={`text-sm text-muted-foreground w-3 h-3 mr-5`}><Plus /></span>
          <span className="text-sm text-muted-foreground mr-5">Add label</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DialogHeader>
          <DialogTitle>Add label</DialogTitle>
          <DialogDescription>
            Add a new label to the dataset
          </DialogDescription>
        </DialogHeader>

        <LabelForm className="px-4" setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
