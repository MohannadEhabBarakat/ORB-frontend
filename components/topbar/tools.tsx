"use client";
import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setColor, setSize, setTool } from "@/store/features/tools/tools";
import type { RootState } from "@/store/store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pointer, Brush, Eraser, Eye, RotateCcw, Save, ArrowDownToLine } from "lucide-react";
import ColorSelect from "./color/page";
import { Slider } from "@/components/ui/slider";
import { getLabels, setOpacity } from "@/store/features/tools/labels";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { setDownloadLabel, setReset, setSave } from "@/store/features/annotator/annotator";
import { uploadMaskToBackend } from "@/components/viewer/save";

export default function Tools() {
  const activeID = useSelector((state: RootState) => state.nav.active);
  const dispatch = useDispatch();
  const defaultToolSize = useSelector((state: RootState) => state.tool.size);
  const nvRef = useSelector((state: RootState) => state.annotator.nvRef);
  const datasetName = useSelector((state: RootState) => state.datasets.selectedDataset);
  const labelUrl = useSelector((state: RootState) => state.annotator.activeLabel);
  const [toolActive, setToolActive] = useState("cursor");
  const [toolSize, setToolSize] = useState(defaultToolSize || 30);
  const [toolColor, setToolColor] = useState("black");
  const [sliderMax, setSliderMax] = useState(50);
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderStep, setSliderStep] = useState(1);
  const [lastSaved, setLastSaved] = useState<string | null>(null);


  const handleToolChange = (tool: string) => {
    if (tool === "eye") {
      setToolActive("eye");
      dispatch(setTool("cursor"));
      setSliderMax(1);
      setSliderMin(0);
      setSliderStep(0.1);
      setToolSize(0.5);
      return
    }

    setSliderMax(50);
    setSliderMin(0);
    setSliderStep(1);
    setToolSize(defaultToolSize || 30);
    setToolActive(tool);
    dispatch(setTool(tool));
  };
  const saveAll = async () => {
    if (!nvRef || !labelUrl || !datasetName) return;
    await uploadMaskToBackend(nvRef, labelUrl, datasetName)
    dispatch(setSave(true));
    setLastSaved(new Date().toLocaleTimeString());
  }
  const resetAll = () => {
    dispatch(setReset(true));
  }
  const downloadLabel = () => {
    dispatch(setDownloadLabel(true));
  }
  const handleSizeChange = (size: number) => {
    if (toolActive === "eye") {
      dispatch(setOpacity(size));
      return
    }
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
          value="eye"
          aria-label="Toggle eye"
          // onClick={() => handleToolChange("brush")}
          className="hover:cursor-pointer"
          disabled={!labelUrl}
        >
          <Eye />
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
            {toolActive === "eye" ? "Opacity" : "Size"}
          </label>
          <Slider
            defaultValue={[toolSize]}
            max={sliderMax}
            min={sliderMin}
            step={sliderStep}
            className="mx-auto w-20 max-w-xs hover:cursor-pointer"
            onValueChange={([value]) => handleSizeChange(value)}
          />
        </div>
        <ColorSelect
          className={`flex items-center space-x-4 h-full justify-center transition-all duration-300
          ${toolActive != "brush" ? "opacity-0 invisible" : "opacity-100 visible"}`}
        />
      </div>
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          value="reset"
          aria-label="Reset"
          className="hover:cursor-pointer"
          onClick={() => resetAll()}
        >
          <RotateCcw />
        </Button>

        <Button
          variant="outline"
          size="icon"
          value="save"
          aria-label="Toggle save"
          onClick={() => saveAll()}
          className="hover:cursor-pointer"
        >
          <Save />
        </Button>

        <Button
          variant="outline"
          size="icon"
          value="download"
          aria-label="Toggle download"
          onClick={downloadLabel}
          className="hover:cursor-pointer"
        >
          <ArrowDownToLine />
        </Button>
      </ButtonGroup>
      {lastSaved && (
        <span className="text-xs text-muted-foreground animate-in fade-in slide-in-from-left-1 duration-300">
          Last saved: {lastSaved}
        </span>
      )}
    </div>
  );
}
