import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { setActive } from '@/store/features/sidebar/navSlice'
import type { RootState } from '@/store/store'
import { useSelector, useDispatch } from 'react-redux'

import Cases from "./cases";
import Datasets from "./datasets";
import { Button } from "../ui/button";


export default function DetailsBar() {
    const activeID = useSelector((state: RootState) => state.nav.active)

    return (
        <div className=" h-full flex flex-col items-center justify-start gap-4 py-4 grow w-full">
            {activeID}
            {activeID === "workbench" ? <Cases /> : null}
            {activeID === "datasets" ? <Datasets /> : null}


        </div>
    );
}   