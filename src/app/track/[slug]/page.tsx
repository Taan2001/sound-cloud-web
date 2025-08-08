"use client";
import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";

export default function DetailTrackPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  return (
    <div>
      Detail Track Page
      <div>
        <WaveTrack />
      </div>
    </div>
  );
}
