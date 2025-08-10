"use client";
import WaveTrack from "@/components/track/wave.track";
import Container from "@mui/material/Container";
import { useSearchParams } from "next/navigation";

export default function DetailTrackPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <Container>
      Detail Track Page
      <div>
        <WaveTrack />
      </div>
    </Container>
  );
}
