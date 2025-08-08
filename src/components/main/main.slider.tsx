"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Link from "next/link";

interface IMainSliderProps {
  title: string;
  data: ITrackTop[];
}

export default function MainSlider({ data, title }: IMainSliderProps) {
  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          right: 0,
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronRightIcon />
      </Button>
    );
  };

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <Button
        color="inherit"
        variant="contained"
        onClick={props.onClick}
        sx={{
          position: "absolute",
          left: 0,
          top: "20%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
      >
        <ChevronLeftIcon />
      </Button>
    );
  };

  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <Box
      sx={{
        margin: "0 50px",
        ".track": {
          padding: "0 10px",

          img: {
            height: 150,
            width: 150,
          },
          a: {
            textDecoration: "none",
            color: "inherit",
          },
        },
      }}
    >
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((track) => (
          <div key={track._id} className="track">
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
              alt={track.title}
            />
            <Link href={`/track/${track._id}/?audio=${track.trackUrl}`}>
              <h4>{track.title}</h4>
            </Link>
            <p>{track.description}</p>
          </div>
        ))}
      </Slider>
      <Divider />
    </Box>
  );
}
