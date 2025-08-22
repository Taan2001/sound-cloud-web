"use client";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Image from "next/image";

interface IClientSearchProps {}

const ClientSearch = ({}: IClientSearchProps) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [tracks, setTracks] = useState<ITrackTop[]>([]);

  const fetchData = async (query: string) => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
      method: "POST",
      body: {
        current: 1,
        pageSize: 10,
        title: query,
      },
    });

    if (res.data?.result) {
      setTracks(res.data.result);
    }
  };
  useEffect(() => {
    document.title = `"${query}" on Sound Cloud`;

    fetchData(query);
  }, [query]);

  return (
    <div>
      <Box sx={{ mb: 2 }}>Search by keyword: {query} </Box>
      <Divider />
      <Box
        sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          justifyContent: "center",
          a: {
            display: "flex",
            textDecoration: "none",
            color: "inherit",
            alignItems: "center",
          },
        }}
      >
        {tracks.map((track) => (
          <div style={{ display: "flex", gap: 16 }}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
              width={80}
              height={80}
              alt={`image-${track.title}`}
            />
            <Link href={`/track/${track.title}-${track._id}.html?audio=${track.trackUrl}`}>
              <Typography component="p" variant="inherit">
                {track.title}
              </Typography>
            </Link>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default ClientSearch;
