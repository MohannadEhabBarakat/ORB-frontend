"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'
import { DatasetsLoader } from "./datasetsLoader";
import DatasetsCases from "./datasetsCases";
import DatasetsLabels from "./datasetsLabels";
import DatasetsPagination from "./datsetsPagination";
import DatasetsMyLabels from "./datasetsMyLabels";
import ActiveLabelSurvey from "./activeLabelSurvey";

export default function Datasets() {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const fileTree = useSelector((state: RootState) => state.cases.fileTree);
    const dispatch = useDispatch();


    return (

        <div className="flex flex-col w-full p-10 h-full justify-between gap-2 overflow-x-hidden">
            <div className=" grow-0"><DatasetsLoader /></div>

            <div className="flex flex-col grow">
                <DatasetsCases />
                <DatasetsLabels />
                <DatasetsMyLabels />
                <ActiveLabelSurvey />
            </div>
            <div className=" grow-0"><DatasetsPagination /></div>
        </div>
    );
}
