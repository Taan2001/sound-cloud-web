"use client";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHooks";
import { Box, Grid, TextField } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WaveSurfer from "wavesurfer.js";
dayjs.extend(relativeTime);

interface IWaveTrackProps {
  track: ITrackTop | null;
  comments: ITrackComment[] | [];
  wavesurfer: WaveSurfer | null;
}

const CommentTrack = ({ track, comments, wavesurfer }: IWaveTrackProps) => {
  const router = useRouter();

  const { data: session } = useSession();

  const hasMounted = useHasMounted();

  const [yourComment, setYourComment] = useState<string>("");

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds) * 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<ITrackComment>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
      method: "POST",
      body: {
        content: yourComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: track?._id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (res.data) {
      setYourComment("");
      router.refresh();
    }
  };

  const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(moment / duration);
      wavesurfer.play();
    }
  };

  return (
    <div>
      {session?.user && (
        <TextField
          label="Comments"
          variant="standard"
          fullWidth
          value={yourComment}
          onChange={(e) => {
            setYourComment(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      )}
      <div style={{ marginTop: "16px" }}>
        <Grid container spacing={2}>
          <Grid item xs={4} lg={3}>
            <Image src={fetchDefaultImages(track?.uploader.type!)} alt="avatar-comment" width={150} height={150} />
          </Grid>
          <Grid item xs={8} lg={9} sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {comments.map((comment) => {
              return (
                <Box key={comment._id} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", gap: "20px" }}>
                    <Box sx={{ display: "flex", gap: "12px" }}>
                      <Image src={fetchDefaultImages(comment.user.type)} width={40} height={40} alt="comments" />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "space-between" }}>
                      <div style={{ fontSize: "13px" }}>
                        {comment?.user?.name ?? comment?.user?.email} at
                        <span style={{ cursor: "pointer" }} onClick={() => handleJumpTrack(comment.moment)}>
                          &nbsp; {formatTime(comment.moment)}
                        </span>
                      </div>
                      <div>{comment.content}</div>
                    </Box>
                  </Box>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#999",
                    }}
                  >
                    {hasMounted && dayjs(comment.createdAt).fromNow()}
                  </div>
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default CommentTrack;
