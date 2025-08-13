"use client";
import { Container } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as React from "react";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UploadTabs = () => {
  const [value, setValue] = React.useState(0);
  const [trackUpload, setTrackUpload] = React.useState({
    filename: "",
    percent: 0,
    uploadedTrackName: "",
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container
      sx={{
        marginTop: "100px",
        border: "1px solid #ddd",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="TRACKS" {...a11yProps(0)} disabled={value !== 0} />
            <Tab label="BASIC INFORMATION" {...a11yProps(1)} disabled={value !== 1} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Step1 setValue={setValue} setTrackUpload={setTrackUpload} trackUpload={trackUpload} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Step2 setValue={setValue} trackUpload={trackUpload} />
        </CustomTabPanel>
      </Box>
    </Container>
  );
};

export default UploadTabs;
