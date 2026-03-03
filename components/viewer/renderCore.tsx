import { useRef, useEffect, useState, MouseEvent, use } from "react";
import { Niivue } from "@niivue/niivue";
import { a } from "motion/react-client";
import { color } from "motion";

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
}

export default function NiiVue({imageUrl, labelUrl, view, brushColor="red", brushSize=3, activeTool, isRadiology, nvRef}: NiiVueProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
//   const nvRef = useRef<any>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const crosshairWidth = 0.5

  useEffect(() => {
    if (!nvRef.current) return;
    nvRef.current.opts.penSize = brushSize;
    nvRef.current.opts.penType = 0;
  }, [brushColor, brushSize]);

  useEffect(() => {
    if (!nvRef.current) return;
    nvRef.current.setSliceType(getNVView({view, nv: nvRef.current}));
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
    console.log({activeTool}, {nvRef: nvRef.current})
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
    }else if (activeTool === "eraser") {
        nvRef.current.setPenValue(0);
    }
    }, 600)
  }, [activeTool]);
  
  const getNVView = ({view, nv}: {view: "axial" | "sagittal" | "coronal" | "multiplanar" | "3D", nv: Niivue}) => {
    if (view === "axial") return nv.sliceTypeAxial;
    else if (view === "sagittal") return nv.sliceTypeSagittal;
    else if (view === "coronal") return nv.sliceTypeCoronal;
    else if (view === "multiplanar") return nv.sliceTypeMultiplanar;
    else return nv.sliceTypeRender;
  }
  
  // I need to make draw meta data updates
  // I need to add update to colour maps and opacity
  async function setupAndLoad(
    volumeList: { url: string }[],
  ) {
    const nv = new Niivue();
    console.log({nv}, {volumeList})

    //   @ts-ignore
    nv.attachToCanvas(canvas.current);
    await nv.loadVolumes(volumeList);
    if (activeTool === "brush" || activeTool === "eraser"){ 
        nv.setDrawingEnabled(true);
        nv.opts.crosshairWidth = 0; 
    }
    if (labelUrl) await nv.loadDrawingFromUrl(labelUrl);
    nv.opts.dragAndDropEnabled = false
    nv.setDrawOpacity(0.8);
    nv.setSliceType(getNVView({view, nv})) 
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
    setRadiologicalConvention();
    nvRef.current = nv;
  }

  // upload and display the image/label using niivue
  useEffect(() => {
    if (!imageUrl) return;
    const volumeList = [
      {
        url: imageUrl,
        name: "image.nii.gz",
      },
    ];
    setupAndLoad(volumeList);
  }, [imageUrl, labelUrl]);

  return(
    <div className="relative inline-block w-full h-full">
        <canvas ref={canvas} 
        className={` w-full h-full`}
        // className={`${activeTool !== "cursor" ? "cursor-none" : ""} w-full h-full`}
        // onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)} 
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
