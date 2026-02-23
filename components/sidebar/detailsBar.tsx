import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";

import Cases from "./cases";
import Labels from "./labels";

export default function DetailsBar() {
    
    return (
        <div className=" h-full flex flex-col items-center justify-start gap-4 py-4 grow">
            <ResizablePanelGroup orientation="vertical" className="w-full h-full grow">
                <ResizablePanel>
                    <Cases />
                </ResizablePanel>
                <ResizablePanel>
                    <Labels />
                </ResizablePanel>
            </ResizablePanelGroup>
            
            
        </div>
    );
}   