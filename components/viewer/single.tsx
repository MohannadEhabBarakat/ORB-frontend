"use client";
import NiiVue from "./renderCore";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { useRef } from "react";
import { Niivue } from "@niivue/niivue";

export default function Single({
  view,
}: {
  view: "axial" | "sagittal" | "coronal" | "multiplanar";
}) {
  const activeLabel = useSelector(
    (state: RootState) => state.annotator.activeLabel,
  );
  const activeVolume = useSelector(
    (state: RootState) => state.annotator.activeVolume,
  );
  const brushColor = useSelector((state: RootState) => state.tool.color);
  const brushSize = useSelector((state: RootState) => state.tool.size);
  const activeTool = useSelector((state: RootState) => state.tool.tool);
  const nvRef = useRef<Niivue>(null);
  const dispatch = useDispatch();
  const isRadiology = useSelector((state: RootState) => state.global.isRadiologyMode);
  const show3D = useSelector((state: RootState) => state.global.show3D);
  return (
    <div className="w-full h-full flex flex-col">
      <NiiVue
        view={view}
        imageUrl={activeVolume}
        labelUrl={activeLabel}
        brushColor={brushColor}
        brushSize={brushSize}
        activeTool={activeTool}
        tool={activeTool}
        isRadiology={isRadiology}
        // nvRef={nvRef}
        show3D={show3D}
      />
    </div>
  );
}
