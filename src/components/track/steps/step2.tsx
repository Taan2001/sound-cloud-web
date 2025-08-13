"use client";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import "./theme.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel({ trackUpload }: IStep2Props) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={trackUpload.percent} />
    </Box>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function InputFileUpload({ info, setInfo }: { info: INewTrack; setInfo: (value: INewTrack) => void }) {
  const toast = useToast();

  const { data: session } = useSession();

  const handleUpload = async (image: File) => {
    const formData = new FormData();
    formData.append("fileUpload", image);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          target_type: "images",
        },
      });
      setInfo({
        ...info,
        imageUrl: res.data.data.fileName,
      });
    } catch (error) {
      // @ts-ignore
      toast.error(error?.response?.data);
    }
  };
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      onChange={(e) => {
        const event = e.target as HTMLInputElement;

        if (event.files) {
          handleUpload(event.files[0]);
        }
      }}
    >
      Upload files
      <VisuallyHiddenInput type="file" onChange={(event) => console.log(event.target.files)} multiple />
    </Button>
  );
}

interface IStep2Props {
  setValue: React.Dispatch<React.SetStateAction<number>>;
  trackUpload: {
    filename: string;
    percent: number;
    uploadedTrackName: string;
  };
}

interface INewTrack {
  title: string;
  description: string;
  trackUrl: string;
  imageUrl: string;
  category: string;
}

const Step2 = ({ setValue, trackUpload }: IStep2Props) => {
  const { data: session } = useSession();

  const toast = useToast();

  const [info, setInfo] = useState<INewTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imageUrl: "",
    category: "",
  });

  useEffect(() => {
    if (trackUpload) {
      setInfo({ ...info, trackUrl: trackUpload.uploadedTrackName });
    }
  }, [trackUpload]);

  const categories = [
    {
      value: "CHILL",
      label: "CHILL",
    },
    {
      value: "WORKOUT",
      label: "WORKOUT",
    },
    {
      value: "PATRY",
      label: "PATRY",
    },
  ];

  const handleSubmitForm = async () => {
    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/`,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      method: "POST",
      body: {
        title: info.title,
        description: info.description,
        trackUrl: info.trackUrl,
        imgUrl: info.imageUrl,
        category: info.category,
      },
    });

    if (res.data) {
      toast.success("create success");
      setValue(0);
    } else {
      toast.error(res.message);
    }
  };
  return (
    <div>
      <div>
        <div>{trackUpload.filename}</div>
        <LinearWithValueLabel setValue={setValue} trackUpload={trackUpload} />
      </div>
      <Grid container spacing={2} mt={5}>
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ width: "80%", aspectRatio: 1 / 1, background: "#ccc" }}>
            <div>
              {info.imageUrl && (
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imageUrl}`}
                />
              )}
            </div>
          </div>
          <div>
            <InputFileUpload info={info} setInfo={setInfo} />
          </div>
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
            value={info?.title}
            label="Title"
            variant="standard"
            fullWidth
            margin="dense"
            onChange={(event) =>
              setInfo({
                ...info,
                title: event.target.value,
              })
            }
          />
          <TextField
            value={info?.description}
            label="Description"
            variant="standard"
            fullWidth
            margin="dense"
            onChange={(event) => {
              setInfo({
                ...info,
                description: event.target.value,
              });
            }}
          />
          <TextField
            value={info.category}
            sx={{
              mt: 3,
            }}
            id="outlined-select-currency"
            select
            label="Category"
            variant="standard"
            fullWidth
            onChange={(event) => {
              setInfo({
                ...info,
                category: event.target.value,
              });
            }}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            sx={{
              mt: 5,
            }}
            onClick={handleSubmitForm}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Step2;
