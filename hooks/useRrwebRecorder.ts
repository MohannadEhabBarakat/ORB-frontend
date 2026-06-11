"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import type { record as rrwebRecord } from "rrweb";
import type { eventWithTime } from "@rrweb/types";
import { API_BASE_URL } from "@/store/api";
import { setStopRecording } from "@/store/features/annotator/annotator";

type RecordFn = typeof rrwebRecord;

/**
 * Monkey-patch HTMLCanvasElement.getContext so that every WebGL context is
 * created with `preserveDrawingBuffer: true`.
 *
 * Why: rrweb captures canvas content via `canvas.toDataURL()`. By default,
 * WebGL clears its drawing buffer after compositing, so `toDataURL()` returns
 * a blank (black) image. Forcing `preserveDrawingBuffer` keeps the last frame
 * in memory for rrweb to snapshot.
 *
 * This MUST run before Niivue (or any WebGL lib) creates its context.
 * Running it at module scope guarantees it executes on first import.
 */
if (typeof window !== "undefined") {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.getContext = function (
    this: HTMLCanvasElement,
    type: string,
    attributes?: Record<string, unknown>
  ) {
    if (type === "webgl" || type === "webgl2") {
      attributes = attributes || {};
      attributes.preserveDrawingBuffer = true;
    }
    return originalGetContext.call(this, type, attributes);
  } as typeof originalGetContext;
}

/** Maximum events per upload chunk to avoid JSON.stringify RangeError */
const UPLOAD_CHUNK_SIZE = 500;

/** Safety cap: stop collecting events if we exceed this to prevent OOM */
const MAX_EVENTS = 50_000;

/**
 * Hook that manages rrweb session recording in the annotation tool.
 *
 * Recording starts when the annotator has both an activeLabel AND an activeVolume.
 * Recording stops (and is uploaded) when:
 *  - activeLabel changes
 *  - activeVolume changes
 *  - the case is marked as "Done" (via stopRecording flag)
 */
export function useRrwebRecorder() {
  const dispatch = useDispatch();

  const activeLabel = useSelector(
    (state: RootState) => state.annotator.activeLabel
  );
  const activeVolume = useSelector(
    (state: RootState) => state.annotator.activeVolume
  );
  const selectedDataset = useSelector(
    (state: RootState) => state.datasets.selectedDataset
  );
  const stopRecordingFlag = useSelector(
    (state: RootState) => state.annotator.stopRecording
  );

  const eventsRef = useRef<eventWithTime[]>([]);
  const stopFnRef = useRef<ReturnType<RecordFn> | null>(null);
  const prevLabelRef = useRef<string | null>(null);
  const prevVolumeRef = useRef<string | null>(null);
  const isRecordingRef = useRef(false);
  const selectedDatasetRef = useRef(selectedDataset);

  // Keep dataset ref in sync
  useEffect(() => {
    selectedDatasetRef.current = selectedDataset;
  }, [selectedDataset]);

  /**
   * Upload a single chunk of events to the backend.
   * Returns true on success, false on failure.
   */
  const uploadChunk = useCallback(
    async (labelPath: string, datasetName: string, chunk: eventWithTime[]): Promise<boolean> => {
      try {
        const body = JSON.stringify({
          label_path: labelPath,
          dataset_name: datasetName,
          events: chunk,
        });

        const response = await fetch(`${API_BASE_URL}/annotations/rrweb`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[rrweb] Chunk upload failed:", response.status, errorText);
          return false;
        }
        return true;
      } catch (err) {
        console.error("[rrweb] Chunk upload error:", err);
        return false;
      }
    },
    []
  );

  /**
   * Upload recorded events to the backend in chunks.
   * Splitting avoids the JSON.stringify RangeError on very large payloads.
   */
  const uploadRecording = useCallback(
    async (labelPath: string, datasetName: string, events: eventWithTime[]) => {
      if (events.length === 0) {
        console.warn("[rrweb] uploadRecording called with 0 events, skipping");
        return;
      }

      const totalChunks = Math.ceil(events.length / UPLOAD_CHUNK_SIZE);
      console.log(
        `[rrweb] Uploading ${events.length} events in ${totalChunks} chunk(s) ` +
        `for label=${labelPath}, dataset=${datasetName}`
      );

      let uploadedChunks = 0;
      for (let i = 0; i < events.length; i += UPLOAD_CHUNK_SIZE) {
        const chunk = events.slice(i, i + UPLOAD_CHUNK_SIZE);
        const ok = await uploadChunk(labelPath, datasetName, chunk);
        if (ok) {
          uploadedChunks++;
        } else {
          console.error(`[rrweb] Failed on chunk ${Math.floor(i / UPLOAD_CHUNK_SIZE) + 1}/${totalChunks}`);
        }
      }

      console.log(`[rrweb] Upload complete: ${uploadedChunks}/${totalChunks} chunks succeeded`);
    },
    [uploadChunk]
  );

  /** Stop current recording and upload */
  const stopRecording = useCallback(() => {
    console.log("[rrweb] stopRecording called", {
      isRecording: isRecordingRef.current,
      eventsCount: eventsRef.current.length,
      prevLabel: prevLabelRef.current,
      dataset: selectedDatasetRef.current,
      hasStopFn: !!stopFnRef.current,
    });

    if (stopFnRef.current) {
      stopFnRef.current();
      stopFnRef.current = null;
    }

    if (isRecordingRef.current && eventsRef.current.length > 0) {
      const labelPath = prevLabelRef.current;
      const dataset = selectedDatasetRef.current;

      if (labelPath && dataset) {
        // Extract the label_path portion from the URL-like string
        const pathPart = labelPath.includes("label?label_path=")
          ? labelPath.split("label?label_path=")[1]
          : labelPath;

        uploadRecording(pathPart, dataset, [...eventsRef.current]);
      } else {
        console.warn("[rrweb] Missing labelPath or dataset, cannot upload", { labelPath, dataset });
      }
    } else {
      console.warn("[rrweb] Skipping upload:", {
        isRecording: isRecordingRef.current,
        eventsCount: eventsRef.current.length,
      });
    }

    eventsRef.current = [];
    isRecordingRef.current = false;
  }, [uploadRecording]);

  /** Start a new recording session */
  const startRecording = useCallback(async () => {
    console.log("[rrweb] startRecording called");
    // Dynamically import rrweb (it uses DOM APIs, so we import it client-side)
    const rrweb = await import("rrweb");
    const recordFn = rrweb.record || (rrweb as any).default?.record;

    if (typeof recordFn !== "function") {
      console.error("[rrweb] Could not find rrweb.record function:", rrweb);
      return;
    }

    eventsRef.current = [];
    isRecordingRef.current = true;

    const stop = recordFn({
      emit(event: eventWithTime) {
        if (eventsRef.current.length < MAX_EVENTS) {
          eventsRef.current.push(event);
        }
      },
      // Sampling configuration to keep recording size reasonable
      sampling: {
        mousemove: true,
        mouseInteraction: true,
        scroll: 150,
        media: 800,
        input: "last",
        // Snapshot the canvas at ~6 fps (balance between playback smoothness and data volume)
        canvas: 6,
      },
      // Mask user inputs for privacy
      maskAllInputs: false,
      // Inline stylesheets for accurate playback
      inlineStylesheet: true,
      // Record canvas content (important for Niivue viewer)
      recordCanvas: true,
      // Capture cross-origin iframes
      recordCrossOriginIframes: false,
    });

    stopFnRef.current = stop ?? null;
    console.log("[rrweb] Recording started, stopFn:", !!stop);
  }, []);

  // Handle stopRecording flag from Redux (triggered when marking case as Done)
  useEffect(() => {
    console.log("[rrweb] stopRecordingFlag effect:", {
      stopRecordingFlag,
      isRecording: isRecordingRef.current,
    });
    if (stopRecordingFlag) {
      if (isRecordingRef.current) {
        stopRecording();
      } else {
        console.warn("[rrweb] stopRecordingFlag is true but isRecordingRef is false — nothing to stop");
      }
      dispatch(setStopRecording(false));
    }
  }, [stopRecordingFlag, stopRecording, dispatch]);

  // Main effect: monitor activeLabel and activeVolume changes
  useEffect(() => {
    const prevLabel = prevLabelRef.current;
    const prevVolume = prevVolumeRef.current;
    
    const labelChanged = activeLabel !== prevLabel;
    const volumeChanged = activeVolume !== prevVolume;

    // If either changed, stop any existing recording
    if (isRecordingRef.current && (labelChanged || volumeChanged)) {
      stopRecording();
    }

    // Start new recording if both are set and at least one changed
    if (activeLabel && activeVolume && (labelChanged || volumeChanged)) {
      startRecording();
    }

    // Update refs
    prevLabelRef.current = activeLabel;
    prevVolumeRef.current = activeVolume;
  }, [activeLabel, activeVolume, startRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecordingRef.current) {
        stopRecording();
      }
    };
  }, [stopRecording]);

  return { isRecording: isRecordingRef.current };
}

