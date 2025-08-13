"use client";

import { FileWithPath, useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./theme.css";
import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { sendRequestFile } from "@/utils/api";

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

const Step1 = () => {
  const { data: session } = useSession();
  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      console.log(acceptedFiles);
      if (acceptedFiles && acceptedFiles[0]) {
        const audio = acceptedFiles[0];
        const formData = new FormData();
        formData.append("fileUpload", audio);

        const chills = await sendRequestFile<IBackendRes<ITrackTop[]>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "tracks",
          },
          body: formData,
        });
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
