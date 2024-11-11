import { Box, Paper, Tab, Tabs } from "@mui/material";
import React from "react";
import TaskCardList from "./TaskCardList";
import TaskDetailsCard from "./TaskDetailsCard";
import { AddTaskOutlined, Check, CheckBox } from "@mui/icons-material";
import Button from "../../common/Button";
import CommonModal from "../../common/CommonModal";
import { set } from "lodash";
import AddTask from "./AddTask";

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
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tasks = [
  {
    id: "CM003823",
    severityScore: 6,
    risk: 30,
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
  },
  // Repeat the above object 7 more times to create 8 tasks in total
  {
    id: "CM003824",
    severityScore: 6,
    risk: 80,
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
  },
  {
    id: "CM003825",
    severityScore: 6,
    risk: 40,
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
  },
  {
    id: "CM003826",
    severityScore: 6,
    risk: 80,
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
  },
  {
    id: "CM003827",
    severityScore: 6,
    risk: 20,
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
  },
  {
    id: "CM003828",
    severityScore: 6,
    risk: 40,
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
  },
  {
    id: "CM003829",
    severityScore: 6,
    risk: 80,
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
  },
  {
    id: "CM003830",
    severityScore: 6,
    risk: 80,
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
  },
  {
    id: "CM003450",
    severityScore: 6,
    risk: 80,
    description:
      "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
  },
];
const EvaluationTasks = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="mt-10">
      {/* <Paper className="flex flex-col p-10 mt-10"> */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons={false}
          className="w-full px-10 -mx-4 min-h-40 mb-10"
          classes={{
            indicator:
              "flex justify-center bg-transparent border-b-3 border-blue-500 w-full h-full",
          }}
        >
          <Tab className="text-lg" label="All Tasks" {...a11yProps(0)} />
          <Tab className="text-lg" label="Drafts" {...a11yProps(1)} />
          <Tab className="text-lg" label="Need Review" {...a11yProps(2)} />
          <Tab className="text-lg" label="Approval Pending" {...a11yProps(2)} />
          <Tab className="text-lg" label="Approved Tasks" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col sm:flex-row gap-2 justify-between">
          <div className="flex flex-row mt-10">
            <input
              type="checkbox"
              className="ml-10"
              style={{ width: "25px", height: "25px" }}
            />
            <span className="mt-3 ml-5 font-semibold">Select All</span>
          </div>
          <div>
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
              variant="approve"
              type="button"
            >
              <AddTaskOutlined className="mr-4" />
              Add New Task
            </Button>
            <CommonModal
              open={isOpen}
              handleClose={() => {
                setIsOpen(false);
              }}
              title="Add New Task"
            >
              <AddTask />
            </CommonModal>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row">
          <div className="w-full sm:w-2/3">
            <CustomTabPanel value={value} index={0}>
              <TaskCardList tasks={tasks} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <TaskCardList tasks={tasks} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <TaskCardList tasks={tasks} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <TaskCardList tasks={tasks} />
            </CustomTabPanel>
          </div>
          <div className="w-full sm:w-1/3">
            <TaskDetailsCard />
          </div>
        </div>
      </div>
      {/* </Paper> */}
    </div>
  );
};
export default EvaluationTasks;
