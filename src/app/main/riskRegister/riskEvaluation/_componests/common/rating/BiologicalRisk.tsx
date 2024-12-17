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
  const rows = [
    {
      rating: 40,
      group: "Group 4",
      description:
        "Biological agents that cause serious diseases in humans and constitute a serious hazard for workers; the risk of propagation in the community is high; no prophylaxis or effective treatment.",
      examples: "Ebola, avian flu",
    },
    {
      rating: 15,
      group: "Group 3",
      description:
        "Biological agents that can cause serious diseases in humans and constitute a serious hazard for workers; the risk of propagation in the community exists, but there is generally a prophylaxis or effective treatment.",
      examples:
        "HIV, hepatitis B, C, E, malaria, chikungunya, dengue, salmonella (typhoid fever), yellow fever, rabies, tuberculosis, influenza (H1N1)",
    },
    {
      rating: 7,
      group: "Group 2",
      description:
        "Biological agents that can cause a disease in humans and constitute a hazard for workers; their propagation in the community is unlikely, but there is generally a prophylaxis or effective treatment.",
      examples:
        "Legionella, diphtheria, tetanus, hepatitis A, zika virus, measles, cholera, seasonal flu, herpes, scabies, turista, salmonella, listeria, biotoxins (molds), common illnesses like mycosis",
    },
    {
      rating: 1,
      group: "Group 1",
      description: "Biological agents not likely to cause disease in humans.",
      examples: "Baker’s yeast",
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table className="border-1">
        <TableHead className="bg-blue-100 text-white">
          <TableRow>
            <TableCell>
              <strong>Rating</strong>
            </TableCell>
            <TableCell>
              <strong>Biological Agents</strong>
            </TableCell>
            <TableCell>
              <strong>Biological Hazard</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              className="border-2"
              //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                className="border"
                component="th"
                align="center"
                scope="row"
              >
                {row.rating}
              </TableCell>
              <TableCell className="border" align="center">
                {row.group}
              </TableCell>
              <TableCell className="border" align="left">
                {row.description} Examples: {row.examples}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PotentialProbability = () => {
  const rows = [
    {
      rating: 10,
      description: (
        <>
          <p className="font-semibold">
            Activities with a very probable source of biological contamination:
          </p>
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>
              Sanitary hot water systems with accumulator and return circuit
              and/or presence of dead legs
            </li>
            <li>Aero-refrigerant towers</li>
            <li>
              Conditioned water systems with constant agitation and recycling
              through high-speed jets or air injection
            </li>
            <li>Maintenance work (unblocking sanitation pipes, etc.)</li>
            <li>Work in residual / sanitary water purification plants</li>
            <li>Work in areas where running water is not drinkable</li>
            <li>
              Work in the bush and in areas that are highly contaminated by
              microorganisms carried by mosquitoes, etc.
            </li>
          </ul>
        </>
      ),
    },
    {
      rating: 6,
      description: (
        <>
          <p className="font-semibold">
            Activities with a certain source of biological contamination:
          </p>
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>
              Work in the kitchens: contact with contaminated waste,
              contaminated food (take account of bacteriological checks)
            </li>
            <li>
              Internal installation systems of cold water for human consumption
              (pipes, tanks) fixed and mobile tanks and sanitary hot water
              without return circuit
            </li>
            <li>Maintenance of ventilation and air-conditioning systems</li>
            <li>Cleaning of sanitary systems (toilets)</li>
            <li>
              Sanitary assistance work (contact with patients, handling of
              samples)
            </li>
            <li>
              Work in areas that are contaminated to a low degree by
              microorganisms carried by mosquitoes, etc.
            </li>
          </ul>
        </>
      ),
    },
    {
      rating: 3,
      description:
        "Work beyond the bush in areas contaminated by microorganisms carried by mosquitoes, etc.",
    },
    {
      rating: 1,
      description:
        "Activities without a possible source of biological contamination.",
    },
    {
      rating: 0.5,
      description:
        "Activities without a possible source of biological contamination.",
    },
    {
      rating: 0.2,
      description:
        "Activities without a possible source of biological contamination.",
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table className="border-1">
        <TableHead className="bg-blue-100 text-white">
          <TableRow>
            <TableCell>
              <strong>Rating P</strong>
            </TableCell>
            <TableCell>
              <strong>
                Probability of Potential Exposure to Biological Sources
              </strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow className="border-2" key={index}>
              <TableCell className="border" align="center">
                {row.rating}
              </TableCell>
              <TableCell className="border" align="left">
                {row.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ReductionOfPTable = () => {
  const rows = [
    {
      reductionOfP: -1,
      preventionMeasures: (
        <>
          <p className="font-semibold">
            At least two procedural or organizational measures from:
          </p>
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>
              Hygiene instructions (regularly washing hands, cleaning and
              disinfecting contaminated surfaces, smoking, eating and drinking
              ban in high-risk areas, protecting wounds, food instructions,
              ventilating spaces), signage (marking out the area), instructions
              in case of incidents (sting, cut, bite), preventive medical
              consultation
            </li>
            <li>
              Use of specific PPE (FPP3-type respirators, gloves and protective
              bodywear).
            </li>
            <li>
              For malaria: Air-conditioning, mosquito net, repellents, full
              light-coloured clothing protecting the whole body, preventive
              chemo-prophylaxis
            </li>
            <li>
              For legionella risk: intermittent bacterial treatment and
              monitoring of water treatment at least every three months, thermal
              treatment of sanitary water once a year.
            </li>
            <li>
              For meningitis, plague, etc.: specific hygiene rules to be
              followed (space between people, etc.).
            </li>
          </ul>
        </>
      ),
    },
    {
      reductionOfP: -2,
      preventionMeasures: (
        <>
          <p className="font-semibold">Measures include:</p>
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>
              Use of high-quality PPE (FPP3 masks for activities of short
              duration or powered air purifying masks for activities of long
              duration), sealed combination, eye protection, hand protection
              (gloves with biological resistance, etc.) + operating modes in
              place
            </li>
            <li>
              Technical measures for the reduction in the emission of aerosols
              in certain activities: high-pressure cleaning, aero-refrigerant
              towers (presence of drop screen, etc.)
            </li>
            <li>Preventive vaccination.</li>
          </ul>
        </>
      ),
    },
    {
      reductionOfP: -3,
      preventionMeasures: (
        <>
          <p className="font-semibold">Measures include:</p>
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>Closing of the area and removal of workers from the area</li>
            <li>Complete isolation of the operator</li>
            <li>
              For legionella risk: good design and appropriate management of
              equipment (filtering of exhaled air, absence of dead legs,
              sufficiently high speed of water circulation, etc.), continual
              bacterial treatment systems, and regular monitoring of water
              treatment at least every month, thermal treatment of sanitary
              water at least three times a year.
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <TableContainer component={Paper}>
      <Table className="border">
        <TableHead className="bg-blue-100">
          <TableRow>
            <TableCell>
              <strong>Reduction of P</strong>
            </TableCell>
            <TableCell>
              <strong>Means/Measures of Prevention/Protection</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow className="border-2" key={index}>
              <TableCell className="border" align="center">
                {row.reductionOfP}
              </TableCell>
              <TableCell className="border" align="left">
                {row.preventionMeasures}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
