import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
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

const SeverityRatingTable = ({
  severityRating,
  setSeverityRating,
}: {
  severityRating: number | null;
  setSeverityRating: (rating: number) => void;
}) => {
  const handleRowClick = (rating: number) => {
    setSeverityRating(rating);
  };

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
        <tr
          onClick={() => handleRowClick(40)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 40 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center font-bold">
            Catastrophic
          </td>
          <td className="border py-4 px-4 text-red-500 font-bold text-center">
            40*
          </td>
          <td className="border py-4 px-4">Several fatalities</td>
          <td className="border py-4 px-4"></td>
          <td className="border py-4 px-4">Several fatalities</td>
          <td className="border py-4 px-4">Ebola-type epidemic</td>
        </tr>
        <tr
          onClick={() => handleRowClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 font-bold text-center">Major</td>
          <td className="border py-4 px-4 text-orange-500 font-bold text-center">
            15
          </td>
          <td className="border py-4 px-4">Fatality or permanent disability</td>
          <td className="border py-4 px-4">Cancer, profound deafness</td>
          <td className="border py-4 px-4">Fatality or permanent disability</td>
          <td className="border py-4 px-4">Loss of the use of a limb</td>
        </tr>
        <tr
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 font-bold text-center">Serious</td>
          <td className="border py-4 px-4 text-amber-500 font-bold text-center">
            7
          </td>
          <td className="border py-4 px-4">
            Illness requiring a work stoppage but without permanent disability
          </td>
          <td className="border py-4 px-4">PTSD, MSDs</td>
          <td className="border py-4 px-4">Temperory Incapacity for work</td>
          <td className="border py-4 px-4">
            Fracture, intoxication, second degree burn, lumbago
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center font-bold">Moderate</td>
          <td className="border py-4 px-4 text-yellow-500 font-bold text-center">
            3
          </td>
          <td className="border py-4 px-4">
            Illness not requiring a work stoppage
          </td>
          <td className="border py-4 px-4">
            Slight reduction in hearing ability
          </td>
          <td className="border py-4 px-4">
            No incapacity for work but medical treatmnet, adapted work
          </td>
          <td className="border py-4 px-4">
            Light sprain, spasm, cut with stitches, first degree burn
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center font-bold">Minor</td>
          <td className="border py-4 px-4 text-green-500 font-bold text-center">
            1
          </td>
          <td className="border py-4 px-4">
            Symptoms not requiringoutside carem localised disomfort
          </td>
          <td className="border py-4 px-4">
            Irritation, Light muscle or join pain, eyestrain
          </td>
          <td className="border py-4 px-4">First aid</td>
          <td className="border py-4 px-4">
            Pain, discomfort, irritation or wound that only require first aid
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const PotentialProbability = ({
  potentialRating,
  setPotentialRating,
}: {
  potentialRating: number | null;
  setPotentialRating: (rating: number) => void;
}) => {
  const handleRowClick = (rating: number) => {
    setPotentialRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="border py-10 px-4">Rating P</th>
          <th className="border py-10 px-4">Probability</th>
          <th className="border py-10 px-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleRowClick(10)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">10</td>
          <td className="border py-4 px-4">
            Foreseeable exposure (In contact with the hazard)
          </td>
          <td className="border py-4 px-4">
            Near-accident situation <br />~ 1 UEE 1 time in 2 when the task is
            performed
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">6</td>
          <td className="border py-4 px-4">Exposure entirely possible</td>
          <td className="border py-4 px-4">~ 1 UEE every 10 tasks</td>
        </tr>
        <tr
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">3</td>
          <td className="border py-4 px-4">Exposure unusual, uncommon</td>
          <td className="border py-4 px-4">~ 1 UEE every 100 tasks</td>
        </tr>
        <tr
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">1</td>
          <td className="border py-4 px-4">Exposure rare</td>
          <td className="border py-4 px-4">
            ~ 1 undesirable event every 1000 tasks <br />
            (~ 1 UEE observed on large site in five years)
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(0.5)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 0.5 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">0.5</td>
          <td className="border py-4 px-4">
            Exposure conceivable but improbable
          </td>
          <td className="border py-4 px-4">
            No UEE, observed on the site but observed in the Group
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(0.2)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 0.2 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">0.2</td>
          <td className="border py-4 px-4">Exposure practically impossible</td>
          <td className="border py-4 px-4">
            No UEE, observed on the site but observed in the profession
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(0.1)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 0.1 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">0.1</td>
          <td className="border py-4 px-4">Exposure impossible</td>
          <td className="border py-4 px-4">
            No UEE has ever been observed in the profession
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const ReductionOfPTable = ({
  residualRating,
  setResidualRating,
}: {
  residualRating: number | null;
  setResidualRating: (rating: number) => void;
}) => {
  const handleRowClick = (rating: number) => {
    setResidualRating(rating);
  };

  return (
    <table className="w-full border-collapse border">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="border py-10 px-4">Reduction of P</th>
          <th className="border py-10 px-4">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr
          onClick={() => handleRowClick(0)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === 0 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">0</td>
          <td className="border py-4 px-4">
            No means/measures of prevention/protection in place
            <br />
            OEL or AV (action value) exceeded.
          </td>
          <td className="border py-4 px-4"></td>
        </tr>
        <tr
          onClick={() => handleRowClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">-1</td>
          <td className="border py-4 px-4">
            <strong>
              At least two procedural or organizational measures from:
            </strong>
            <br />
            - Organizational measures (breaks, shifts, restricted access)
            <br />
            - Operating modes
            <br />
            - Training
            <br />
            - Labelling, posters, signage, marking, signposting, detection
            systems
            <br />
            - PPE (personal protective equipment) adapted to the exposure route
            <br />
            - Adapted medical surveillance
            <br />
            OR
            <br />
            <strong>
              Use of PPE with training covering the following topics:
            </strong>
            <br />
            - How to select the PPE to ensure it is adapted to the employee
            <br />
            - Understanding the limits of its use
            <br />
            - Knowing how to put it on, take it up and when it changes
            <br />
            - Knowing how to clean and store it
            <br />
            AND checks of proper PPE use by the hierarchy
            <br />
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">-2</td>
          <td className="border py-4 px-4">
            <strong>
              Technical adaptation of the workplace to significantly reduce the
              risks:
            </strong>
            <br />- Collective protection equipment
          </td>
        </tr>
        <tr
          onClick={() => handleRowClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? "bg-blue-100" : ""}`}
        >
          <td className="border py-4 px-4 text-center">-3</td>
          <td className="border py-4 px-4">
            <strong>
              Technical adaptation of the workplace to completely eliminate or
              drastically reduce the risks:
            </strong>
            <br />
            - Containment of the risk
            <br />- Fixed collective protection equipment that reduces the risk
            to a negligible level.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default function OccupationalRisk({
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
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <DrawerList toggleDrawer={toggleDrawer} hazardType={hazardType} />
      </SwipeableDrawer>
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
  const {
    severityRating,
    setSeverityRating,
    potentialProbabilityRating,
    setPotentialProbabilityRating,
    residualProbabilityRating,
    setResidualProbabilityRating,
  } = useRatingStore();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 800 }} className="p-10" role="presentation">
      <h2 className="bg-blue-500 text-white py-10 px-5">
        Assessment of {hazardType}
      </h2>
      <Divider />

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        indicatorColor="secondary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons={false}
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
        <SeverityRatingTable
          severityRating={severityRating}
          setSeverityRating={setSeverityRating}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PotentialProbability
          potentialRating={potentialProbabilityRating}
          setPotentialRating={setPotentialProbabilityRating}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ReductionOfPTable
          residualRating={residualProbabilityRating}
          setResidualRating={setResidualProbabilityRating}
        />
      </CustomTabPanel>
    </Box>
  );
};
