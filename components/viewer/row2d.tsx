"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Row2D() {
  return (
    <div className="w-full h-full flex flex-col">
     
    <ResizablePanelGroup orientation="horizontal" className="w-full h-full grow">
      <ResizablePanel>
        A
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel>
        B
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel>
        c
      </ResizablePanel>

    </ResizablePanelGroup>
    </div>
  );
}
