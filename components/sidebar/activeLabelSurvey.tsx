"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiFetch } from "@/store/api";
import { Button } from "@/components/ui/button";

const SurveyFormWidget = dynamic(
  () => import("./surveyFormWidget"),
  { ssr: false, loading: () => <div className="text-sm text-center p-2 text-muted-foreground">Loading Survey...</div> }
);
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

export default function ActiveLabelSurvey() {
    const [isOpen, setIsOpen] = useState(false);
    const [surveySchema, setSurveySchema] = useState<any>(null);

    const dispatch = useDispatch();
    const activeLabel = useSelector((state: RootState) => state.annotator.activeLabel);
    const selectedDataset = useSelector((state: RootState) => state.datasets.selectedDataset);

    useEffect(() => {
        const CDN_SHEETS: { id: string; href: string }[] = [
            {
                id: "formio-bootstrap-isolated",
                href: "/formio-isolated.css",
            },
            {
                id: "formio-fa",
                href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
            },
            {
                id: "formio-css",
                href: "https://cdn.jsdelivr.net/npm/formiojs@4.21.7/dist/formio.full.min.css",
            },
        ];

        CDN_SHEETS.forEach(({ id, href }) => {
            if (!document.getElementById(id)) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.id = id;
                link.href = href;
                document.head.appendChild(link);
            }
        });

        return () => {
            CDN_SHEETS.forEach(({ id }) => {
                document.getElementById(id)?.remove();
            });
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        if (selectedDataset) {
            apiFetch<any>('/datasets/' + selectedDataset + '/survey')
                .then(schema => {
                    if (mounted) {
                        setSurveySchema(schema);
                    }
                })
                .catch(err => {
                    console.error("Failed to load survey schema", err);
                });
        }
        return () => { mounted = false };
    }, [selectedDataset]);

    const handleSubmit = (submission: any, formioInstance?: any) => {
        console.log("Survey submitted for active label:", activeLabel, submission);
        if (!selectedDataset || !activeLabel) {
            formioInstance?.emit('submitError', "No active label or dataset");
            return;
        }

        apiFetch(`/datasets/${encodeURIComponent(selectedDataset)}/survey_responses?label_name=${encodeURIComponent(activeLabel)}`, {
            method: 'POST',
            body: JSON.stringify(submission)
        })
            .then(() => {
                alert("Survey response saved successfully!");
                formioInstance?.emit('submitDone');
                setIsOpen(false);
            })
            .catch(err => {
                console.error("Failed to save survey response", err);
                formioInstance?.emit('submitError', err.message);
                alert("Failed to save survey response: " + err.message);
            });
    };

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
                    <h4 className="text-sm font-semibold">Survey</h4>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CircleQuestionMark
                                size={12}
                                className=" text-muted-foreground"
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Submit a review for active annotation</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

            </div>

            <CollapsibleContent className="flex  flex-col gap-2 max-h-full p-2">
                {activeLabel && surveySchema && Object.keys(surveySchema).length > 0 ? (
                    <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "8px" }} className="formio-isolated">
                        <SurveyFormWidget 
                            surveySchema={surveySchema} 
                            handleSubmit={handleSubmit} 
                        />
                    </div>
                ) : (
                    activeLabel ? <div className="text-sm text-center p-2 text-muted-foreground">No survey available for this dataset.</div> : <div className="text-sm text-center p-2 text-muted-foreground">Select an active label to view survey.</div>
                )}
            </CollapsibleContent>
        </Collapsible>

    );
}
