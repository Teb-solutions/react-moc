import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TaskCardList from "./TaskCardList";
import TaskDetailsCard from "../singleTask/TaskDetailsCard";
import { AddTaskOutlined, Check, CheckBox } from "@mui/icons-material";
import Button from "../../../common/Button";
import { useRiskStore } from "../common/riskstore";
import { useParams } from "react-router";
import { useTaskStore } from "../common/taskStore";
import { use } from "i18next";
import { toast } from "react-toastify";
import { apiAuth } from "src/utils/http";
import { RiskClassification, TaskStatusDisplayNames, TaskStatusEnum } from "../../../helpers/enum";
import { useGetPermenant } from "src/utils/swr";
import { ITask } from "../../../helpers/type";
import { mutate } from "swr";
import { getCurrentUserId } from "../../../helpers/commonFunctions";
import { SubmitTasksApproval } from "./SubmitTasksApproval";
import { ImportTasks } from "./ImportTasks";

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
  const [selectedRiskCategory, setSelectedRiskCategory] = React.useState<
    number | null
  >(RiskClassification.VeryLowRisk);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setStatusFilter("");
    switch (newValue) {
      case 0:
        setSelectedRiskCategory(RiskClassification.VeryLowRisk);
        break;
      case 1:
        setSelectedRiskCategory(RiskClassification.LowRisk);
        break;
      case 2:
        setSelectedRiskCategory(RiskClassification.AverageRisk);
        break;
      case 3:
        setSelectedRiskCategory(RiskClassification.SignificantRisk);
        break;
      case 4:
        setSelectedRiskCategory(RiskClassification.HighRisk);
        break;
      case 5:
        setSelectedRiskCategory(null);
        break;
      default:
        setSelectedRiskCategory(null);
        break;
    }
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAddTaskClicked, setIsAddTaskClicked } = useTaskStore();
  const [initialTaskId, setInitialTaskId] = useState<number | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const currentUserId = getCurrentUserId();
  const {
    tasks,
    setTasks,
    setSelectedTask,
    selectedTask,
    selectedTasksIds,
    setSelectedTasksIds,
  } = useTaskStore();
  const {
    data: result,
    isLoading,
    error,
  } = useGetPermenant<{
    data: ITask[];
    message: string;
    statusCode: number;
  }>(`/RiskRegister/task/list/${riskId}`);
  useEffect(() => {
    if (result) {
      if (result.statusCode == 200) {
        setTasks(result.data);
        // !selectedTask && setSelectedTask(result.data[0]);
      } else {
        setTasks([]);
        toast.error(result.message);
      }
    }
  }, [result]);

  useEffect(() => {
    if (tasks.length > 0 && tasks[0].taskId) {
      setInitialTaskId(tasks[0].taskId);
    }
    if (
      selectedTask &&
      tasks.find((task) => task.taskId == selectedTask.taskId)
    ) {
      setInitialTaskId(selectedTask.taskId);
    }
  }, [tasks]);

  const {
    data: selectedTaskResult,
    isLoading: isSelectedTaskLoading,
    error: isSelectedTaskError,
  } = useGetPermenant<{
    data: ITask;
    message: string;
    statusCode: number;
  }>(initialTaskId ? `/RiskRegister/task/detail/${initialTaskId}` : null);

  useEffect(() => {
    if (selectedTaskResult) {
      if (selectedTaskResult.statusCode == 200) {
        setSelectedTask(selectedTaskResult.data);
      } else {
        setSelectedTask(null);
        toast.error(selectedTaskResult.message);
      }
    } else if (isSelectedTaskError) {
      console.log(isSelectedTaskError);
      setSelectedTask(null);
      toast.error("Failed to fetch task");
    }
  }, [selectedTaskResult]);
  const [statusFilter, setStatusFilter] = React.useState("");
  const handleChangeAge = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter((event.target.value));
  };
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
          {/* <Tab className="text-lg" label="Drafts" {...a11yProps(1)} />
          <Tab className="text-lg" label="Approval Pending" {...a11yProps(2)} />
          <Tab className="text-lg" label="Need Task Review" {...a11yProps(3)} />
          <Tab className="text-lg" label="Approved Tasks" {...a11yProps(4)} />
          <Tab className="text-lg" label="My Approvals" {...a11yProps(5)} /> */}
          <Tab className="text-lg" label="All Tasks" {...a11yProps(0)} />
          <Tab className="text-lg" label="Very Low Risk" {...a11yProps(1)} />
          <Tab className="text-lg" label="Low Risk" {...a11yProps(2)} />
          <Tab className="text-lg" label="Average Risk" {...a11yProps(3)} />
          <Tab className="text-lg" label="Significant Risk" {...a11yProps(4)} />
          <Tab className="text-lg" label="High Risk" {...a11yProps(5)} />
          
        </Tabs>
      </Box>
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col sm:flex-row gap-2 justify-between">
          <div className="flex flex-row my-10">
            {tasks.length > 0 &&
              tasks.find(
                (task) =>
                  [
                    TaskStatusEnum.Draft,
                    TaskStatusEnum.RejectedPendingReview,
                  ].includes(task.status) &&
                  task.residualRiskClassification === selectedRiskCategory &&
                  task.residualRiskClassification != RiskClassification.HighRisk
              ) && (
                <div className="flex flex-col w-full sm:flex-row gap-20">
                  <div className="flex flex-wrap py-10">
                    <input
                      onClick={(event) => {
                        if ((event.target as HTMLInputElement).checked) {
                          setSelectedTasksIds(
                            //how to check if the task status is draft and then add to the array
                            tasks
                              .filter(
                                (task) =>
                                  [
                                    TaskStatusEnum.Draft,
                                    TaskStatusEnum.RejectedPendingReview,
                                  ].includes(task.status) &&
                                  task.residualRiskClassification ===
                                    selectedRiskCategory &&
                                  task.residualRiskClassification !=
                                    RiskClassification.HighRisk
                              )
                              .map((task) => task.taskId)
                          );
                        } else {
                          setSelectedTasksIds([]);
                        }
                      }}
                      type="checkbox"
                      className="ml-10"
                      style={{ width: "25px", height: "25px" }}
                    />
                    <span className="mt-3 ml-5 font-semibold">Select All</span>
                  </div>
                  {selectedTasksIds.length > 0 && (
                    <div className="p-0">
                      <Button
                        onClick={() => {
                          setIsSubmitOpen(true);
                        }}
                        variant="approve"
                        type="button"
                      >
                        Submit for Approval ({selectedTasksIds.length} tasks)
                      </Button>
                      <SubmitTasksApproval
                        isSubmitOpen={isSubmitOpen}
                        setIsSubmitOpen={setIsSubmitOpen}
                        selectedRiskCategory={selectedRiskCategory}
                        riskId={riskId}
                      />
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Uncomment this */}
          {isCurrentUserPartOfTeam && isSessionActive && (
            // {isCurrentUserPartOfTeam && (
            <div className="flex flex-row justify-between w-full mx-20">
              <div >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Filter by status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={statusFilter}
                    label="Filter by status"
                    fullWidth
                    size="small"
                    style={{ width: "200px", backgroundColor: "white"}}
                    onChange={handleChangeAge}
                  >
                    <MenuItem value={""}>All</MenuItem>
                    <MenuItem value={TaskStatusEnum.Draft}>{TaskStatusDisplayNames[TaskStatusEnum.Draft]} </MenuItem>
                    <MenuItem value={TaskStatusEnum.PendingApproval}>{TaskStatusDisplayNames[TaskStatusEnum.PendingApproval]}</MenuItem>
                    <MenuItem value={TaskStatusEnum.Approved}>{TaskStatusDisplayNames[TaskStatusEnum.Approved]}</MenuItem>
                    <MenuItem value={TaskStatusEnum.RejectedPendingReview}>{TaskStatusDisplayNames[TaskStatusEnum.RejectedPendingReview]}</MenuItem>
                    
                  </Select>
                </FormControl>
              </div>
              <div>
                <Button
                  onClick={() => {
                    // setIsOpen(true);
                    setIsAddTaskClicked(true);
                  }}
                  variant="approve"
                  type="button"
                >
                  <AddTaskOutlined className="mr-4" />
                  Add New Task
                </Button>
              </div>
              {/* <ImportTasks /> */}
              {/* <CommonModal
                open={isOpen}
                handleClose={() => {
                  setIsOpen(false);
                }}
                title="Add New Task"
              >
                <AddTask setIsOpen={setIsOpen} riskId={Number(riskId)} />
              </CommonModal> */}
            </div>
          )}
        </div>

        <div className="w-full flex flex-col sm:flex-row">
          <div className="w-full sm:w-2/3">
          <CustomTabPanel value={value} index={0}>
              <TaskCardList tasks={tasks.filter((task)=>(statusFilter === "" ? true : task.status === Number(statusFilter)))} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <TaskCardList
                tasks={tasks.filter(
                  (task) =>
                    task.residualRiskClassification ===
                    RiskClassification.VeryLowRisk && (statusFilter === "" ? true : task.status === Number(statusFilter))
                )}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <TaskCardList
                tasks={tasks.filter(
                  (task) =>
                    task.residualRiskClassification ===
                    RiskClassification.LowRisk && (statusFilter === "" ? true : task.status === Number(statusFilter))
                )}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <TaskCardList
                tasks={tasks.filter(
                  (task) =>
                    task.residualRiskClassification ===
                    RiskClassification.AverageRisk && (statusFilter === "" ? true : task.status === Number(statusFilter))
                )}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <TaskCardList
                tasks={tasks.filter(
                  (task) =>
                    task.residualRiskClassification ===
                    RiskClassification.SignificantRisk && (statusFilter === "" ? true : task.status === Number(statusFilter))
                )}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
              <TaskCardList
                tasks={tasks.filter(
                  (task) =>
                    task.residualRiskClassification ===
                    RiskClassification.HighRisk && (statusFilter === "" ? true : task.status === Number(statusFilter))
                )}
              />
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
