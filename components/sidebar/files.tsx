import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRightIcon, FileIcon, FolderIcon, DraftingCompass } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type FileTreeItem = { name: string, labels?: FileTreeItem[] } | { name: string; items: FileTreeItem[], labels?: FileTreeItem[] };

export default function CollapsibleFileTree({fileTree}: {fileTree: FileTreeItem[]}) {
  // const fileTree: FileTreeItem[] = [
  //   {
  //   name: "Patient_001",
  //   items: [
  //     {
  //       name: "Study_MRI_Brain_2023-10-15",
  //       items: [
  //         {
  //           name: "Series_01_T1_Weighted",
  //           items: [
  //             { name: "volume.nii" }
  //           ],
  //         },
  //         {
  //           name: "Series_02_T2_FLAIR",
  //           items: [
  //             { name: "slice_001.dicom" },
  //             { name: "slice_002.dicom" },
  //             { name: "slice_003.dicom" },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: "Study_CT_Head_2024-01-20",
  //       items: [
  //         {
  //           name: "Series_01_Axial_NonContrast",
  //           items: [
  //             { name: "reconstruction.nii" }
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Patient_002",
  //   items: [
  //     {
  //       name: "Study_CT_Chest_2023-11-02",
  //       items: [
  //         {
  //           name: "Series_01_HighRes_Chest",
  //           items: [
  //             { name: "slice_001.dicom" },
  //             { name: "slice_002.dicom" },
  //             { name: "slice_003.dicom" },
  //             { name: "slice_004.dicom" },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: "Patient_003",
  //   items: [
  //     {
  //       name: "Study_MRI_Spine_2024-02-10",
  //       items: [
  //         {
  //           name: "Series_01_Sagittal_T2",
  //           items: [
  //             { name: "sagittal_spine.nii" }
  //           ],
  //         },
  //         {
  //           name: "Series_02_Axial_T2",
  //           items: [
  //             { name: "axial_spine.nii" }
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // ];
  
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
          >
            <DraftingCompass />
            <span>{label.name}</span>
          </Button>
        ))}
      </>
    );
  };
  const renderItem = (fileItem: FileTreeItem) => {
    if ("items" in fileItem) {
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
              {fileItem.items.map((child) => renderItem(child))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <>
        {renderLabels(fileItem.labels)}
        <Button
          key={fileItem.name}
          variant="link"
          size="sm"
          className="text-foreground grow justify-start gap-2"
        >
          <FileIcon />
          <span>{fileItem.name}</span>
        </Button>
      </>
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
