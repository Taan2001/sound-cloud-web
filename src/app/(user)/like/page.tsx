import { authOptions } from "@/app/api/auth/auth.options";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sound Cloud - Like Page",
  description: "like page of sound cloud",
};

export default async function LikePage() {
  const session = await getServerSession(authOptions);

  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["liked-by-user"] },
    },
  });

  const likeTracks = res?.data?.result ?? [];

  return (
    <Container>
      <h4>Hear the tracks you've liked</h4>
      <Divider />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
        }}
      >
        {likeTracks.map((likeTrack) => {
          return (
            <div
              style={{
                maxWidth: "250px",
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${likeTrack.imgUrl}`}
                alt={`image-${likeTrack.title}`}
                width={250}
                height={250}
              />
              <Link href={`/track/${convertSlugUrl(likeTrack.title)}-${likeTrack._id}.html?audio=${likeTrack.trackUrl}`}>
                {likeTrack.title}
              </Link>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
