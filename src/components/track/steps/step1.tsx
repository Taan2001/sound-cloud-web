"use client";

import { FileWithPath, useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./theme.css";
import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { sendRequestFile } from "@/utils/api";
import axios from "axios";

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
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      onClick={(event) => event.preventDefault()}
    >
      Upload files
      <VisuallyHiddenInput type="file" onChange={(event) => console.log(event.target.files)} multiple />
    </Button>
  );
}

interface IStep1Props {
  setValue: (value: number) => void;
  setTrackUpload: (value: { filename: string; percent: number }) => void;
}

const Step1 = ({ setValue, setTrackUpload }: IStep1Props) => {
  const { data: session } = useSession();
  const [percent, setPercent] = useState(0);
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      setValue(1);

      if (acceptedFiles && acceptedFiles[0]) {
        const audio = acceptedFiles[0];
        const formData = new FormData();
        formData.append("fileUpload", audio);

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`, formData, {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
              target_type: "tracks",
              delay: 5000,
            },
            onUploadProgress: (progressEvent) => {
              let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!);
              setTrackUpload({
                filename: acceptedFiles[0].name,
                percent: percentCompleted,
              });
            },
          });

          console.log(">>> check res:", res.data.data.filename);
        } catch (error) {
          // @ts-ignore
          alert(error?.response?.data);
        }
      }
    },
    [session]
  );
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      audio: [".mp3", ".m4a"],
    },
  });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <InputFileUpload />
        <p>Click or Drap/Frop to upload the track file!</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};

export default Step1;
