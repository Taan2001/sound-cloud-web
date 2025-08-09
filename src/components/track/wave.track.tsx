"use client";
import { useWavesurfer } from "@/utils/customHooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";

export default function WaveTrack() {
  const audioParams = useSearchParams();
  const filename = audioParams.get("audio");
  const containerRef = useRef<HTMLDivElement>(null);

  const optionMemo = useMemo(
    (): Omit<WaveSurferOptions, "container"> => ({
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      barWidth: 2,
      url: `/api?audio=${filename}`,
    }),
    [filename]
  );

  const wavesurfer = useWavesurfer(containerRef, optionMemo);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!wavesurfer) return;

    setIsPlaying(false);

    const subcription = [
      wavesurfer.on("play", () => setIsPlaying(true)),
      wavesurfer.on("pause", () => setIsPlaying(false)),
    ];
    return () => {
      subcription.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  const onPlayClick = useCallback(() => {
    if (!wavesurfer) return;
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
  }, [wavesurfer]);

  return (
    <div>
      <div ref={containerRef} style={{ width: "100%" }}>
        <h2>Wave Track Component</h2>
      </div>
      <button onClick={() => onPlayClick()}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
