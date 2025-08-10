"use client";
import { useWavesurfer } from "@/utils/customHooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";

import "./wave.scss";

export default function WaveTrack() {
  const audioParams = useSearchParams();
  const filename = audioParams.get("audio");
  const containerRef = useRef<HTMLDivElement>(null);

  const optionMemo = useMemo((): Omit<WaveSurferOptions, "container"> | null => {
    if (typeof document === "undefined" || !filename) {
      return null;
    }

    console.log(">>> check document", document);
    const canvas = document.createElement("canvas")!;
    const ctx = canvas?.getContext("2d")!;

    // gradient for wave color
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    gradient.addColorStop(0, "#656666");
    gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666");
    gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, "#ffffff");
    gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, "#ffffff");
    gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, "#B1B1B1");
    gradient.addColorStop(1, "#F6B094");

    // progress color for the wave
    const progressGradient = ctx?.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    progressGradient.addColorStop(0, "#EE772F");
    progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, "#EB4926");
    progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, "#ffffff");
    progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, "#ffffff");
    progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, "#F3B094");
    progressGradient.addColorStop(1, "#F6B094");

    return {
      waveColor: gradient,
      progressColor: progressGradient,
      barWidth: 2,
      url: `/api?audio=${filename}`,
    };
  }, [filename]);

  const wavesurfer = useWavesurfer(containerRef, optionMemo!);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!wavesurfer) return;

    setIsPlaying(false);
    const timeEl = document.querySelector("#time")!;
    const durationEl = document.querySelector("#duration")!;
    const hoverEl = document.querySelector("#hover")!;
    const waveform = containerRef.current!;

    // @ts-ignore
    waveform.addEventListener("pointermove", (e) => (hoverEl.style.width = `${e.offsetX}px`));

    const subcription = [
      wavesurfer.on("play", () => setIsPlaying(true)),
      wavesurfer.on("pause", () => setIsPlaying(false)),
      wavesurfer.on("decode", (duration) => (durationEl.textContent = formatTime(duration))),
      wavesurfer.on("timeupdate", (currentTime) => (timeEl.textContent = formatTime(currentTime))),
    ];
    return () => {
      subcription.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  const onPlayClick = useCallback(() => {
    if (!wavesurfer) return;
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
  }, [wavesurfer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  return (
    <div>
      <div ref={containerRef} style={{ width: "100%" }} className="wave-form-container">
        <h2>Wave Track Component</h2>
        <div id="time">0:00</div>
        <div id="duration">0:00</div>
        <div id="hover"></div>
      </div>
      <button onClick={() => onPlayClick()}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}
