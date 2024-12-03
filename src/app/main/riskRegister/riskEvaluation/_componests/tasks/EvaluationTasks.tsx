import { Box, Paper, Tab, Tabs } from "@mui/material";
import React, { useEffect } from "react";
import TaskCardList from "./TaskCardList";
import TaskDetailsCard from "../singleTask/TaskDetailsCard";
import { AddTaskOutlined, Check, CheckBox } from "@mui/icons-material";
import Button from "../../../common/Button";
import CommonModal from "../../../common/CommonModal";
import { set } from "lodash";
import AddTask from "./AddTask";
import { useRiskStore } from "../common/riskstore";
import { useParams } from "react-router";
import { useTaskStore } from "../common/taskStore";
import { use } from "i18next";
import { toast } from "react-toastify";
import { apiAuth } from "src/utils/http";

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

const EvaluationTasks = () => {
  const [value, setValue] = React.useState(0);
  const { riskId } = useParams<{ riskId: string }>();
  const { isCurrentUserPartOfTeam, isSessionActive } = useRiskStore();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const { tasks, setTasks, setSelectedTask, selectedTask } = useTaskStore();
  useEffect(() => {
    apiAuth
      .get(`/RiskRegister/task/list/${riskId}`)
      .then((response) => {
        if (response.data.statusCode == 200) {
          setTasks(response.data.data);
          setSelectedTask(response.data.data[0]);
        } else {
          setTasks([]);
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        setTasks([]);
        toast.error("Failed to fetch task");
      });
  }, [riskId]);

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
            {tasks.length > 0 && (
              <>
                <input
                  type="checkbox"
                  className="ml-10"
                  style={{ width: "25px", height: "25px" }}
                />
                <span className="mt-3 ml-5 font-semibold">Select All</span>
              </>
            )}
          </div>

          {/* Uncomment this */}
          {/* {isCurrentUserPartOfTeam && isSessionActive && ( */}
          {isCurrentUserPartOfTeam && (
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
                <AddTask riskId={Number(riskId)} />
              </CommonModal>
            </div>
          )}
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
            {selectedTask && <TaskDetailsCard />}
          </div>
        </div>
      </div>
      {/* </Paper> */}
    </div>
  );
};
export default EvaluationTasks;
