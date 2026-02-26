import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

import Cases from "./cases";
import { Button } from "../ui/button";


export default function DetailsBar() {
    
    return (
        <div className=" h-full flex flex-col items-center justify-start gap-4 py-4 grow">
            <Cases />
            
        </div>
    );
}   