import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";
import { useSearchParams } from "next/navigation";

const DetailTrackPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${slug}`,
    method: "GET",
  });

  return (
    <Container>
      <div>
        <WaveTrack track={res.data ?? null} />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
