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

export function DatasetsLoader() {
    const selectedDataset = useSelector((state: RootState) => state.datasets.selectedDataset)
    const status = useSelector((state: RootState) => state.datasets.status)
    const datasets = useSelector((state: RootState) => state.datasets.datasets)
    const token = useSelector((state: RootState) => state.datasets.token)

    const dispatch = useDispatch()

    const setSelectedDataset = (dataset: string) => {
        dispatch(selectDataset(dataset))
    }

    const onTokenChange = (token: string) => {
        dispatch(setToken(token))
    }

    useEffect(() => {
        if (status === "loading") setSelectedDataset("Loading...")
        else if (status === "failed") setSelectedDataset("Error")
        else setSelectedDataset("Select a dataset")
    }, [status])

    useEffect(() => {
        // @ts-ignore
        dispatch(fetchDatasets())
    }, [dispatch])

    const getAnnotator = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        // @ts-ignore
        dispatch(fetchWorklistSize({ token, selectedDataset }))
    }


    return (
        <div className=" flex flex-col gap-2 ">
            <Combobox items={datasets} onInputValueChange={(e) => setSelectedDataset(e)} disabled={status === "loading"}>
                <ComboboxInput placeholder="Select a dataset" value={selectedDataset} showClear />
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
                <Input value={token} placeholder="Token" disabled={selectedDataset === ""} onChange={(e) => onTokenChange(e.target.value)} />
                <Button variant="outline" size="icon" className="size-8" onClick={(e) => getAnnotator(e)}>
                    {'>'}
                </Button>
            </div>

        </div>
    )
}