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
          <th className="border py-10 px-4">Rating G</th>
          <th className="border py-10 px-4">Psychological stressors</th>
          <th className="border py-10 px-4">Examples</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border py-2 px-4 text-center font-bold">15</td>
          <td className="border py-2 px-4">
            Extremes that could result in the stoppage of all occupational
            activity
          </td>
          <td className="border py-2 px-4">
            Situations of violence (burglary, hold-up, aggression by third
            parties, insecurity, etc.)
            <br />
            Work in a region where the safety of civilian populations cannot be
            guaranteed.
            <br />
            Major accident or particularly high risk situation
          </td>
        </tr>
        <tr>
          <td className="border py-2 px-4 text-center font-bold">7</td>
          <td className="border py-2 px-4">
            Important not requiring a work stoppage
          </td>
          <td className="border py-2 px-4">
            Tense relations with the general public: claims management, call
            center, rudeness, violence, etc.
            <br />
            Major restructuring/job insecurity
          </td>
        </tr>
        <tr>
          <td className="border py-2 px-4 text-center font-bold">3</td>
          <td className="border py-2 px-4">Multiple and repeated</td>
          <td className="border py-2 px-4">
            <u>Demands of the work:</u>
            <br />
            - High workload, time pressure, complexity of the work, difficulty
            balancing life and work, frequent interruptions and disruptions,
            prolonged sustained concentration, management of emergencies,
            routine work not conducive to the development of competencies;
            <br />
            - Work rate and hours, work in a isolated or confined space, night
            work, shiftwork;
            <br />
            - Technical or organizational changes (e.g. new IT tools);
            <br />
            <u>Autonomy:</u>
            <br />
            - Vague/variable/multiple/contradictory goals, multiple hierarchies,
            too many or too little or poorly defined responsibilities,
            non-negotiable deadlines;
            <br />
            - Under- or overqualification, procedural constraints, etc.
            <br />
            <u>Emotional stress:</u>
            <br />
            - Constant pressure or stressor, not enough recognition,
            relationship with the general public, rudeness, lack of
            response/engagement, conflict of values, ethical conflict,
            difficulty balancing life and work;
            <br />- Fear of accidents, experience of the suffering of others,
            necessity of not showing emotions, etc.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const PotentialProbability = () => {
  return (
    <p className="font-semibold px-10">
      The potential exposure probability P of exposure to psychosocial risk
      factors when performing a task related to an organization and/or work
      conditions are highlighted, is 10.
      <br />
      <br />
      It can be reduced to 6 if the activity is seasonal
    </p>
  );
};

const ReductionOfPTable = () => {
  return (
    <table className="w-full border-collapse border">
      <thead className="bg-blue-400 text-white">
        <tr>
          <th className="border py-10 px-4">Reduction of P</th>
          <th className="border py-10 px-4">
            Means/measures of prevention/protection
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">-1</td>
          <td className="border py-4 px-4">
            <u>Individual-based actions:</u>
            <br />
            - Specific training depending on the stressor (change to the
            workplace/tools, management of difficult customers or contacts,
            teamwork, management of aggression, supervision to prevent
            psychosocial risks, etc.),
            <br />
            - Implementation of a stress observatory,
            <br />- Possible availability of a consultant psychologist,
            toll-free number, treatment of posttraumatic stress syndrome, social
            and psychological support in the event of major restructuring
            situations...
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">-2</td>
          <td className="border py-4 px-4">
            <u>HEG-based actions:</u>
            <br />
            - Introduction of technical resources to limit service station
            hold-ups: security hatches, automatic pump, electric strike, marker
            spraying, CCTV, police alert button...
            <br />
            - Introduction of measures to change the organization that generates
            the PR:
            <br />
            o Presence of trained counsellors or trusted confidants AND specific
            procedures depending on the stressor: internal mediation
            (hierarchical or HR referrer, medical-social services, employee
            representative, designated trusted confidant) for interpersonal
            conflict situations.
            <br />
            o AND processing of information on these structures and the medical
            stress observatory.
            <br />- Psychosocial treatment of the HEG after a serious event,
            GM-GR-RH-005.
          </td>
        </tr>
        <tr>
          <td className="border py-4 px-4 text-center font-bold">-3</td>
          <td className="border py-4 px-4">
            <u>Long-term general actions:</u>
            <br />
            Existence of an up-to-date policy and program on preventing
            psychosocial risk factors, with a multidisciplinary task force, a
            clear definition of prevention objectives, and monitoring
            indicators.
          </td>
        </tr>
      </tbody>
    </table>
  );
};
