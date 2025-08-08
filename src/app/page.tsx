import { Container } from "@mui/material";
import MainSlider from "@/components/main/main.slider";
import { sendRequest } from "@/utils/api";

export default async function HomePage() {
  const res = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 1,
    },
  });

  console.log("check data:", res.data);

  return (
    <Container>
      <MainSlider />
    </Container>
  );
}
