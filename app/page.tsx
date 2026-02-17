import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import MainMenu from "@/components/sidebar/mainMenu";

export default function Home() {
  return (
        <ResizablePanelGroup
      orientation="horizontal"
      className="w-full h-full"
    >
      <ResizablePanel defaultSize="200px" collapsedSize="48px" minSize="48px">
        <MainMenu />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
