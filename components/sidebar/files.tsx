import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRightIcon, FileIcon, FolderIcon, DraftingCompass } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTreeItem } from "@/store/features/cases/cases";
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'
import { setActiveLabel, setActiveVolume } from "@/store/features/annotator/annotator";

export default function CollapsibleFileTree({fileTree}: {fileTree: FileTreeItem[]}) {

  const dispatch = useDispatch();

  const setSelectedLabel = (url: string|undefined) => {
    if (!url) return;
    dispatch(setActiveLabel(url))
  }
  const setSelectedVolume = (url: string|undefined) => {
    // alert(`Selected volume with url: ${url}`)
    if (!url) return;
    dispatch(setActiveVolume(url))
  }

  const renderLabels = (labels: FileTreeItem[] | undefined) => {
    if (!labels || labels.length === 0) return null;
    return (
      <>
        {labels.map((label) => (
          <Button
            key={label.name}
            variant="link"
            size="xs"
            className="text-foreground grow justify-start gap-2"
            onDoubleClick={()=>{setSelectedLabel(label.url)}}
          >
            <DraftingCompass />
            <span>{label.name}</span>
          </Button>
        ))}
      </>
    );
  };
  const renderItem = (fileItem: FileTreeItem) => {
  if ((fileItem.items && fileItem.items.length > 0) || ( fileItem.labels && fileItem.labels.length > 0)) {
      return (
        <Collapsible key={fileItem.name}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none"
            >
              <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
              <FolderIcon />
              {fileItem.name}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="style-lyra:ml-4 mt-1 ml-5">
            {renderLabels(fileItem.labels)}
            <div className="flex flex-col gap-1">
              {fileItem?.items?.map((child) => <div key={child.name}>{renderItem(child)}</div>)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <div key={fileItem.name}>
        {renderLabels(fileItem.labels)}
        <Button
          variant="link"
          size="sm"
          className="text-foreground grow justify-start gap-2"
          onDoubleClick={()=>{setSelectedVolume(fileItem.url)}}
        >
          <FileIcon />
          <span>{fileItem.name}</span>
        </Button>
      </div>
    );
  };

  return (
    <Card className=" w-full gap-2 max-h-full">
      <CardContent className="max-h-full">
        <ScrollArea className=" w-full h-full p-2">
        <div className="flex flex-col gap-1">
          {fileTree?.map((item) => <div key={item.name}>{renderItem(item)}</div>)}
        </div>
      </ScrollArea>
      </CardContent>
    </Card>
  );
}
