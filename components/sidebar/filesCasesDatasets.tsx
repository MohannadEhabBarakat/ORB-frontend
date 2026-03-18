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
import { API_BASE_URL } from "@/store/api";

export default function CollapsibleFilesCasesTree({ prefix, fileTree }: { prefix: string, fileTree: FileTreeItem[] }) {

  const BASE_URL = API_BASE_URL + "/annotations/{dataset_name}/case"
  const dataset_name = useSelector((state: RootState) => state.datasets.selectedDataset)
  const dispatch = useDispatch();

  const setSelectedVolume = (url: string | undefined) => {

    let full_url = BASE_URL.replace("{dataset_name}", dataset_name)
    full_url += "?file_path=" + url
    // alert(`Selected volume with url: ${full_url}`)

    if (!url) return;
    dispatch(setActiveVolume(full_url))
  }


  const renderItem = (fileItem: FileTreeItem) => {
    if (fileItem.items && fileItem.items.length > 0) {
      return (
        <Collapsible key={prefix + "_" + fileItem.name}>
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
            <div className="flex flex-col gap-1">
              {fileItem?.items?.map((child) => renderItem(child))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <Button
        key={prefix + "_" + fileItem.name}
        variant="link"
        size="sm"
        className="text-foreground grow justify-start gap-2"
        onDoubleClick={() => { setSelectedVolume(fileItem.url) }}
      >
        <FileIcon />
        <span>{fileItem.name}</span>
      </Button>

    );
  };

  return (
    <Card className=" w-full gap-2 max-h-full">
      <CardContent className="max-h-full">
        <ScrollArea className=" w-full h-full p-2">
          <div className="flex flex-col gap-1">
            {fileTree?.map((item) => renderItem(item))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
