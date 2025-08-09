"use client";
import { useWavesurfer } from "@/utils/customHooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useMemo } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";

export default function WaveTrack() {
  const audioParams = useSearchParams();
  const filename = audioParams.get("audio");
  const containerRef = useRef<HTMLDivElement>(null);

  const optionMemo = useMemo(() => {
    return {
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      url: `/api?audio=${filename}`,
    };
  }, [filename]);

  const wavesurfer = useWavesurfer(containerRef, optionMemo);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "128px" }}>
      <h2>Wave Track Component</h2>
    </div>
  );
}
