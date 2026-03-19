// "use client";
// import NiiVue from "./renderCore";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable"
// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "@/store/store";
// import { Niivue } from "@niivue/niivue";
// import { useRef, useEffect, useState, MouseEvent, use } from "react";

// export default function Grid() {
//   const activeLabel = useSelector(
//       (state: RootState) => state.annotator.activeLabel,
//     );
//     const activeVolume = useSelector(
//       (state: RootState) => state.annotator.activeVolume,
//     );
//     const brushColor = useSelector((state: RootState) => state.tool.color);
//     const brushSize = useSelector((state: RootState) => state.tool.size);
//     const activeTool = useSelector((state: RootState) => state.tool.tool);
//     const axial = useRef<Niivue>(null);
//     const sagittal = useRef<Niivue>(null);
//     const coronal = useRef<Niivue>(null);
//     const threeD = useRef<Niivue>(null);

//     useEffect( () => {
//       if (!axial.current || !sagittal.current || !coronal.current) return
//       axial.current?.broadcastTo([sagittal.current, coronal.current], { "2d": true, "3d": true });
//       sagittal.current?.broadcastTo([axial.current, coronal.current], { "2d": true, "3d": true });
//       coronal.current?.broadcastTo([axial.current, sagittal.current], { "2d": true, "3d": true });
//     }, [axial, sagittal, coronal]);

//   return (
//     <div className="w-full h-full flex flex-col">
    
//     <ResizablePanelGroup orientation="horizontal" className="w-full h-full grow">
//       <ResizablePanel>
//         <ResizablePanelGroup orientation="vertical" className="w-full h-full grow">
//           <ResizablePanel>
//             <NiiVue
//                     view="coronal"
//                     imageUrl={activeVolume}
//                     labelUrl={activeLabel}
//                     brushColor={brushColor}
//                     brushSize={brushSize}
//                     activeTool={activeTool}
//                     tool={activeTool}
//                     nvRef={coronal}
//                   />
//           </ResizablePanel>

//           <ResizableHandle withHandle />

//           <ResizablePanel>
//             <NiiVue
//                     view="axial"
//                     imageUrl={activeVolume}
//                     labelUrl={activeLabel}
//                     brushColor={brushColor}
//                     brushSize={brushSize}
//                     activeTool={activeTool}
//                     tool={activeTool}
//                     nvRef={axial}
//                   />
//           </ResizablePanel> 
//         </ResizablePanelGroup>

//       </ResizablePanel>

//       <ResizableHandle withHandle />

//       <ResizablePanel>
//         <ResizablePanelGroup orientation="vertical" className="w-full h-full grow">
//           <ResizablePanel>
//             <NiiVue
//                     view="sagittal"
//                     imageUrl={activeVolume}
//                     labelUrl={activeLabel}
//                     brushColor={brushColor}
//                     brushSize={brushSize}
//                     activeTool={activeTool}
//                     tool={activeTool}
//                     nvRef={sagittal}
//                   />
//           </ResizablePanel>

//           <ResizableHandle withHandle />

//           <ResizablePanel>
//             <NiiVue
//                     view="3D"
//                     imageUrl={activeVolume}
//                     labelUrl={activeLabel}
//                     brushColor={brushColor}
//                     brushSize={brushSize}
//                     activeTool={activeTool}
//                     tool={activeTool}
//                     nvRef={threeD}
//                   />
//           </ResizablePanel> 
//         </ResizablePanelGroup>

//       </ResizablePanel>

//     </ResizablePanelGroup>
//     </div>
//   );
// }
