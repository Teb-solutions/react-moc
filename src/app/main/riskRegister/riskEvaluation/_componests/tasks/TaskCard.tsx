import { Chip } from "@mui/material";
import React, { useState } from "react";
import { ITask } from "../../../helpers/type";
import RiskClassificationDisplay from "../../../common/RiskClassificationDisplay";
import { useTaskStore } from "../common/taskStore";
import { riskClassificationDisplay } from "src/app/main/moc/common_components/RiskAnalysisCalculate";
import { TaskStatusDisplayNames, TaskStatusEnum } from "../../../helpers/enum";
import { useGetPermenant } from "src/utils/swr";
import { toast } from "react-toastify";
import { useRiskStore } from "../common/riskstore";
import { getCurrentUserId } from "../../../helpers/commonFunctions";
import RiskDisplay from "../common/RiskDisplay";
import { set } from "lodash";

const TaskCard = ({ task, index }: { task: ITask; index: number }) => {
  const {
    setSelectedTask,
    selectedTask,
    selectedTasksIds,
    setSelectedTasksIds,
  } = useTaskStore();
  const { setIsTaskApprover } = useRiskStore();
  const [isTaskCardClicked, setIsTaskCardClicked] = useState(false);
  const {
    data: selectedTaskResult,
    isLoading,
    error,
  } = useGetPermenant<{
    data: ITask;
    message: string;
    statusCode: number;
  }>(isTaskCardClicked ? `/RiskRegister/task/detail/${task.taskId}` : null);

  // const {
  //   data: selectedTaskResult,
  //   isLoading,
  //   error,
  // } = useGetPermenant<{
  //   data: ITask;
  //   message: string;
  //   statusCode: number;
  // }>(task ? `/RiskRegister/task/detail/${task.taskId}` : null);
  const userId = Number(getCurrentUserId());
  const handleTaskCardClick = () => {
    setIsTaskCardClicked(true);

    if (selectedTaskResult) {
      if (selectedTaskResult.statusCode == 200) {
        setSelectedTask(selectedTaskResult.data);
        setIsTaskApprover(
          selectedTaskResult.data.approvals.some(
            (approver) => approver.staffId === userId && approver.isActive
          )
        );
      } else {
        toast.error(selectedTaskResult.message);
      }
    } else if (error) {
      console.log(error);
      toast.error("Failed to get task details");
    }
  };

  return (
    <>
      {task && selectedTask && (
        <article
          onClick={() => handleTaskCardClick()}
          className={`flex flex-col w-full grow cursor-pointer shrink justify-center self-stretch p-10 my-auto bg-white rounded-lg ${task && selectedTask && task.taskId == selectedTask.taskId ? "border-blue-700 border-solid border-3 shadow-[0px_0px_20px_rgba(14,65,244,0.2)]" : "border-white shadow-[0px_0px_20px_rgba(211, 211, 211, 0.2)] border-3"} shadow min-w-[240px] w-[326px] max-md:px-5`}
        >
          <div className="flex flex-col w-full">
            <header className="flex gap-10 justify-between items-center w-full text-lg font-semibold whitespace-nowrap text-zinc-800">
              <h3 className="self-stretch my-auto">
                {task.taskId ? "TASK#" + task.taskId : "TASK"}
              </h3>
              {task.status === TaskStatusEnum.Draft && (
                <input
                  type="checkbox"
                  checked={selectedTasksIds.includes(task.taskId)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.status == TaskStatusEnum.Draft) {
                      if (selectedTasksIds.includes(task.taskId)) {
                        setSelectedTasksIds(
                          selectedTasksIds.filter((id) => id !== task.taskId)
                        );
                      } else {
                        setSelectedTasksIds([...selectedTasksIds, task.taskId]);
                      }
                    } else {
                      toast.error("You can only select tasks in Draft status");
                    }
                  }}
                  className="self-stretch my-auto"
                  aria-label="Select Task"
                  style={{ width: "20px", height: "20px" }}
                />
              )}
            </header>
            <div className="flex gap-10 justify-between items-center mt-6 w-full">
              <div className="flex flex-col justify-center self-stretch my-auto">
                <h5 className="font-medium text-gray-600">Residual Risk</h5>
                <p className="mt-2 font-semibold text-zinc-800">
                  {task.residualRisk}
                </p>
              </div>
              <RiskDisplay
                risk={task.residualRiskClassification.toString()}
                riskDisplay={riskClassificationDisplay(
                  task.residualRiskClassification
                )}
              />
            </div>
            <div className="flex flex-col mt-6 max-w-full w-[360px]">
              <h5 className="font-medium text-gray-600">Task Description</h5>
              <p className="mt-3 text-neutral-400">{task.taskName}</p>
            </div>
            <div className="flex flex-col mt-6 max-w-full">
              <Chip
                sx={{ maxWidth: "fit-content", whiteSpace: "nowrap" }}
                label={TaskStatusDisplayNames[task.status] || "Draft"}
                color="info"
                variant="outlined"
                size="small"
              />
            </div>
          </div>
        </article>
      )}
    </>
  );
};

export default TaskCard;
