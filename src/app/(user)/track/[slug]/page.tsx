import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";
import { useSearchParams } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type IGenerateMetadataProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: IGenerateMetadataProps): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  const temp = slug?.split(".html")[0]?.split("-") ?? [];
  const id = temp[temp.length - 1];

  // fetch data
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
  });

  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "Hỏi Dân IT",
      description: "Beyond Your Coding Skills",
      type: "website",
      images: [`https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`],
    },
  };
}

const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const temp = slug?.split(".html")[0]?.split("-") ?? [];
  const id = temp[temp.length - 1];

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    nextOption: {
      cache: "no-store",
    },
  });

  const comments = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: id,
      sort: "-createdAt",
    },
  });

  if (!comments?.data) {
    return notFound();
  }

  return (
    <Container>
      <div>
        <WaveTrack track={res?.data ?? null} comments={comments.data?.result || []} />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
