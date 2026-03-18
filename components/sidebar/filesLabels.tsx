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

export default function CollapsibleFilesLabelsTree({ prefix, fileTree }: { prefix: string, fileTree: FileTreeItem[] }) {
  const BASE_URL = API_BASE_URL + "/annotations/{dataset_name}/label"
  const dataset_name = useSelector((state: RootState) => state.datasets.selectedDataset)

  const dispatch = useDispatch();

  const setSelectedLabel = (url: string | undefined) => {
    let full_url = BASE_URL.replace("{dataset_name}", dataset_name)
    full_url += "?label_path=" + url
    if (!url) return;
    dispatch(setActiveLabel(full_url))
  }


  const renderLabels = (labels: FileTreeItem[] | undefined) => {
    if (!labels || labels.length === 0) return null;
    return (
      <div>
        {labels.map((label) => (
          <Button
            key={prefix + "_" + label.name}
            variant="link"
            size="xs"
            className="text-foreground grow justify-start gap-2"
            onDoubleClick={() => { setSelectedLabel(label.url) }}
          >
            <DraftingCompass />
            <span>{label.name}</span>
          </Button>
        ))}
      </div>
    );
  };
  const renderItem = (fileItem: FileTreeItem) => {
    if ((fileItem.items && fileItem.items.length > 0) || (fileItem.labels && fileItem.labels.length > 0)) {
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
            {renderLabels(fileItem.labels)}
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <div>
        {renderLabels(fileItem.labels)}
      </div>
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
