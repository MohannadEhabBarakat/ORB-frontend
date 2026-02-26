import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { useEffect, useRef, ChangeEvent } from "react";
import { Label } from "@/components/ui/label"
import Cases from "./cases";
import { Button } from "../ui/button";
import { CreatableCombobox } from "./uploadCase";
import { use, useState } from "react";
import { Dices } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'
import { FileTreeItem, selectAllPatients, 
    selectPatientStudies, selectAllSeries,
    addFile, addLabel } from '@/store/features/cases/cases';
import { Input } from "../ui/input";

export default function AddCase({ setOpen }:{ setOpen: (open: boolean) => void }) {
    const [patient, setPatient] = useState("")
    const [study, setStudy] = useState("")
    const [series, setSeries] = useState("")
    const [isLabel, setIsLabel] = useState("")
    const fileRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | undefined>(undefined)
    
    const fileTree = useSelector((state: RootState) => state.cases.fileTree);
    const dispatch = useDispatch();

    const patientsList = useSelector((state: RootState) => selectAllPatients(state));
    const [ patientsListInitialOptions, setPatientsListInitialOptions] = useState<{ value: string, label: string }[]>([])
    
    const studiesList = useSelector((state:RootState) => selectPatientStudies(state, patient));
    const [ studiesListInitialOptions, setStudiesListInitialOptions] = useState<{ value: string, label: string }[]>([])

    const seriesList = useSelector((state:RootState) => selectAllSeries(state, patient, study));
    const [ seriesListInitialOptions, setSeriesListInitialOptions] = useState<{ value: string, label: string }[]>([])


    const mapper = (lst:FileTreeItem[])=>{
        const res = lst.map((patient) => ({ value: patient.name, label: patient.name }))
        return res
    }

    useEffect(() => {
        const options = mapper(patientsList)
        setPatientsListInitialOptions(options)
    }, [patientsList])

    useEffect(()=>{
        setStudy("")
        const options = mapper(studiesList)
        setStudiesListInitialOptions(options)
    }, [patient])

    useEffect(()=>{
        setSeries("")
        const options = mapper(seriesList)
        setSeriesListInitialOptions(options)
    }, [study])
    



    const random = (prefix:string) => {
        const randomNum = Math.floor(Math.random() * 1000);
        return `${prefix}_${randomNum}`;
    }

    const upload = ()=>{
        // console.log(isLabel)
        let patient_ = patient
        let study_ = study
        let series_ = series

        if (!patient_ && !study_ && !series_){
            patient_ = random("random_patient")
            study_ = random("random_study")
            series_ = random("random_series")
            setPatient(patient_)
            setStudy(study_)
            setSeries(series_)
        }
        else if ((!patient_ || !study_ || !series_) && !isLabel){alert("Please select patient, study and series or upload label")}
        if (!file) {alert("Please select a file to upload"); return}

        // Create a local URL for the file
        const fileName = file.name
        const url = URL.createObjectURL(file)
        console.log({patient_, study_, series_, fileName, url, isLabel})

        if(isLabel){
            dispatch(addLabel({ patientName: patient_, studyName: study_, seriesName: series_, fileName, url, exists_ok:true }))
        }
        else{
            dispatch(addFile({ patientName: patient_, studyName: study_, seriesName: series_, fileName, url, exists_ok:true }))
        }

        setOpen(false)

    }
    return (
        <div className=" h-full flex flex-col items-center justify-start gap-4 py-4 grow">
            <div className="w-full flex gap-2 items-center justify-start">
                <h5 className="text-sm font-semibold">Select patient</h5>
                <CreatableCombobox initialOptions={patientsListInitialOptions} msg="Patient name" value={patient} setValue={setPatient} />

                <Button variant="outline" size="sm" className="ml-auto" onClick={()=>setPatient(random("random_patient"))}>
                    <Dices />
                </Button>
            </div>

            <div className="w-full flex gap-2 items-center justify-start">
                <h5 className="text-sm font-semibold">Select study</h5>
                <CreatableCombobox initialOptions={studiesListInitialOptions} msg="Study name" value={study} setValue={setStudy} />

                <Button variant="outline" size="sm" className="ml-auto" onClick={()=>setStudy(random("random_study"))}>
                    <Dices />
                </Button>
            </div>

            <div className="w-full flex gap-2 items-center justify-start">
                <h5 className="text-sm font-semibold">Select series</h5>
                <CreatableCombobox initialOptions={seriesListInitialOptions} msg="Series name" value={series} setValue={setSeries} />

                <Button variant="outline" size="sm" className="ml-auto" onClick={()=>setSeries(random("random_series"))}>
                    <Dices />
                </Button>
            </div>
            <div className=" flex justify-start items-center w-full gap-2">
                <Label htmlFor="isLabel">Is label?</Label>
                <Input type="checkbox" id="isLabel" className="w-4" onChange={(e)=>setIsLabel(isLabel?"":e.target.value)} value={"true"}/>
            </div>
            <div className=" flex justify-start items-center w-full gap-2">
                <Label htmlFor="file">Upload file</Label>
                <Input type="file" accept=".nii,.nii.gz,.dcm,.dicom" id="file" className="max-w-[70%]" ref={fileRef} onChange={(e:ChangeEvent<HTMLInputElement>)=>setFile(e.target.files?.[0])} />
            </div>

            <Button className="bg-red-900 hover:bg-red-500 text-white font-bold" onClick={upload}>upload</Button>
            
        </div>
    );
}   