import { useRef, useEffect, useState, Touch, TouchEvent } from "react";
import { Niivue } from "@niivue/niivue";
import { a } from "motion/react-client";
import { color } from "motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { tailwindClassToRgb } from "./colorsConverter";

interface NiiVueProps {
  imageUrl: string | null;
  labelUrl?: string | null;
  view: "axial" | "sagittal" | "coronal" | "3D" | "multiplanar";
  brushColor: string | undefined;
  brushSize: number | undefined;
  activeTool: string;
  tool: string;
  isRadiology: boolean;
  nvRef: React.RefObject<Niivue | null>;
  show3D: boolean;
}

export default function NiiVue({ imageUrl, labelUrl, view, brushColor = "red", brushSize = 3, activeTool, isRadiology, nvRef, show3D }: NiiVueProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  //   const nvRef = useRef<any>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const crosshairWidth = 0.5
  const mousePosRef = useRef({ x: 0, y: 0 });
  const labels = useSelector((state: RootState) => state.labels.labels);
  const datasetName = useSelector((state: RootState) => state.datasets.selectedDataset);
  const selectedColorName = useSelector((state: RootState) => state.labels.selectedLabel);

  useEffect(() => {
    if (selectedColorName) {
      const selectedColor = labels.find((label) => label.name === selectedColorName)?.mask_value;
      if (!selectedColor) return;
      nvRef?.current?.setPenValue(selectedColor);
    }
  }, [selectedColorName])

  const updateColormap = () => {

    if (!nvRef.current) return;

    const colours = labels.map((label) => tailwindClassToRgb(label.color))
    const red = [0, ...colours.map((colour) => colour?.[0])]
    const green = [0, ...colours.map((colour) => colour?.[1])]
    const blue = [0, ...colours.map((colour) => colour?.[2])]
    // const opacity = labels.map((label) => 1)
    const labelValues = [0, ...labels.map((label) => label.mask_value)]
    const names = ["Background", ...labels.map((label) => label.name)]


    const cmap = {
      R: red,
      G: green,
      B: blue,
      I: labelValues,
      labels: names
    }
    // @ts-ignore
    nvRef.current.setDrawColormap(cmap);
  }

  useEffect(() => {
    console.log("nvRef", nvRef.current?.volumes);
  }, [labels, imageUrl, labelUrl])

  useEffect(() => {
    console.log("labels", labels);
    updateColormap();
  }, [labels, imageUrl, labelUrl])

  const handleMouseMove = (e: MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleWheel = (e: WheelEvent) => {
    if (!nvRef.current) return;
    if (e.ctrlKey || e.metaKey) {
      // // CMD/CTRL + SCROLL = ZOOM
      const drawing = nvRef.current.opts.drawingEnabled;
      nvRef.current.setDrawingEnabled(false);
      // 1. Capture the exact screen coordinates of the mouse during the scroll
      const { clientX, clientY } = e;

      // 2. Create a synthetic left-click to force NiiVue to move the crosshair
      const pointerDown = new PointerEvent('mousedown', {
        clientX,
        clientY,
        button: 0,     // 0 = Main button (left)
        buttons: 1,    // 1 = Left button is actively being pressed
        bubbles: true,
        cancelable: true,
      });

      // 3. Create a synthetic release so NiiVue doesn't get stuck in a "drag" state
      const pointerUp = new PointerEvent('mouseup', {
        clientX,
        clientY,
        button: 0,
        buttons: 0,    // 0 = No buttons pressed
        bubbles: true,
        cancelable: true,
      });

      // 4. Dispatch the events to the canvas
      canvas.current?.dispatchEvent(pointerDown);
      canvas.current?.dispatchEvent(pointerUp);
      nvRef.current.opts.dragMode = 3
      nvRef.current.setDrawingEnabled(drawing);
      updateColormap();

    } else {
      nvRef.current.opts.dragMode = 1
    }
  };

  const handekKeyDown = (e: KeyboardEvent) => {
    if (!nvRef.current) return;
    console.log("Key pressed:", e.key);
    if (e.key === 'ArrowLeft' || e.key === "ArrowRight") {
      const delta = e.key === 'ArrowLeft' ? -1 : 1;
      console.log("Simulating wheel event with delta:", delta);
      const simulatedWheelEvent = new WheelEvent('wheel', {
        deltaY: delta,       // Vertical scroll amount
        deltaX: 0,       // Horizontal scroll amount
        deltaZ: 0,
        deltaMode: 0,    // 0 = pixels, 1 = lines, 2 = pages
        bubbles: true,   // Allows the event to bubble up the DOM
        cancelable: true, // Allows the event to be prevented
        clientX: mousePosRef.current.x, // Grab the tracked mouse X
        clientY: mousePosRef.current.y, // Grab the tracked mouse Y
      });

      // 5. Dispatch the event onto the canvas
      canvas.current?.dispatchEvent(simulatedWheelEvent);
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      nvRef.current.drawUndo();
    }
  }

  useEffect(() => {
    if (!nvRef.current) return;
    nvRef.current.opts.penSize = brushSize;
    nvRef.current.opts.penType = 0;

  }, [brushColor, brushSize]);

  useEffect(() => {
    if (!nvRef.current) return;
    nvRef.current.setSliceType(getNVView({ view, nv: nvRef.current }));
  }, [view]);

  const setRadiologicalConvention = () => {
    if (!nvRef.current) return;
    if (isRadiology) {
      nvRef.current.setRadiologicalConvention(true);
    } else {
      nvRef.current.setRadiologicalConvention(false);
    }
  }

  const setDrawingEnabled = () => {
    if (!nvRef.current) return;
    if (activeTool === "cursor") {
      nvRef.current.setDrawingEnabled(false);
      nvRef.current.opts.crosshairWidth = crosshairWidth;
    }
    else {
      nvRef.current.setDrawingEnabled(true);
      nvRef.current.opts.crosshairWidth = 0;
    }
  }




  useEffect(() => {
    setRadiologicalConvention();
  }, [isRadiology])

  useEffect(() => {
    setTimeout(() => {
      console.log({ activeTool }, { nvRef: nvRef.current })
      if (!nvRef.current) return;
      if (activeTool === "cursor") {
        nvRef.current.setDrawingEnabled(false);
        nvRef.current.opts.crosshairWidth = crosshairWidth;
      } else {
        nvRef.current.setDrawingEnabled(true);
        nvRef.current.opts.crosshairWidth = 0;
      }
      if (activeTool === "brush") {
        nvRef.current.setPenValue(1);
      } else if (activeTool === "eraser") {
        nvRef.current.setPenValue(0);
      }
      updateColormap();
    }, 600)
  }, [activeTool]);

  const getNVView = ({ view, nv }: { view: "axial" | "sagittal" | "coronal" | "multiplanar" | "3D", nv: Niivue }) => {
    if (view === "axial") return nv.sliceTypeAxial;
    else if (view === "sagittal") return nv.sliceTypeSagittal;
    else if (view === "coronal") return nv.sliceTypeCoronal;
    else if (view === "multiplanar") return nv.sliceTypeMultiplanar;
    else return nv.sliceTypeRender;
  }

  // I need to make draw meta data updates
  // I need to add update to colour maps and opacity

  // upload and display the image/label using niivue
  useEffect(() => {

    console.log("imageUrl", imageUrl);
    console.log("labelUrl", labelUrl);
    console.log("cmap", labels)
    if (!imageUrl) return;

    const volumeList = [
      {
        url: imageUrl,
        name: "image.nii.gz",
      },
    ];
    async function setupAndLoad(
      volumeList: { url: string }[],
    ) {
      const nv = new Niivue();
      nvRef.current = nv;
      nv.setMultiplanarLayout(3);
      // console.log({ nv }, { volumeList })

      //   @ts-ignore
      nv.attachToCanvas(canvas.current);
      await nv.loadVolumes(volumeList);
      if (activeTool === "brush" || activeTool === "eraser") {

        nv.setDrawingEnabled(true);
        nv.opts.crosshairWidth = 0;
      }
      if (labelUrl) await nv.loadDrawingFromUrl(labelUrl);
      nv.opts.dragAndDropEnabled = false
      nv.setDrawOpacity(0.8);
      nv.setSliceType(getNVView({ view, nv }))
      // nv.addEventListener('locationChange', handler);
      const mouseEventConfig = {
        leftButton: {
          primary: 8,
          withCtrl: 3
        },
        rightButton: 1,
        centerButton: 3
      }
      nv.setMouseEventConfig(mouseEventConfig)
      updateColormap();
      setRadiologicalConvention();
      nvRef.current = nv;
    }

    setupAndLoad(volumeList);
    // @ts-ignore
    canvas.current?.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handekKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // @ts-ignore
      canvas.current?.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handekKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [imageUrl, labelUrl]);

  return (
    <div className="relative inline-block w-full h-full">
      <canvas ref={canvas}
        className={` w-full h-full`}
        // className={`${activeTool !== "cursor" ? "cursor-none" : ""} w-full h-full`}
        // onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      // onTouchStart={handleTouchStart}
      // onWheel={handleWheel}
      // onTouchMove={handleTouchMove}
      />

      {/* {
        activeTool !== "cursor" &&
        <div
        ref={cursorRef}
        className={`
          absolute pointer-events-none  border-2 
          -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150
          ${isHovering ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          width: `${brushSize-4}px`,
          height: `${brushSize-4}px`,
          borderColor: brushColor,
          // left and top are dynamically injected by the handleMouseMove function
        }}
      />
    } */}
    </div>
  )

};

// use as: <NiiVue imageUrl={someUrl}> </NiiVue>
