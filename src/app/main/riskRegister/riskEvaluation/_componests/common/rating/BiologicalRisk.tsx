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
    <TableContainer
      component={Paper}
      className="border border-gray-300 shadow-none rounded-none"
    >
      <Table>
        <TableHead>
          <TableRow className="bg-blue-400">
            <TableCell className="text-white border border-gray-300">
              Rating G
            </TableCell>
            <TableCell className="text-white border border-gray-300">
              Description
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            onClick={() => handleRowClick(40)}
            className={`cursor-pointer hover:bg-gray-100 ${severityRating === 40 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold text-red-500 border-gray-300">
              40
            </TableCell>
            <TableCell className="border border-gray-300">
              Biological agents that cause serious diseases in humans and
              constitute a serious hazard for workers; the risk of propagation
              in the community is high; there is generally no prophylaxis or
              effective treatment.
              <br />
              E.g. Ebola, avian flu…
            </TableCell>
          </TableRow>
          <TableRow
            onClick={() => handleRowClick(15)}
            className={`cursor-pointer hover:bg-gray-100 ${severityRating === 15 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold  text-orange-500 border-gray-300">
              15
            </TableCell>
            <TableCell className="border border-gray-300">
              Biological agents that can cause a disease in humans and
              constitute a hazard for workers; their propagation in the
              community is unlikely, but there is generally a prophylaxis or
              effective treatment. <br />
              E.g. legionella, diphtheria, tetanus, hepatitis A, zika virus,
              measles, cholera, seasonal flu, herpes, scabies, turista,
              salmonella, listeria, biotoxins (molds), common illnesses:
              mycosis…
              <br />
              <br />
              Animals with potentially lethal venomous bites or stings (cobra,
              some species of scorpion or jellyfish...)
            </TableCell>
          </TableRow>

          <TableRow
            onClick={() => handleRowClick(7)}
            className={`cursor-pointer hover:bg-gray-100 ${severityRating === 7 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold text-amber-500 border-gray-300">
              7
            </TableCell>
            <TableCell className="border border-gray-300">
              Biological agents that can cause a disease in humans and
              constitute a hazard for workers; their propagation in the
              community is unlikely, but there is generally a prophylaxis or
              effective treatment.
              <br />
              E.g. legionella, diphtheria, tetanus, hepatitis A, zika virus,
              measles, cholera, seasonal flu, herpes, scabies, turista,
              salmonella, listeria, biotoxins (molds), common illnesses:
              mycosis…
              <br />
              <br />
              Animals with bites/stings that trigger an allergic reaction
              (wasps, bees, caterpillars, centipedes, bedbugs) or an infection
              (dogs1, monitors etc.).
            </TableCell>
          </TableRow>
          <TableRow
            onClick={() => handleRowClick(1)}
            className={`cursor-pointer hover:bg-gray-100 ${severityRating === 1 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold text-green-500 border-gray-300">
              1
            </TableCell>
            <TableCell className="border border-gray-300">
              Biological agents not likely to cause disease in humans. <br />
              E.g. baker’s yeast
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PotentialProbability = () => {
  const { potentialProbabilityRating, setPotentialProbabilityRating } =
    useRatingStore();

  const handleRowClick = (rating: number) => {
    setPotentialProbabilityRating(rating);
  };

  return (
    <TableContainer
      component={Paper}
      className="border border-gray-300 shadow-none rounded-none"
    >
      <Table>
        <TableHead>
          <TableRow className="bg-blue-400">
            <TableCell className="text-white border border-gray-300">
              Rating P
            </TableCell>
            <TableCell className="text-white border border-gray-300">
            Probability of potential exposure to biological sources 
            that can have effects
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            onClick={() => handleRowClick(10)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 10 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold border-gray-300">
              10
            </TableCell>
            <TableCell className="border border-gray-300">
              <strong>
                Activities with a very probable source of biological
                contamination:
              </strong>
              <br />
              - Sanitary hot water systems with accumulator and return circuit
              and/or presence of dead legs
              <br />
              - Aero-refrigerant towers
              <br />
              - Conditioned water systems with constant agitation and recycling
              through high-speed jets or air injection
              <br />
              - Maintenance work (unblocking sanitation pipes, etc.)
              <br />- Work in residual / sanitary water purification plants
            </TableCell>
          </TableRow>

          <TableRow
            onClick={() => handleRowClick(6)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 6 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border  font-bold border-gray-300">
              6
            </TableCell>
            <TableCell className="border border-gray-300">
              Work in areas where running water is not drinkable. <br />
              <br />
              Work in the bush and in areas that are highly contaminated by
              microorganisms carried by mosquitoes, etc.{" "}
            </TableCell>
          </TableRow>
          <TableRow
            onClick={() => handleRowClick(3)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 3 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold border-gray-300">
              3
            </TableCell>
            <TableCell colSpan={4} className="border border-gray-300">
              Work beyond the bush in areas contaminated by microorganisms
              carried by mosquitoes, etc. <br />
              Activities with a certain source of biological contamination:{" "}
              <br />
              <br />
              - Work in the kitchens: contact with contaminated waste,
              contaminated food (take account of bacteriological checks)
              <br />
              - Internal installation systems of cold water for human
              consumption (pipes, tanks) fixed and mobile tanks and sanitary hot
              water without return circuit
              <br />
              - Maintenance of ventilation and air-conditioning systems
              <br />
              - Cleaning of sanitary systems (toilets)
              <br />- Sanitary assistance work (contact with patients, handling
              of samples)
            </TableCell>
          </TableRow>
          <TableRow
            onClick={() => handleRowClick(1)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 1 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold border-gray-300">
              1
            </TableCell>
            <TableCell className="border border-gray-300">
              Refer above
            </TableCell>
          </TableRow>
          <TableRow
            onClick={() => handleRowClick(0.5)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 0.5 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold border-gray-300">
              0.5
            </TableCell>
            <TableCell className="border border-gray-300">
              Refer above
            </TableCell>
          </TableRow>
          <TableRow
            onClick={() => handleRowClick(0.2)}
            className={`cursor-pointer hover:bg-gray-100 ${potentialProbabilityRating === 0.2 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold border-gray-300">
              0.2
            </TableCell>
            <TableCell className="border border-gray-300">
              Activities without a possible source of biological contamination
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ReductionOfPTable = () => {
  const { residualProbabilityRating, setResidualProbabilityRating } =
    useRatingStore();
  const [selectedReduction, setSelectedReduction] = React.useState<
    number | null
  >(residualProbabilityRating);

  const handleRowClick = (reduction: number) => {
    setSelectedReduction(reduction);
    setResidualProbabilityRating(reduction);
  };

  return (
    <TableContainer
      component={Paper}
      className="border border-gray-300 shadow-none rounded-none"
    >
      <Table>
        <TableHead>
          <TableRow className="bg-blue-400">
            <TableCell className="text-white border border-gray-300">
              Reduction of P
            </TableCell>
            <TableCell className="text-white border border-gray-300">
            Means/measures of prevention/protection
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            onClick={() => handleRowClick(-1)}
            className={`cursor-pointer hover:bg-gray-100 ${selectedReduction === -1 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold border-gray-300">-1</TableCell>
            <TableCell className="border border-gray-300">
              <strong>
                At least two procedural or organizational measures from:
              </strong>
              <ul>
                - Hygiene instructions (regularly washing hands, cleaning and
                disinfecting contaminated surfaces, smoking, eating and drinking
                ban in high-risk areas, protecting wounds, food instructions,
                ventilating spaces), signage (marking out the area),
                instructions in case of incidents (sting, cut, bite), preventive
                medical consultation OR
                <br />- Use of specific PPE (FPP3-type respirators, gloves and
                protective bodywear).
                <br />
                <br />
                For malaria: Air-conditioning, mosquito net, repellents, full
                light-coloured clothing protecting the whole body, preventive
                chemo-prophylaxis
                <br />
                For the legionella risk: intermittent bacterial treatment and
                monitoring of water treatment at least every three months,
                thermal treatment of sanitary water once a year.
                <br />
                For meningitis, plague etc.: specific hygiene rules to be
                followed (space between people
              </ul>
            </TableCell>
          </TableRow>
          <TableRow
            onClick={() => handleRowClick(-2)}
            className={`cursor-pointer hover:bg-gray-100 ${selectedReduction === -2 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold border-gray-300">-2</TableCell>
            <TableCell className="border border-gray-300">
              <ul>
                - Use of high-quality PPE (FPP3 masks for activities of short
                duration or powered air purifying masks for activities of long
                duration), sealed combination, eye protection, hand protection
                (gloves with biological resistance etc.) + operating modes in
                place
                <br />- Technical measures for the reduction in the emission of
                aerosols in certain activities: high-pressure cleaning,
                aero-refrigerant towers (presence of drop screen etc.).
                <br />- Preventive vaccination.
              </ul>
            </TableCell>
          </TableRow>
          <TableRow
            onClick={() => handleRowClick(-3)}
            className={`cursor-pointer hover:bg-gray-100 ${selectedReduction === -3 ? "bg-blue-100" : ""}`}
          >
            <TableCell className="border font-bold border-gray-300">-3</TableCell>
            <TableCell className="border border-gray-300">
              <ul>
                - Closing of the area and removal of workers from the area
                <br />- Complete isolation of the operator
                <br />
                <br />
                For the legionella risk: good design and appropriate management
                of equipment (filtering of exhaled air, absence of dead legs,
                sufficiently high speed of water circulation etc.), continual
                bacterial treatment systems and regular monitoring of water
                treatment at least every month, thermal treatment of sanitary
                water at least three times a year.
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
