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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import create from "zustand";

interface SubCategoryState {
  subCategory: string;
  setSubCategory: (subCategory: string) => void;
}

const useSubCategoryStore = create<SubCategoryState>((set) => ({
  subCategory: subCatergoryList.noise,
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

enum subCatergoryList {
  "noise" = "noise",
  "vibration" = "vibration",
  "optical" = "optical",
  "thermal" = "thermal",
  "electromagnetic" = "electromagnetic",
  "ionizingRadiation" = "ionizingRadiation",
}

const displaySubCategory = {
  [subCatergoryList.noise]: "Assessment of risk associated with noise",
  [subCatergoryList.vibration]: "Assessment of risk associated with vibrations",
  [subCatergoryList.optical]:
    "Assessment of risk associated with optical radiation",
  [subCatergoryList.thermal]:
    "Assessment of risk associated with extreme temperatures and thermal radiation",
  [subCatergoryList.electromagnetic]:
    "Assessment of risk associated with electrical and magnetic fields (EMC)",
  [subCatergoryList.ionizingRadiation]:
    "Assessment of risk associated with ionizing radiation",
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
          {Object.entries(subCatergoryList).map(([key, value]) => (
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
        <PotentialProbability />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ReductionOfPTable />
      </CustomTabPanel>
    </Box>
  );
};
const severityRatingArray = [
  {
    type: subCatergoryList.noise,
    header: ["Rating G", "Noise", "Description"],
    array: [
      [
        15,
        <p>&gt; 87 dB(A) OR Peak sound pressure &gt; 140 dBC</p>,
        <p>Conversation impossible.</p>,
      ],
      [
        7,
        <p>85-87 dB(A) OR Peak sound pressure: 137-140 dBC</p>,
        <p>
          Working in conditions in which you have to shout to be heard at a
          distance of less than one meter from the other person, difficulty or
          inability to hear alarms.
        </p>,
      ],
      [
        3,
        <p>80-85 dB(A) OR Peak sound pressure: 135-137 dBC</p>,
        <p>
          Working in conditions in which you have to speak loudly to be heard at
          a distance of one meter from the other person.
        </p>,
      ],
      [
        1,
        <p>&gt; 80 dB(A) OR Peak sound pressure &lt; 135 dBC</p>,
        <p>
          Working in conditions in which you do not have to speak loudly to be
          heard at a distance of one meter from the other person.
        </p>,
      ],
    ],
  },
  {
    type: subCatergoryList.vibration,
    header: ["Rating G", "Vibration", "Description"],
    array: [
      [
        7,
        <p>Arm-hand &gt; 5 m/s²</p>,
        <p>
          Hammers, jackhammers, perforators, brush cutters, power saws, etc.
          Whole body &gt; 1.15 m/s², Loader, etc.
        </p>,
      ],
      [
        3,
        <p>Arm-hand 2.5-5 m/s²</p>,
        <p>
          Rotating machines (drills, grinders), etc. Whole body 0.5-1.15 m/s²,
          Forklifts, trucks, road tractors (semitrailers), utility vehicles,
          clippers, (manual/electric) transpallets, etc.
        </p>,
      ],
      [
        1,
        <p>Arm-hand &lt; 2.5 m/s²</p>,
        <p>
          Electric screwdrivers, etc. Whole body &lt; 0.5 m/s², Metro train,
          train, bus, car on road in good condition, etc.
        </p>,
      ],
    ],
  },
  {
    type: subCatergoryList.thermal,
    header: ["Rating G", "Thermal", "Description"],
    array: [
      [
        7,
        <>
          <p>
            The thermal environment and ambient environment make the task
            painful:
          </p>
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>T° &lt; -10°C or T° &gt; 40°C</li>
            <li>
              Wearing special coveralls with gloves, balaclava, special shoes
              (e.g. coveralls for blast furnaces)
            </li>
          </ul>
          <p>Thermal radiation: Immediate burning sensation</p>
          <li>Thermal flow &gt; 10.4 kW/m²</li>
        </>,
        <p>Negative cold room (- 18°C), blast furnace, etc.</p>,
      ],
      [
        3,
        <>
          <p>
            The thermal environment and ambient environment make the task
            difficult:
          </p>
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>-10°C &lt; T° &lt; 10°C or 32°C &lt; T° &lt; 40°C</li>
            <li>High relative humidity: major perspiration</li>
            <li>Bad weather: monsoon, storm</li>
            <li>
              Wearing clothing that considerably hampers the work or clothing
              specially treated against radiation or humidity (e.g. SCBA,
              waterproof coveralls for high-pressure cleaning, chemical
              coveralls)
            </li>
          </ul>
          <p>
            Thermal radiation: Impossible to hold hands/face exposed to
            radiation for 2 mins.
          </p>
          <li>2.5 kW/m² &lt; Thermal flow &lt; 10.4 kW/m²</li>
        </>,
        <>
          <p>Hot or cold barren zone</p>
          <p>Steam cracking and refinery furnace</p>
          <p>Frost, heatwave, etc.</p>
        </>,
      ],
      [
        1,
        <>
          <p>
            The thermal environment and ambient environment make the task
            slightly uncomfortable:
          </p>
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>10°C &lt; T° &lt; 18°C or 25°C &lt; T° &lt; 32°C</li>
            <li>Relative humidity: &lt; 30% or &gt; 70% (sweaty skin)</li>
            <li>Wind &gt; 35 km/h</li>
            <li>Bad weather: rain, etc.</li>
            <li>
              Wearing clothing that slightly hampers the work (e.g. disposable
              coveralls, cartridge-type respirator or powered air respirator,
              dust mask, airtight goggles, etc.)
            </li>
          </ul>
          <p>
            Thermal radiation: Hot sensation on the hands and face after 2-3
            mins
          </p>
          <li>1.6 kW/m² &lt; Thermal flow &lt; 2.5 kW/m²</li>
        </>,
        <p>
          Workplaces exposed to draughts, in front of a window, close to a heat
          source (catering, etc.), temperature variation, etc.
        </p>,
      ],
      [
        0,
        <>
          <p>
            The thermal environment and ambient environment are comfortable when
            wearing standard workwear:
          </p>
          <ul style={{ listStyleType: "circle" }} className="ml-10">
            <li>18°C-25°C</li>
            <li>Relative humidity 30%-70% or little discomfort</li>
            <li>No draught.</li>
          </ul>
          <p>Thermal radiation: appreciable but no effect.</p>
          <li>Thermal flow &lt; 1.6 kW/m²</li>
        </>,
        <p>-</p>,
      ],
    ],
  },
  {
    type: subCatergoryList.electromagnetic,
    header: [
      "Rating G",
      "Electromagnetic fields (EMF) (Directive 2013/35/EC and EN 12198-1)",
    ],
    array: [
      [
        15,
        <p>EMF at values considerably higher than the health impact values*</p>,
      ],
      [
        7,
        <p>
          EMF at values higher than the health impact values* EMF at values
          higher than the values set for exposure of members of the general
          public at particular risk (people with an implanted device, pregnant
          person). EMF causing sparks. EMF generating contact currents. EMF
          causing attraction/repulsion of metallic materials.
        </p>,
      ],
      [
        3,
        <p>EMF at values higher than the values that trigger action (AV**)</p>,
      ],
      [
        1,
        <p>
          EMF at values lower than the impact values and the values that trigger
          action (AV**) Values set for the exposure of the general public.
        </p>,
      ],
    ],
  },
  {
    type: subCatergoryList.ionizingRadiation,
    header: ["Rating G", "Description"],
    array: [[15, <p>All radioelements are carcinogenic</p>]],
  },
  {
    type: subCatergoryList.optical,
    header: [
      "Rating G",
      "Visible and infrared E (700nm 1mm)",
      "VisibleEeff (400nm – 700nm)Leff (400nm – 700nm)",
      "Ultraviolet and visibleEeff (180 – 400nm)",
      "LASERS",
    ],
    array: [
      [
        15,
        <p>-</p>,
        <p>-</p>,
        <p>UV index 8 and higher</p>,
        <p>Laser source class* 4</p>,
      ],
      [
        7,
        <p>{">"} 100 W.m-2</p>,
        <ul>
          <li>Eeff {">"} 10.10-3 W.m-2</li>
          <li>Leff {">"} 100 W.m-2 .sr-1</li>
        </ul>,
        <ul>
          <li>Eeff {">"} 1,0.10-3 W.m-2</li>
          <li>Leff {">"} UV ~ 6-7</li>
        </ul>,
        <p>Laser source class* 3B (5-500 mW) </p>,
      ],
      [
        3,
        <p>{"<"} 100 W.m-2</p>,
        <ul>
          <li>Eeff {"<"} 10.10-3 W.m-2</li>
          <li>Leff {"<"} 100 W.m-2 .sr-1</li>
        </ul>,
        <ul>
          <li>Eeff {"<"} 1,0.10-3 W.m-2</li>
          <li>UV 200-300 J/m² (2-3 SED) UV index 3-5</li>
        </ul>,
        <p>Laser source class* 3R (1-5 mW) </p>,
      ],
      [
        1,
        <p>{"<"} 33 W.m-2</p>,
        <ul>
          <li>Eeff {"<"} 1,0.10-3 W.m-2</li>
          <li>Leff {"<"} 10 W.m-2 .sr-1</li>
        </ul>,
        <ul>
          <li>Eeff {"<"} 0.1.10-3 W.m-m-2</li>
          <li>
            UVABC {">"} 30 J/m² (0.3 SED) (skin) UVA {">"} 10 000 J/m² (100 SED)
            (eyes)
          </li>
        </ul>,
        <p>Laser source class* 1, 1M, 2, 2M ({"<"} 1 mW) </p>,
      ],
    ],
  },
];

const SeverityRatingTable = () => {
  const { subCategory } = useSubCategoryStore();
  const ratingObj = severityRatingArray.find(
    (item) => item.type === subCategory
  );
  const rows = ratingObj?.array || [];

  return (
    <TableContainer component={Paper}>
      <Table className="border-1">
        <TableHead className="bg-blue-100 text-white">
          <TableRow>
            {ratingObj?.header.map((head, index) => (
              <TableCell key={index}>{head}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow className="border-2" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="border" align="left">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const potentialExposureProbabilityArray = [
  {
    type: subCatergoryList.noise,
    array: [
      {
        rating: 10,
        description: (
          <p className="font-semibold">
            The potential exposure probability P of exposure to noise when
            working in or close to a noisy workplace is 10.
          </p>
        ),
      },
    ],
  },
];
const PotentialProbability = () => {
  const rows = potentialExposureProbabilityArray.find(
    (item) => item.type === subCatergoryList.noise
  )?.array;

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

const reductionOfPArray = [
  {
    type: subCatergoryList.noise,
    array: [
      {
        reductionOfP: -1,
        preventionMeasures: [
          "At least two procedural or organizational measures from:",
          "See Mp-type matrix",
          "Signage, regular audit, inspections, calls to order, etc.",
          "Earplugs",
        ],
      },
      {
        reductionOfP: -2,
        preventionMeasures: [
          "Wearing appropriate PPE and training on use and maintenance, helmet and earplugs for exposure above 120 dBA, etc.",
        ],
      },
      {
        reductionOfP: -3,
        preventionMeasures: ["Insulation and enclosure, etc."],
      },
    ],
  },
];

const ReductionOfPTable = () => {
  const rows = reductionOfPArray.find(
    (item) => item.type === subCatergoryList.noise
  )?.array;

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
