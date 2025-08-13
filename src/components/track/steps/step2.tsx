"use client";
import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

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

function InputFileUpload() {
  return (
    <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
      Upload files
      <VisuallyHiddenInput type="file" onChange={(event) => console.log(event.target.files)} multiple />
    </Button>
  );
}

interface IStep2Props {
  trackUpload: {
    filename: string;
    percent: number;
  };
}

const Step2 = ({ trackUpload }: IStep2Props) => {
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

  return (
    <div>
      <div>
        <div>{trackUpload.filename}</div>
        <LinearWithValueLabel trackUpload={trackUpload} />
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
            <div></div>
          </div>
          <div>
            <InputFileUpload />
          </div>
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField id="standard-basic" label="Title" variant="standard" fullWidth margin="dense" />
          <TextField id="standard-basic" label="Description" variant="standard" fullWidth margin="dense" />
          <TextField
            sx={{
              mt: 3,
            }}
            id="outlined-select-currency"
            select
            label="Category"
            variant="standard"
            fullWidth
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
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Step2;
