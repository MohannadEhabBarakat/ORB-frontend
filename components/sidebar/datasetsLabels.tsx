"use client";

import { useEffect, useState } from "react";
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
import { DatasetsLoader } from "./datasetsLoader";
import CollapsibleFilesLabelsTree from "./filesLabels";

export default function DatasetsLabels() {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [fileTree, setFileTree] = useState<any[]>([]);
    const workItem = useSelector((state: RootState) => state.datasets.workItem);
    const my_original_annotation = useSelector((state: RootState) => state.datasets.workItem?.my_original_annotation);
    const base_annotation_is_ready = useSelector((state: RootState) => state.datasets.workItem?.base_annotation_is_ready);
    const base_annotation = useSelector((state: RootState) => state.datasets.workItem?.base_annotation);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("File tree updated:", workItem?.base_annotation);
        setFileTree([workItem?.base_annotation]);
    }, [workItem]);

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
                    <h4 className="text-sm font-semibold">Labels</h4>

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

            </div>

            <CollapsibleContent className="flex  flex-col gap-2 max-h-full">
                {
                    !my_original_annotation && base_annotation_is_ready && base_annotation ?
                        <CollapsibleFilesLabelsTree prefix="base_labels" fileTree={fileTree} />
                        :
                        !my_original_annotation && (!base_annotation_is_ready || !base_annotation) ?
                            <p className="text-xs">No base annotation available</p>
                            :
                            <p className="text-xs">No annotation. You are the first annotator for this case.</p>
                }
            </CollapsibleContent>
        </Collapsible>

    );
}
