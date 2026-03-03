import { Niivue } from "@niivue/niivue";
// --- ZOOM TO CURSOR LOGIC ---
    const handleWheel = (e: WheelEvent, nvRef: React.RefObject<Niivue | null>, canvas: HTMLCanvasElement) => {
      if (!nvRef.current) return;
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // 1. Move crosshair to mouse location
        // We get the bounding rect to find the local canvas coordinates
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // nv.selectColortable(x, y) or similar isn't needed; 
        // we use the internal click simulator to move the crosshair
        nvRef.current.setDrawingEnabled(false); // Temporarily disable drawing to prevent marks
        nvRef.current.mouseClick(x, y);
        setDrawingEnabled()


        // 2. Apply Scale
        const zoomSpeed = 0.001;
        const delta = -e.deltaY;
        const newScale = nvRef.current + (delta * zoomSpeed);
        
        // Clamp and Draw
        nvRef.current.setScale(Math.min(Math.max(newScale, 0.5), 15));
        nvRef.current.draw();
      } else {
        // Regular slice scrolling
        nvRef.current.sliceScroll2D(-e.deltaY * 0.2);
      }
    };
