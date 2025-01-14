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

const SeverityRatingTable = () => {
  const { severityRating, setSeverityRating } = useRatingStore();

  const handleRowClick = (rating: number) => {
    setSeverityRating(rating);
  };

  return (
    <TableContainer component={Paper} className="border border-gray-300 shadow-none rounded-none">
      <Table>
        <TableHead>
          <TableRow className="bg-blue-400">
            <TableCell className="text-white border border-gray-300">Rating G</TableCell>
            <TableCell className="text-white border border-gray-300">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow 
            onClick={() => handleRowClick(1)}
            className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">1</TableCell>
            <TableCell className="border border-gray-300">Mild infection, mild allergy</TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(3)}
            className={`cursor-pointer hover:bg-gray-100 ${severityRating === 3 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">3</TableCell>
            <TableCell className="border border-gray-300">Moderate infection, moderate allergy</TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(7)}
            className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">7</TableCell>
            <TableCell className="border border-gray-300">Severe infection, severe allergy</TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(15)}
            className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">15</TableCell>
            <TableCell className="border border-gray-300">Life-threatening infection, life-threatening allergy</TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(40)}
            className={`cursor-pointer hover:bg-gray-100 ${severityRating === 40 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">40</TableCell>
            <TableCell className="border border-gray-300">Fatal infection, fatal allergy</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PotentialProbability = () => {
  const { potentialProbabilityRating, setPotentialProbabilityRating } = useRatingStore();

  const handleRowClick = (rating: number) => {
    setPotentialProbabilityRating(rating);
  };

  return (
    <TableContainer component={Paper} className="border border-gray-300 shadow-none rounded-none">
      <Table>
        <TableHead>
          <TableRow className="bg-blue-400">
            <TableCell className="text-white border border-gray-300">Rating P</TableCell>
            <TableCell className="text-white border border-gray-300">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow 
            onClick={() => handleRowClick(0.5)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 0.5 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">0.5</TableCell>
            <TableCell className="border border-gray-300">Very unlikely exposure</TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(1)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 1 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">1</TableCell>
            <TableCell className="border border-gray-300">Unlikely exposure</TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(2)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 2 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">2</TableCell>
            <TableCell className="border border-gray-300">Occasional exposure</TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(5)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 5 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">5</TableCell>
            <TableCell className="border border-gray-300">Frequent exposure</TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(10)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 10 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">10</TableCell>
            <TableCell className="border border-gray-300">Permanent exposure</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ReductionOfPTable = () => {
  const { residualProbabilityRating, setResidualProbabilityRating } = useRatingStore();
  const [selectedReduction, setSelectedReduction] = React.useState<number | null>(residualProbabilityRating);

  const handleRowClick = (reduction: number) => {
    setSelectedReduction(reduction);
    setResidualProbabilityRating(reduction);
  };

  return (
    <TableContainer component={Paper} className="border border-gray-300 shadow-none rounded-none">
      <Table>
        <TableHead>
          <TableRow className="bg-blue-400">
            <TableCell className="text-white border border-gray-300">Reduction of P</TableCell>
            <TableCell className="text-white border border-gray-300">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow 
            onClick={() => handleRowClick(-1)}
            className={`cursor-pointer hover:bg-gray-100 ${selectedReduction === -1 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">-1</TableCell>
            <TableCell className="border border-gray-300">
              <strong>At least two procedural or organizational measures from:</strong>
              <ul>
                <li>See Mp-type matrix</li>
                <li>Signage, regular audit, inspections, etc.</li>
                <li>Wearing appropriate PPE</li>
                <li>Training on biological risks</li>
              </ul>
            </TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(-2)}
            className={`cursor-pointer hover:bg-gray-100 ${selectedReduction === -2 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">-2</TableCell>
            <TableCell className="border border-gray-300">
              <ul>
                <li>Collective protection (ventilation, etc.)</li>
                <li>Specific PPE (gloves, masks, etc.)</li>
                <li>Regular cleaning and disinfection</li>
              </ul>
            </TableCell>
          </TableRow>
          <TableRow 
            onClick={() => handleRowClick(-3)}
            className={`cursor-pointer hover:bg-gray-100 ${selectedReduction === -3 ? 'bg-blue-100' : ''}`}
          >
            <TableCell className="border border-gray-300">-3</TableCell>
            <TableCell className="border border-gray-300">
              <ul>
                <li>Complete elimination of biological risk</li>
                <li>Fully automated process</li>
                <li>Remote operation</li>
              </ul>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

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
  const [value, setValue] = React.useState(0);

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
        className="w-full mt-10 px-10 -mx-4 min-h-40 mb-10"
        classes={{
          indicator:
            "flex justify-center bg-transparent border-b-3 border-red-500 w-full h-full",
        }}
      >
        <Tab label="Severity rating G" {...a11yProps(0)} />
        <Tab label="Potential exposure probability rating P" {...a11yProps(1)} />
        <Tab label="Residual potential exposure probability rating P'" {...a11yProps(2)} />
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
