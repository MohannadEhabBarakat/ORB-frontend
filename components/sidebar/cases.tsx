"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronUp, Upload, CircleQuestionMark } from "lucide-react";
import CollapsibleFileTree from "./files";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddCase from "./addCase";
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'

export default function Cases() {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const fileTree = useSelector((state: RootState) => state.cases.fileTree);
  const dispatch = useDispatch();

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 px-4 max-h-[90%]"
    >
      <div className="w-full flex justify-between items-center">
        <div
          className="flex items-center justify-start gap-4 px-4 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronUp
                className={` transition-all  ease-in duration-200 ${isOpen ? "rotate-180" : "rotate-90"}`}
              />
              <span className="sr-only">Toggle details</span>
            </Button>
          </CollapsibleTrigger>
          <h4 className="text-sm font-semibold">Cases</h4>

          <Tooltip>
            <TooltipTrigger asChild>
              <CircleQuestionMark
                size={12}
                className=" text-muted-foreground"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Double click on any file to show, right click to edit</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-auto hover:cursor-pointer flex flex-row items-center justify-start"
            >
              <Upload size={16} className=" text-muted-foreground" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-200 ">
            <DialogHeader>
              <DialogTitle>Add label</DialogTitle>
              <DialogDescription>
                Add a new label to the dataset
              </DialogDescription>
            </DialogHeader>
            <AddCase setOpen={setUploadOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <CollapsibleContent className="flex  flex-col gap-2 max-h-full">
        <CollapsibleFileTree fileTree={fileTree} />
      </CollapsibleContent>
    </Collapsible>
  );
}
