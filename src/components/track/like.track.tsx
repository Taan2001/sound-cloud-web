"use client";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";

interface ILikeTrackProps {
  track: ITrackTop | null;
}

const LikeTrack = ({ track }: ILikeTrackProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [trackLikes, setTrackLikes] = useState<ITrackLike[] | []>([]);

  const fetchData = async () => {
    if (session?.access_token) {
      const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: {
          current: 1,
          pageSize: 100,
          sort: "-createdAt",
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (res?.data?.result) {
        setTrackLikes(res?.data?.result);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const handleLikeTrack = async () => {
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
      method: "POST",
      body: {
        track: track?._id,
        quantity: trackLikes?.some((t) => t._id === track?._id) ? -1 : 1,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    await sendRequest<IBackendRes<any>>({
      url: `/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "track-by-id",
        secret: "justASecretForCache",
      },
    });

    await fetchData();
    router.refresh();
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Chip
        icon={<FavoriteIcon />}
        label="Like"
        variant="outlined"
        sx={{ borderRadius: "5px" }}
        size="medium"
        clickable
        color={trackLikes.some((t) => t._id === track?._id) ? "error" : "default"}
        onClick={handleLikeTrack}
      />
      <div
        style={{
          display: "flex",
          width: "100px",
          color: "#999",
          gap: "20px",
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <PlayArrowIcon sx={{ fontSize: "24px" }} />
          {track?.countPlay}
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FavoriteIcon sx={{ fontSize: "20px" }} />
          {track?.countLike}
        </span>
      </div>
    </div>
  );
};

export default LikeTrack;
