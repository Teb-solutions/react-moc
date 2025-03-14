import { Box, Button, Icon, Paper, Popover, Typography } from "@mui/material";
import InfoSection from "./InfoSection";
import RiskSection from "./RiskSection";
import ControlMeasures from "./ControlMeasures";
import TaskApprovalHistory from "./TaskAppovalHistory";
import ButtonRisk from "../../../common/Button";
import { useEffect, useMemo, useState } from "react";
import SendForRevision from "./SendForRevision";
import TaskActions from "./TaskActions";
import { TaskPopupType, TaskStatusEnum } from "../../../helpers/enum";
import VersionHistory from "./VersionHistory";
import TaskButton from "../../../common/TaskButton";
import { useRiskStore } from "../common/riskstore";
import { useTaskStore } from "../common/taskStore";
import { useParams } from "react-router";

import { useControlMeasureStore } from "../common/controlMeasureStore";
import useFetchLookUpData from "../common/useFetchLookUpData";
import { taskCancelled } from "node_modules/@reduxjs/toolkit/dist/listenerMiddleware/exceptions";
import { includes } from "lodash";

interface RiskItemProps {
  label: string;
  value: string;
}

const TaskDetailsCard = () => {
  const { isCurrentUserPartOfTeam, isTaskApprover, isSessionActive } =
    useRiskStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openRevision, setOpenRevision] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [popupType, setPopupType] = useState(0);
  const { setIsEditControlMeasure } = useControlMeasureStore();
  // const [isEditTask, setIsEditTask] = useState(false);
  const { isEditTaskClicked, setIsEditTaskClicked } = useTaskStore();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const { selectedTask } = useTaskStore();

  
  const timeUrl = "/LookupData/Lov/29";
  const frequencyUrl = selectedTask.time
    ? `/LookupData/Lov/30/${selectedTask.time}`
    : null;
  const {
    data: timesArr,
    loading: timeLoading,
    error: timeError,
  } = useFetchLookUpData(timeUrl);
  const {
    data: frequencyArr,
    loading: frequencyLoading,
    error: frequencyError,
  } = useFetchLookUpData(frequencyUrl);

 
  const priskItems: RiskItemProps[] = useMemo(
    () => [
      {
        label: "Time",
        value: selectedTask.time && timesArr ? timesArr?.find((time) => time.value === selectedTask.time)?.text : "NA",
      },
      {
        label: "Frequency",
        value: selectedTask.frequencyDetails && frequencyArr
          ? frequencyArr?.find((fq) => fq.value === selectedTask.frequencyDetails)?.text
          : "NA",
      },
      {
        label: "Frequency Scoring",
        value: selectedTask.frequencyScoring
          ? selectedTask.frequencyScoring.toString()
          : "0",
      },
      {
        label: "Likelyhood Scoring",
        value: selectedTask.likelihoodScoring
          ? selectedTask.likelihoodScoring.toString()
          : "0",
      },
      {
        label: "Severity Scoring",
        value: selectedTask.severityScoring
          ? selectedTask.severityScoring.toString()
          : "0",
      },
      {
        label: "Potential Risk",
        value: selectedTask.potentialRisk
          ? selectedTask.potentialRisk.toString()
          : "0",
      },
    ],
    [selectedTask, timesArr, frequencyArr]
  );

  const rriskItems: RiskItemProps[] = useMemo(
    () => [
      {
        label: "Time",
        value: selectedTask.modifiedTime && timesArr ? timesArr?.find((time) => time.value === selectedTask.modifiedTime)?.text : "NA",
      },
      {
        label: "Frequency",
        value: selectedTask.modifiedFrequencyDetails && frequencyArr
          ? frequencyArr?.find((fq) => fq.value === selectedTask.modifiedFrequencyDetails)?.text
          : "NA",
      },
      {
        label: "Frequency Scoring",
        value: selectedTask.residualFrequencyScoring
          ? selectedTask.residualFrequencyScoring.toString()
          : "0",
      },
      {
        label: "Likelyhood Scoring",
        value: selectedTask.residualLikelihoodScoring
          ? selectedTask.residualLikelihoodScoring.toString()
          : "0",
      },
      {
        label: "Severity Scoring",
        value: selectedTask.residualSeverityScoring
          ? selectedTask.residualSeverityScoring.toString()
          : "0",
      },
      {
        label: "Residual Risk",
        value: selectedTask.residualRisk
          ? selectedTask.residualRisk.toString()
          : "0",
      },
    ],
    [selectedTask, timesArr, frequencyArr]
  );

  const riskId = useParams<{ riskId: string }>().riskId;

  return (
    <Paper className="flex flex-col p-10 mt-10">
      <header className="flex gap-10 mb-10 justify-between items-center w-full">
        <h2
          className={`text-base font-semibold text-zinc-800 px-5 py-5 rounded-md ${
            Number(selectedTask?.residualRiskClassification) === 1 &&
            "bg-red-500"
          }
              ${Number(selectedTask?.residualRiskClassification) === 2 && "bg-orange-700"}
              ${Number(selectedTask?.residualRiskClassification) === 3 && "bg-amber-700"}
              ${Number(selectedTask?.residualRiskClassification) === 4 && "bg-yellow-600"}
              ${Number(selectedTask?.residualRiskClassification) === 5 && "bg-green-500"}`}
        >
          TASK#{selectedTask.taskId}
        </h2>
        <div className="flex gap-10">
          <button
            aria-describedby={id}
            onClick={handleClick}
            className="flex gap-2 w-full items-center mb-4 self-stretch px-10 py-5 my-auto text-sm font-medium text-blue-700 whitespace-nowrap rounded bg-blue-700 bg-opacity-10"
          >
            <Icon>menu</Icon>
            <span className="ml-4 self-stretch my-auto">Actions</span>
          </button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography className="p-5">
              {/* {(isCurrentUserPartOfTeam || isTaskApprover) && (
                <TaskButton
                  onClick={() => {
                    setIsOpen(true);
                    setPopupType(TaskPopupType.Audit);
                  }}
                  icon="add"
                  text="Audits"
                />
              )} */}
              {isCurrentUserPartOfTeam && isSessionActive && [TaskStatusEnum.Draft, TaskStatusEnum.RejectedPendingReview].includes(selectedTask.status) && (
                <TaskButton
                  onClick={() => {
                    setIsEditTaskClicked(true);
                  }}
                  icon="edit"
                  text="Edit"
                />
              )}

              {isCurrentUserPartOfTeam && isSessionActive && selectedTask.status==TaskStatusEnum.Draft && (
                <TaskButton
                  onClick={() => {
                    setIsOpen(true);
                    setPopupType(TaskPopupType.Delete);
                  }}
                  icon="delete"
                  text="Delete"
                />
              )}

              {/* <TaskButton
                onClick={() => {
                  setIsVersionOpen(true);
                }}
                icon="history"
                text="Versions"
              /> */}
            </Typography>
          </Popover>
          {/* <VersionHistory isOpen={isVersionOpen} setIsOpen={setIsVersionOpen} /> */}
          {/* <CommonModal
            title="Edit Task"
            open={isEditTask}
            handleClose={() => setIsEditTask}
          >
            <EditTask setIsOpen={setIsEditTask} />
          </CommonModal> */}
        </div>
      </header>
      <hr className="w-full border border-solid border-neutral-200" />
      <article
        className="flex flex-col px-6 bg-white rounded-lg"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="flex flex-col mt-5">
          {selectedTask && <InfoSection />}
          <RiskSection riskItems={priskItems} title="Potential Risk" />
          <hr className="mt-8 w-full border border-solid border-neutral-200" />
          {selectedTask && <ControlMeasures />}
          <hr className="mt-8 w-full border border-solid border-neutral-200" />
          <RiskSection riskItems={rriskItems} title="Residual Risk" />
          <hr className="mt-8 w-full border border-solid border-neutral-200" />
          {selectedTask &&
            selectedTask.approvals &&
            selectedTask.approvals.length > 0 && <TaskApprovalHistory />}
        </div>
      </article>
      {isTaskApprover &&
        [
          TaskStatusEnum.PendingApproval,
          TaskStatusEnum.RejectedPendingApproval,
        ].includes(selectedTask.status) && (
          <div className="px-20 flex flex-row justify-center gap-10 mt-20">
            <ButtonRisk
              onClick={() => {
                setIsEditControlMeasure(false);
                // setTimeout(() => {
                  setPopupType(TaskPopupType.SendBack);
                  setIsOpen(true);
                // }, 1000);
              }}
              variant="reject"
              type="button"
            >
              Send For Revision
            </ButtonRisk>
            {/* <SendForRevision
              openRevision={openRevision}
              riskId={riskId}
              setIsOpenRevision={setOpenRevision}
            /> */}
            <ButtonRisk
              onClick={() => {
                setIsOpen(true);
                setPopupType(TaskPopupType.Approve);
              }}
              variant="approve"
              type="button"
            >
              Approve
            </ButtonRisk>
            <TaskActions
              setIsOpenComment={setIsOpen}
              openComment={isOpen}
              riskId={riskId}
              popupType={popupType}
            />
          </div>
        )}
      {isCurrentUserPartOfTeam &&
        [TaskStatusEnum.Draft, TaskStatusEnum.RejectedPendingReview].includes(
          selectedTask.status
        ) && (
          <div className="px-20 flex flex-row justify-center gap-10 mt-20">
            {/* <ButtonRisk
              onClick={() => {
                setIsOpen(true);
                setPopupType(TaskPopupType.SubmitforApproval);
              }}
              variant="approve"
              type="button"
            >
              Submit for Approval
            </ButtonRisk> */}
            <TaskActions
              setIsOpenComment={setIsOpen}
              openComment={isOpen}
              riskId={riskId}
              popupType={popupType}
            />
          </div>
        )}
    </Paper>
  );
};
export default TaskDetailsCard;
