import { Container } from "@mui/material";
import { getServerSession } from "next-auth/next";
import MainSlider from "@/components/main/main.slider";
import { sendRequest } from "@/utils/api";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  console.log(">>> check session:", session);
  // get session
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10,
    },
  });
  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10,
    },
  });
  const parties = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10,
    },
  });

  return (
    <Container>
      <MainSlider title="Top Chill" data={chills?.data ?? []} />
      <MainSlider title="Top Workout" data={workouts?.data ?? []} />
      <MainSlider title="Top Party" data={parties?.data ?? []} />
    </Container>
  );
}
