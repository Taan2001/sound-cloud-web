"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

export default function WaveTrack() {
  const audioParams = useSearchParams();
  const filename = audioParams.get("audio");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef?.current) {
      WaveSurfer.create({
        container: containerRef.current,
        waveColor: "rgb(200, 0, 200)",
        progressColor: "rgb(100, 0, 100)",
        url: `/api?audio=${filename}`,
      });
    }
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "128px" }}>
      <h2>Wave Track Component</h2>
    </div>
  );
}
