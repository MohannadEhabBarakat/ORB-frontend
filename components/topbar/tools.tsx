"use client";
import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setColor, setSize, setTool } from "@/store/features/tools/tools";
import type { RootState } from "@/store/store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pointer, Brush, Eraser } from "lucide-react";
import ColorSelect from "./color/page";
import { Slider } from "@/components/ui/slider";
import { getLabels } from "@/store/features/tools/labels";

export default function Tools() {
  const activeID = useSelector((state: RootState) => state.nav.active);
  const dispatch = useDispatch();
  const defaultToolSize = useSelector((state: RootState) => state.tool.size);
  const datasetName = useSelector((state: RootState) => state.datasets.selectedDataset);

  const [toolActive, setToolActive] = useState("cursor");
  const [toolSize, setToolSize] = useState(defaultToolSize || 30);
  const [toolColor, setToolColor] = useState("black");

  const handleToolChange = (tool: string) => {
    setToolActive(tool);
    dispatch(setTool(tool));
  };

  const handleSizeChange = (size: number) => {
    setToolSize(size);
    dispatch(setSize(size));
  }

  useEffect(() => {
    if (datasetName) {
      // @ts-ignore
      dispatch(getLabels({ datasetName }));
    }
  }, [datasetName]);

  return (
    <div className="flex items-center space-x-4">
      <ToggleGroup variant="outline" type="single" defaultValue="cursor" onValueChange={(value) => { if (value) handleToolChange(value); }}>
        <ToggleGroupItem
          value="cursor"
          aria-label="Toggle cursor"
          // onClick={() => handleToolChange("cursor")}
          className="hover:cursor-pointer "
        >
          <Pointer />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="brush"
          aria-label="Toggle brush"
          // onClick={() => handleToolChange("brush")}
          className="hover:cursor-pointer"
        >
          <Brush />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="eraser"
          aria-label="Toggle eraser"
          // onClick={() => handleToolChange("eraser")}
          className="hover:cursor-pointer"
        >
          <Eraser />
        </ToggleGroupItem>
      </ToggleGroup>

      <div
        className={`flex items-center space-x-4 h-full justify-center transition-all duration-400 ease-in
          ${toolActive === "cursor" ? "max-w-0 opacity-0" : "max-w-xs opacity-100"} overflow-hidden`}>
        <div className="flex items-center space-x-2 h-full justify-center">
          <label
            htmlFor="size"
            className="block text-sm font-medium text-muted-foreground"
          >
            Size
          </label>
          <Slider
            defaultValue={[toolSize]}
            max={50}
            step={1}
            className="mx-auto w-20 max-w-xs hover:cursor-pointer"
            onValueChange={([value]) => handleSizeChange(value)}
          />
        </div>
        <ColorSelect
          className={`flex items-center space-x-4 h-full justify-center transition-all duration-300
          ${toolActive != "brush" ? "opacity-0 invisible" : "opacity-100 visible"}`}
        />
      </div>
    </div>
  );
}
