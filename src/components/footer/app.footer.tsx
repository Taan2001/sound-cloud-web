"use client";
import { useRef } from "react";
import { useTrackContext } from "@/lib/track.wrapper";
import { useHasMounted } from "@/utils/customHooks";
import { AppBar, Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function AppFooter() {
  const hasMounted = useHasMounted();

  const playerRef = useRef(null);

  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

  if (!hasMounted) {
    return <></>;
  }
  // @ts-ignore
  if (currentTrack?.isPlaying) {
    // @ts-ignore
    playerRef.current?.audio?.current.play();
  } else {
    // @ts-ignore
    playerRef.current?.audio?.current.pause();
  }

  return (
    <div style={{ marginTop: 50 }}>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "#f2f2f2",
        }}
      >
        <Container
          sx={{
            display: "flex",
            gap: 8,
            ".rhap_main": {
              gap: "40px",
            },
          }}
        >
          <AudioPlayer
            ref={playerRef}
            layout="horizontal-reverse"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
            volume={0.5}
            style={{
              boxShadow: "unset",
              backgroundColor: "#f2f2f2",
            }}
            onPause={() => {
              setCurrentTrack({
                ...currentTrack,
                isPlaying: false,
              });
            }}
            onPlay={() => {
              setCurrentTrack({
                ...currentTrack,
                isPlaying: true,
              });
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              minWidth: 100,
            }}
          >
            <div style={{ color: "#ccc" }}>{currentTrack.description}</div>
            <div style={{ color: "#000" }}>{currentTrack.title}</div>
          </div>
        </Container>
      </AppBar>
    </div>
  );
}
