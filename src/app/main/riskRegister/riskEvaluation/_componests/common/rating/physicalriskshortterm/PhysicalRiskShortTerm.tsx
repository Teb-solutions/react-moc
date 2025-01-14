import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Button from "../../../../../common/Button";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import create from "zustand";
import { SeverityRatingTable } from "./SeverityRatingTable";
import PotentialRating from "./PotentialRating";
import ResidualRating from "./ResidualRating";


interface SubCategoryState {
  subCategory: string;
  setSubCategory: (subCategory: string) => void;
}

export const useSubCategoryStore = create<SubCategoryState>((set) => ({
  subCategory: subCategoryList.mechanical,
  setSubCategory: (subCategory) => set({ subCategory }),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

enum hazardTypeList {
  "ChemicalRisk" = "ChemicalRisk",
  "ChronicPhysicalRisk" = "ChronicPhysicalRisk",
  "BiologicalRisk" = "BiologicalRisk",
  "ErgonomicRisk" = "ErgonomicRisk",
  "PsychoSocialRisk" = "PsychoSocialRisk",
  "AccidentalPhysicalRisk" = "AccidentalPhysicalRisk",
}

export enum subCategoryList {
  "mechanical" = "mechanical",
  "traffic" = "traffic",
  "height" = "height",
  "heatcold" = "heatcold",
  "electricity" = "electricity",
  "pressure" = "pressure",
  "atmosphere" = "atmosphere",
}

const displaySubCategory = {
  [subCategoryList.mechanical]:
    "Assessment of risk associated with mechanical hazards",
  [subCategoryList.traffic]:
    "2	Assessment of risk associated with traffic and movements",
  [subCategoryList.height]: "Assessment of risk associated with height",
  [subCategoryList.heatcold]:
    "Assessment of risk associated with a heat/cold source",
  [subCategoryList.electricity]:
    "Assessment of risk associated with electricity",
  [subCategoryList.pressure]: "Assessment of risk associated with pressure",
  [subCategoryList.atmosphere]:
    "Assessment of risk associated with a confined atmosphere",
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
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
export default function TemporaryDrawer({
  hazardType,
}: {
  hazardType: string;
}) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <Button variant="approve" type="button" onClick={toggleDrawer(true)}>
        View Rating Calculator
      </Button>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} hazardType={hazardType} />
      </Drawer>
    </div>
  );
}

const DrawerList = ({
  toggleDrawer,
  hazardType,
}: {
  toggleDrawer: (newOpen: boolean) => () => void;
  hazardType: string;
}) => {
  const [value, setValue] = React.useState(0);
  const { subCategory, setSubCategory } = useSubCategoryStore();
  const [severityRating, setSeverityRating] = React.useState<number | null>(null);
  const [potentialRating, setPotentialRating] = React.useState<number | null>(null);
  const [residualRating, setResidualRating] = React.useState<number | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubCategoryChange = (event: SelectChangeEvent<string>) => {
    setSubCategory(event.target.value as string);
  };

  return (
    <Box sx={{ width: 800 }} className="p-10" role="presentation">
      <h2 className="bg-blue-500 text-white py-10 px-5">
        Assessment of {hazardType}
      </h2>
      <Divider />
      <FormControl fullWidth margin="normal">
        <InputLabel id="subCategory-label">Subcategory</InputLabel>
        <Select
          labelId="subCategory-label"
          value={subCategory}
          onChange={handleSubCategoryChange}
          label="Subcategory"
        >
          {Object.entries(subCategoryList).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {displaySubCategory[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons={false}
        aria-label="basic tabs example"
        className="w-full mt-10 px-10 -mx-4 min-h-40 mb-10"
        classes={{
          indicator:
            "flex justify-center bg-transparent border-b-3 border-red-500 w-full h-full",
        }}
      >
        <Tab label="Severity rating G" {...a11yProps(0)} />
        <Tab
          label="Potential exposure probability rating P"
          {...a11yProps(1)}
        />
        <Tab
          label="Residual potential exposure probability rating P'"
          {...a11yProps(2)}
        />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <SeverityRatingTable severityRating={severityRating} setSeverityRating={setSeverityRating} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PotentialRating potentialRating={potentialRating} setPotentialRating={setPotentialRating} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ResidualRating residualRating={residualRating} setResidualRating={setResidualRating} />
      </CustomTabPanel>
    </Box>
  );
};
