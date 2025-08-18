import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";
import { useSearchParams } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

type IGenerateMetadataProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: IGenerateMetadataProps): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${slug}`,
    method: "GET",
  });

  return {
    title: res.data?.title,
    description: res.data?.description,
  };
}

const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${slug}`,
    method: "GET",
    nextOption: {
      cache: "no-store",
    },
  });

  console.log(">>> check res:", res);

  const comments = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: slug,
      sort: "-createdAt",
    },
  });

  return (
    <Container>
      <div>
        <WaveTrack track={res?.data ?? null} comments={comments.data?.result || []} />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
