// const zoomSpeed = .1; // Adjusted for wheel sensitivity
//       const newScale = nvRef.current.scene.volScaleMultiplier + (delta * zoomSpeed);
//       nvRef.current.setScale(Math.min(Math.max(newScale, 0.5), 15));
//       //   nvRef.current.updateGLVolume()
//       // 2. Zoom the 2D Slices
//       // scene.pan2Dxyzmm is a 4-element array: [panX, panY, panZ, zoomFactor]
//       const current2DZoom = nvRef.current.scene.pan2Dxyzmm[3]; 
//       const new2DZoom = current2DZoom + (delta * zoomSpeed);
    
//       // Constrain the 2D zoom to your desired min/max bounds and apply it
//       nvRef.current.scene.pan2Dxyzmm[3] = Math.min(Math.max(new2DZoom, 0.5), 15);
//       // 3. Pan to keep the crosshair centered
//       // Convert fractional positions (0.0 to 1.0) into real-world mm
//       const crosshairMM = nvRef.current.scene.crosshairPos
//       console.log({crosshairMM})
//       const volumeCenterMM = nvRef.current.frac2mm([0.5, 0.5, 0.5]); 
//       console.log({volumeCenterMM})
//       console.log("Calculated Pan Displacement (mm):", {
//         x: -(crosshairMM[0] - volumeCenterMM[0]),
//         y: -(crosshairMM[1] - volumeCenterMM[1]),
//         z: -(crosshairMM[2] - volumeCenterMM[2])
//       })
//       console.log("Current Pan (mm):", {
//         x: nvRef.current.scene.pan2Dxyzmm[0],
//         y: nvRef.current.scene.pan2Dxyzmm[1],
//         z: nvRef.current.scene.pan2Dxyzmm[2]
//       })

//       // Calculate the required pan displacement to lock onto the crosshair
//       // Note: Depending on your NiiVue radiological/neurological settings, 
//       // you might need to invert these by swapping (volumeCenterMM - crosshairMM)
//       nvRef.current.scene.pan2Dxyzmm[0] = crosshairMM[0]
//       nvRef.current.scene.pan2Dxyzmm[1] = crosshairMM[1]
//       nvRef.current.scene.pan2Dxyzmm[2] = crosshairMM[2]
      
//       // 4. Force a re-render so the 2D views reflect the new zoom level
//       nvRef.current.drawScene();