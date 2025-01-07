import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Button from "../../../../common/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { array } from "prop-types";
import { useTaskStore } from "../taskStore";
import { useRatingStore } from "../ratingStore";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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
export default function BiologicalRisk({ hazardType }: { hazardType: string }) {
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
  enum hazardTypeList {
    "ChemicalRisk",
    "ChronicPhysicalRisk",
    "BiologicalRisk",
    "ErgonomicRisk",
    "PsychoSocialRisk",
    "AccidentalPhysicalRisk",
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ width: 800 }}
      className="p-10"
      role="presentation"
      //   onClick={toggleDrawer(false)}
    >
      <h2 className="bg-blue-500 text-white py-10 px-5">
        Assessment of {hazardType}
      </h2>
      <Divider />

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
        <PotentialProbability />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ReductionOfPTable />
      </CustomTabPanel>
    </Box>
  );
};

const SeverityRatingTable = () => {
  return (
    <table className="w-full border-collapse border">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="border py-10 px-4" rowSpan={2}>
            Severity
          </th>
          <th className="border py-10 px-4" rowSpan={2}>
            Rating G
          </th>
          <th className="border py-10 px-4" colSpan={2}>
            Chronic Effects
          </th>

          <th className="border py-10 px-4" colSpan={2}>
            Acute Effects
          </th>
        </tr>
        <tr>
          <th className="border py-10 px-4">Type of damage</th>
          <th className="border py-10 px-4">Examples of damage</th>
          <th className="border py-10 px-4">Type of damage</th>
          <th className="border py-10 px-4">Examples of damage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">
            Catastrophic
          </td>
          <td className="border py-4 px-4 font-bold text-center ">40*</td>
          <td className="border py-4 px-4 ">Several fatalities</td>
          <td className="border py-4 px-4"></td>
          <td className="border py-4 px-4">Several fatalities</td>
          <td className="border py-4 px-4">Ebola-type epidemic</td>
        </tr>
        <tr>
          <td className="border py-4 px-4 font-bold text-center ">Major</td>
          <td className="border py-4 px-4 font-bold text-center ">15</td>
          <td className="border py-4 px-4">Fatality or permanent disability</td>
          <td className="border py-4 px-4">Cancer, profound deafness</td>
          <td className="border py-4 px-4">Fatality or permanent disability</td>
          <td className="border py-4 px-4">Loss of the use of a limb</td>
        </tr>
        <tr>
          <td className="border py-4 px-4 font-bold text-center ">Serious</td>
          <td className="border py-4 px-4 font-bold text-center ">7</td>
          <td className="border py-4 px-4">
            Illness requiring a work stoppage permanent
          </td>
          <td className="border py-4 px-4">Cancer, profound deafness</td>
          <td className="border py-4 px-4">Incapacity for work</td>
          <td className="border py-4 px-4">Fracture, intoxication</td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">Moderate</td>
          <td className="border py-4 px-4 font-bold text-center ">3</td>
          <td className="border py-4 px-4">
            Illness not requiring a work stoppage
          </td>
          <td className="border py-4 px-4">
            Slight reduction in hearing ability
          </td>
          <td className="border py-4 px-4">
            No incapacity for work but medical treatment, adapted work
          </td>
          <td className="border py-4 px-4">
            Light sprain, spasm, cut with stitches, first-degree burn
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">Minor</td>
          <td className="border py-4 px-4 font-bold text-center ">1</td>
          <td className="border py-4 px-4">
            Symptoms not requiring outside care, localized discomfort
          </td>
          <td className="border py-4 px-4">
            Irritation, light muscle or joint pain
          </td>
          <td className="border py-4 px-4">First aid</td>
          <td className="border py-4 px-4">
            Pain, discomfort, irritation or wound that only requires first aid
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const PotentialProbability = () => {
  return (
    <table className="w-full border-collapse border">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="border py-10 px-4">Rating P</th>
          <th className="border py-10 px-4">
            Probability of potential exposure to a hazard that can have chronic
            effects
          </th>
          <th className="border py-10 px-4">
            Potential probability of the occurrence of an undesirable event
            (UEE) (acute effect)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">10</td>
          <td className="border py-4 px-4">
            Foreseeable exposure (In contact with the hazard)
          </td>
          <td className="border py-4 px-4">
            Near-accident situation ~ 1 UEE 1 time in 2 when the task is
            performed
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">6</td>
          <td className="border py-4 px-4">Exposure entirely possible</td>
          <td className="border py-4 px-4">~ 1 UEE every 10 tasks</td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">3</td>
          <td className="border py-4 px-4">Exposure unusual, uncommon</td>
          <td className="border py-4 px-4">~ 1 UEE every 100 tasks</td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">1</td>
          <td className="border py-4 px-4">Exposure rare</td>
          <td className="border py-4 px-4">
            ~ 1 undesirable event every 1000 tasks (~ 1 UEE observed on large
            site in five years)
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">0.5</td>
          <td className="border py-4 px-4">
            Exposure conceivable but improbable
          </td>
          <td className="border py-4 px-4">
            No UEE, observed on the site but observed in the Group
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">0.2</td>
          <td className="border py-4 px-4">Exposure practically impossible</td>
          <td className="border py-4 px-4">
            No UEE, observed on the site but observed in the profession
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">0.1</td>
          <td className="border py-4 px-4">Exposure impossible</td>
          <td className="border py-4 px-4">
            No UEE has ever been observed in the profession
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const ReductionOfPTable = () => {
  return (
    <table className="w-full border-collapse border">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="border py-10 px-4">
            Reduction D of the probability by level of P
          </th>
          <th className="border py-10 px-4">
            Means/measures of prevention/protection type (Mp type)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">0</td>
          <td className="border py-4 px-4">
            No means/measures of prevention/protection in place. OEL or AV
            (action value) exceeded.
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">-1</td>
          <td className="border py-4 px-4">
            At least two procedural or organizational measures from:
            <ul>
              <li>
                Organizational measures (breaks, shifts, restricted access)
              </li>
              <li>Operating modes</li>
              <li>Training</li>
              <li>
                Labelling, posters, signage, marking, signposting, detection
                systems
              </li>
              <li>
                PPE (personal protective equipment) adapted to the exposure
                route
              </li>
              <li>Adapted medical surveillance OR</li>
            </ul>
            Use of PPE with training covering the following topics:
            <ul>
              <li>
                How to select the PPE to ensure it is adapted to the employee
              </li>
              <li>Understanding the limits of its use</li>
              <li>Knowing how to put it on, take it up and when it changes</li>
              <li>Knowing how to clean and store it</li>
              <li>AND checks of proper PPE use by the hierarchy</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">-2</td>
          <td className="border py-4 px-4">
            Technical adaptation of the workplace to significantly reduce the
            risks:
            <ul>
              <li>Collective protection equipment</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">-3</td>
          <td className="border py-4 px-4">
            Technical adaptation of the workplace to completely eliminate or
            drastically reduce the risks:
            <ul>
              <li>Containment of the risk</li>
              <li>
                Fixed collective protection equipment that reduces the risk to a
                negligible level.
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
