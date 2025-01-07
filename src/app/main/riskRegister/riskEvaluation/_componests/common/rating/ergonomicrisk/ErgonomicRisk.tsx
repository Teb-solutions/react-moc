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
import { PotentialRatingTable } from "./PotentialRating";
import { ResidualRatingTable } from "./ResidualRating";
// import Noise from "./severity/Noise";
// import TableComponent from "./TableComponent";

interface SubCategoryState {
  subCategory: string;
  setSubCategory: (subCategory: string) => void;
}

export const useSubCategoryStore = create<SubCategoryState>((set) => ({
  subCategory: subCategoryList.manualloadhandlingunitmass,
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
  "ShortTermPhysicalRisk" = "ShortTermPhysicalRisk",
  "BiologicalRisk" = "BiologicalRisk",
  "ErgonomicRisk" = "ErgonomicRisk",
  "PsychoSocialRisk" = "PsychoSocialRisk",
  "AccidentalPhysicalRisk" = "AccidentalPhysicalRisk",
}

export enum subCategoryList {
  "manualloadhandlingunitmass" = "manualloadhandlingunitmass",
  "manualloadhandlingpushpull" = "manualloadhandlingpushpull",
  "posturestrain" = "posturestrain",
  "repetitivemovement" = "repetitivemovement",
  "static" = "static",
  "workatmosphere" = "workatmosphere",
}

const displaySubCategory = {
  [subCategoryList.manualloadhandlingunitmass]:
    "Dynamic work: Manual load handling - unit mass and tonnage",
  [subCategoryList.manualloadhandlingpushpull]:
    "Dynamic work: Manual load handling - pushing/pulling",
  [subCategoryList.posturestrain]:
    "Dynamic work: Posture strains: work postures",
  [subCategoryList.repetitivemovement]: "Dynamic work: Repetitive movements",
  [subCategoryList.static]:
    "Static work (work at screen, seated work to work accurately)",
  [subCategoryList.workatmosphere]: "Work atmosphere (inside)",
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
          label="Residual potential exposure probability rating P’"
          {...a11yProps(2)}
        />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <SeverityRatingTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PotentialRatingTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ResidualRatingTable />
      </CustomTabPanel>
    </Box>
  );
};
