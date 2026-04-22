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

import { LabelStatusToggle } from "./labelStatusToggle";

type WorkStatus = "not_started" | "in_progress" | "done";

export default function ActiveLabelSurvey() {
    const [isOpen, setIsOpen] = useState(false);
    const [surveySchema, setSurveySchema] = useState<any>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [labelStatus, setLabelStatus] = useState<WorkStatus>("not_started");
    const [isStatusLoading, setIsStatusLoading] = useState(false);


    const dispatch = useDispatch();
    const activeLabel = useSelector((state: RootState) => state.annotator.activeLabel);
    const selectedDataset = useSelector((state: RootState) => state.datasets.selectedDataset);
    const activeVolume = useSelector((state: RootState) => state.annotator.activeVolume);

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

    useEffect(() => {
        let mounted = true;
        // alert(activeLabel)
        if (selectedDataset && activeLabel && activeLabel.includes("label?label_path=")) {
            const label_path = activeLabel.split("label?label_path=")[1];
            if (!label_path) return;

            // Check survey submission status
            apiFetch<any>(`/datasets/${encodeURIComponent(selectedDataset)}/survey_responses?label_path=${encodeURIComponent(label_path)}`)
                .then(response => {
                    if (mounted) {
                        setIsSubmitted(!!response);
                    }
                })
                .catch(err => {
                    console.error("Failed to check if survey is submitted", err);
                });

            // Fetch label status
            setIsStatusLoading(true);
            apiFetch<any>(`/annotators/label-status?label_path=${encodeURIComponent(label_path)}`)
                .then(response => {
                    if (mounted && response?.status) {
                        setLabelStatus(response.status);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch label status", err);
                })
                .finally(() => {
                    if (mounted) setIsStatusLoading(false);
                });
        } else {
            setIsSubmitted(false);
            setLabelStatus("not_started");
        }

        return () => { mounted = false };
    }, [selectedDataset, activeLabel]);

    const handleStatusChange = (newStatus: WorkStatus) => {
        if (!activeLabel || !activeLabel.includes("label?label_path=")) return;
        const label_path = activeLabel.split("label?label_path=")[1];
        if (!label_path) return;

        setLabelStatus(newStatus);
        apiFetch(`/annotators/label-status`, {
            method: 'PATCH',
            body: JSON.stringify({
                label_path,
                status: newStatus
            })
        })
            .catch(err => {
                console.error("Failed to update label status", err);
                // Revert on error? Or just show alert
                alert("Failed to update status: " + err.message);
            });
    };

    const handleSubmit = (submission: any, formioInstance?: any) => {
        console.log("Survey submitted for active label:", activeLabel, submission);
        if (!selectedDataset || !activeLabel || !activeLabel.includes("label?label_path=")) {
            formioInstance?.emit('submitError', "No active label or dataset");
            return;
        }

        const label_path = activeLabel.split("label?label_path=")[1];
        if (!label_path) return;

        apiFetch(`/datasets/${encodeURIComponent(selectedDataset)}/survey_responses?label_path=${encodeURIComponent(label_path)}`, {
            method: 'POST',
            body: JSON.stringify(submission)
        })
            .then(() => {
                // alert("Survey response saved successfully!");
                formioInstance?.emit('submitDone');
                setIsSubmitted(true);
                // setTimeout(() => setIsOpen(false), 1000);
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
                    <h4 className="text-sm font-semibold">Status/feedback</h4>

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
                {activeLabel && activeVolume && (
                    <LabelStatusToggle
                        status={labelStatus}
                        onChange={handleStatusChange}
                        isLoading={isStatusLoading}
                    />
                )}
                {activeLabel && activeVolume && surveySchema && Object.keys(surveySchema).length > 0 ? (
                    <div style={{ backgroundColor: "white", padding: "10px", borderRadius: "8px" }} className="formio-isolated">
                        {isSubmitted ? (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <div className="text-green-600 font-semibold flex items-center gap-2">
                                    <span className="text-2xl">✓</span> Survey Submitted
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                                    Edit Submission
                                </Button>
                            </div>
                        ) : (
                            <SurveyFormWidget
                                surveySchema={surveySchema}
                                handleSubmit={handleSubmit}
                            />
                        )}
                    </div>
                ) : (
                    activeLabel ? <div className="text-sm text-center p-2 text-muted-foreground">No survey available for this dataset.</div> : <div className="text-sm text-center p-2 text-muted-foreground">Select a case & label to view survey.</div>
                )}
            </CollapsibleContent>
        </Collapsible>

    );
}
