"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToggleFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:cursor-pointer"
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <Minimize className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Maximize className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
    </Button>
  );
}
