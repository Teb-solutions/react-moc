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

const SeverityRatingTable = ({ severityRating, setSeverityRating }: { severityRating: number | null, setSeverityRating: (rating: number) => void }) => {
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
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 40 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center font-bold">
            Catastrophic
          </td>
          <td className="border py-4 px-4 font-bold text-center">40*</td>
          <td className="border py-4 px-4">Several fatalities</td>
          <td className="border py-4 px-4"></td>
          <td className="border py-4 px-4">Several fatalities</td>
          <td className="border py-4 px-4">Ebola-type epidemic</td>
        </tr>
        <tr 
          onClick={() => handleRowClick(15)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 font-bold text-center">Major</td>
          <td className="border py-4 px-4 font-bold text-center">15</td>
          <td className="border py-4 px-4">Fatality or permanent disability</td>
          <td className="border py-4 px-4">Cancer, profound deafness</td>
          <td className="border py-4 px-4">Fatality or permanent disability</td>
          <td className="border py-4 px-4">Loss of the use of a limb</td>
        </tr>
        <tr 
          onClick={() => handleRowClick(7)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 font-bold text-center">Serious</td>
          <td className="border py-4 px-4 font-bold text-center">7</td>
          <td className="border py-4 px-4">
            Illness requiring a work stoppage permanent
          </td>
          <td className="border py-4 px-4">Cancer, profound deafness</td>
          <td className="border py-4 px-4">Incapacity for work</td>
          <td className="border py-4 px-4">Fracture, intoxication</td>
        </tr>
        <tr 
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center font-bold">Moderate</td>
          <td className="border py-4 px-4 font-bold text-center">3</td>
          <td className="border py-4 px-4">
            Illness not requiring a work stoppage
          </td>
          <td className="border py-4 px-4">
            Slight reduction in hearing ability
          </td>
          <td className="border py-4 px-4">Injury requiring first aid</td>
          <td className="border py-4 px-4">Cut, bruise</td>
        </tr>
        <tr 
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center font-bold">Minor</td>
          <td className="border py-4 px-4 font-bold text-center">1</td>
          <td className="border py-4 px-4">No effect on health</td>
          <td className="border py-4 px-4"></td>
          <td className="border py-4 px-4">No injury</td>
          <td className="border py-4 px-4">Discomfort</td>
        </tr>
      </tbody>
    </table>
  );
};

const PotentialProbability = ({ potentialRating, setPotentialRating }: { potentialRating: number | null, setPotentialRating: (rating: number) => void }) => {
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
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 10 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center">10</td>
          <td className="border py-4 px-4">Very high</td>
          <td className="border py-4 px-4">
            Permanent exposure to hazard
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(6)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 6 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center">6</td>
          <td className="border py-4 px-4">High</td>
          <td className="border py-4 px-4">
            Daily exposure to hazard
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(3)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center">3</td>
          <td className="border py-4 px-4">Medium</td>
          <td className="border py-4 px-4">
            Weekly exposure to hazard
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(2)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 2 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center">2</td>
          <td className="border py-4 px-4">Low</td>
          <td className="border py-4 px-4">
            Monthly exposure to hazard
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(1)}
          className={`cursor-pointer hover:bg-gray-100 ${potentialRating === 1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center">1</td>
          <td className="border py-4 px-4">Very low</td>
          <td className="border py-4 px-4">
            Yearly exposure to hazard
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const ReductionOfPTable = ({ residualRating, setResidualRating }: { residualRating: number | null, setResidualRating: (rating: number) => void }) => {
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
          onClick={() => handleRowClick(-1)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -1 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center">-1</td>
          <td className="border py-4 px-4">
            <strong>At least two procedural or organizational measures from:</strong>
            <ul>
              <li>Training and awareness</li>
              <li>Regular inspections and maintenance</li>
              <li>Personal protective equipment (PPE)</li>
              <li>Safety signage and warnings</li>
            </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-2)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -2 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center">-2</td>
          <td className="border py-4 px-4">
            <ul>
              <li>Engineering controls</li>
              <li>Isolation or enclosure of hazard</li>
              <li>Advanced PPE and safety systems</li>
            </ul>
          </td>
        </tr>
        <tr 
          onClick={() => handleRowClick(-3)}
          className={`cursor-pointer hover:bg-gray-100 ${residualRating === -3 ? 'bg-blue-100' : ''}`}
        >
          <td className="border py-4 px-4 text-center">-3</td>
          <td className="border py-4 px-4">
            <ul>
              <li>Elimination of hazard</li>
              <li>Complete automation of process</li>
              <li>Remote operation</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default function OccupationalRisk({ hazardType }: { hazardType: string }) {
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
  const [severityRating, setSeverityRating] = React.useState<number | null>(null);
  const [potentialRating, setPotentialRating] = React.useState<number | null>(null);
  const [residualRating, setResidualRating] = React.useState<number | null>(null);

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
        className="w-full mt-10 px-10 -mx-4 min-h-40 mb-10"
      >
        <Tab label="Severity rating G" {...a11yProps(0)} />
        <Tab label="Potential exposure probability rating P" {...a11yProps(1)} />
        <Tab label="Residual potential exposure probability rating P'" {...a11yProps(2)} />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <SeverityRatingTable severityRating={severityRating} setSeverityRating={setSeverityRating} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PotentialProbability potentialRating={potentialRating} setPotentialRating={setPotentialRating} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ReductionOfPTable residualRating={residualRating} setResidualRating={setResidualRating} />
      </CustomTabPanel>
    </Box>
  );
};
