import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxList,
    ComboboxItem
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from 'react-redux'
import { selectDataset, setToken, fetchDatasets, fetchWorklistSize } from '@/store/features/datasets/datasets'
import type { RootState } from '@/store/store'
import { useEffect } from "react"
import { clearLocalLabels } from "@/store/features/tools/labels"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { setActiveLabel, setActiveVolume } from "@/store/features/annotator/annotator"

export function DatasetsLoader() {
    const selectedDataset = useSelector((state: RootState) => state.datasets.selectedDataset)
    const status = useSelector((state: RootState) => state.datasets.status)
    const datasets = useSelector((state: RootState) => state.datasets.datasets)
    const token = useSelector((state: RootState) => state.datasets.token)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const setSelectedDataset = (dataset: string) => {
        dispatch(selectDataset(dataset))
    }

    const onTokenChange = (token: string) => {
        dispatch(setToken(token))
    }

    // Removed the useEffect that pollutes selectedDataset with UI placeholder strings.

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchDatasets())
    }, [dispatch])

    const getAnnotator = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setLoading(true)
        dispatch(setActiveLabel(""))
        dispatch(setActiveVolume(""))
        dispatch(clearLocalLabels())
        // @ts-ignore
        dispatch(fetchWorklistSize({ token, selectedDataset })).unwrap().then(() => {
            setLoading(false)
        })
    }


    return (
        <div className=" flex flex-col gap-2 ">
            <Combobox items={datasets} onInputValueChange={(e) => setSelectedDataset(e)} disabled={status === "loading"}>
                <ComboboxInput placeholder={
                    status === "loading" ? "Loading..." :
                        status === "failed" ? "Error" :
                            "Select a dataset"
                } value={selectedDataset} showClear />
                <ComboboxContent >
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList >
                        {(item) => (
                            <ComboboxItem key={item} value={item}>
                                {item}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>

            <div className=" flex flex-row gap-2 justify-center items-center">
                {loading ? <Loader2 className="animate-spin" /> :
                    <>
                        <Input value={token} placeholder="Token" disabled={selectedDataset === ""} onChange={(e) => onTokenChange(e.target.value)} />
                        <Button variant="outline" size="icon" className="size-8" onClick={(e) => getAnnotator(e)}>
                            {'>'}
                        </Button>
                    </>}
            </div>

        </div>
    )
}