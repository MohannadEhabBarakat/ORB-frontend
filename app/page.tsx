"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import MainMenu from "@/components/sidebar/mainMenu";
import Topbar from "@/components/topbar/topbar";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col">
      <Topbar />
    <ResizablePanelGroup orientation="horizontal" className="w-full h-full grow">
      <ResizablePanel defaultSize="300px" collapsedSize="56px" minSize="56px">
        <MainMenu />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel>
        
      </ResizablePanel>

    </ResizablePanelGroup>
    </div>
  );
}
