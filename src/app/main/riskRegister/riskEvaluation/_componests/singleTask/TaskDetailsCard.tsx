import { Box, Button, Icon, Paper, Popover, Typography } from "@mui/material";
import InfoSection from "./InfoSection";
import RiskSection from "./RiskSection";
import ControlMeasures from "./ControlMeasures";
import TaskApprovalHistory from "./TaskAppovalHistory";
import ButtonRisk from "../../../common/Button";
import { useEffect, useMemo, useState } from "react";
import SendForRevision from "./SendForRevision";
import AddComment from "./AddComment";
import { TaskPopupType } from "../../../helpers/enum";
import VersionHistory from "./VersionHistory";
import TaskButton from "../../../common/TaskButton";
import { Task } from "@mui/icons-material";
import { useRiskStore } from "../common/riskstore";
import { useTaskStore } from "../common/taskStore";
import { ITask } from "../../../helpers/type";
import { toast } from "react-toastify";
import { apiAuth } from "src/utils/http";
import useFetchLookUpData from "../common/useFetchLookUpData";
interface RiskItemProps {
  label: string;
  value: string;
}

const TaskDetailsCard = () => {
  const { isCurrentUserPartOfTeam, isTaskApprover } = useRiskStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openRevision, setOpenRevision] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [popupType, setPopupType] = useState(0);
  const handleRevision = () => {
    setOpenRevision(!openRevision);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const { selectedTask } = useTaskStore();
  //task details and selectedtask contain same task, but in the taskdetails control measures and approval details will be fetched
  const [taskDetails, setTaskDetails] = useState<ITask | null>(null);

  const priskItems: RiskItemProps[] = useMemo(
    () => [
      {
        label: "Time",
        value: selectedTask.time ? selectedTask.time.toString() : "NA",
      },
      {
        label: "Frequency",
        value: selectedTask.frequencyDetails
          ? selectedTask.frequencyDetails.toString()
          : "0",
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
    ],
    [selectedTask]
  );

  const rriskItems: RiskItemProps[] = useMemo(
    () => [
      {
        label: "Time",
        value: selectedTask.modifiedTime
          ? selectedTask.modifiedTime.toString()
          : "0",
      },
      {
        label: "Frequency",
        value: selectedTask.modifiedFrequencyDetails
          ? selectedTask.modifiedFrequencyDetails.toString()
          : "0",
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
    ],
    [selectedTask]
  );
  useEffect(() => {
    apiAuth
      .get(`/RiskRegister/task/detail/${selectedTask.taskId}`)
      .then((response) => {
        if (response.data.statusCode == 200) {
          setTaskDetails(response.data.data);
        } else {
          setTaskDetails(null);
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        setTaskDetails(null);
        toast.error("Failed to fetch task");
      });
  }, [selectedTask]);

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
              {(isCurrentUserPartOfTeam || isTaskApprover) && (
                <TaskButton
                  onClick={() => {
                    setIsOpen(true);
                    setPopupType(TaskPopupType.Audit);
                  }}
                  icon="add"
                  text="Audits"
                />
              )}
              {isCurrentUserPartOfTeam && (
                <TaskButton onClick={() => {}} icon="edit" text="Edit" />
              )}

              {isCurrentUserPartOfTeam && (
                <TaskButton
                  onClick={() => {
                    setIsOpen(true);
                    setPopupType(TaskPopupType.Delete);
                  }}
                  icon="delete"
                  text="Delete"
                />
              )}

              <TaskButton
                onClick={() => {
                  setIsVersionOpen(true);
                }}
                icon="history"
                text="Versions"
              />
            </Typography>
          </Popover>
          <VersionHistory isOpen={isVersionOpen} setIsOpen={setIsVersionOpen} />
        </div>
      </header>
      <hr className="w-full border border-solid border-neutral-200" />
      <article
        className="flex flex-col px-6 bg-white rounded-lg"
        style={{ maxHeight: "75vh", overflowY: "auto" }}
      >
        <div className="flex flex-col mt-5">
          {selectedTask && <InfoSection />}
          <RiskSection riskItems={priskItems} title="Potential Risk" />
          <hr className="mt-8 w-full border border-solid border-neutral-200" />
          {taskDetails && <ControlMeasures taskDetails={taskDetails} />}
          <hr className="mt-8 w-full border border-solid border-neutral-200" />
          <RiskSection riskItems={rriskItems} title="Residual Risk" />
          <hr className="mt-8 w-full border border-solid border-neutral-200" />
          {taskDetails && <TaskApprovalHistory />}
        </div>
      </article>
      {isTaskApprover && (
        <div className="px-20 flex flex-row justify-center gap-10 mt-20">
          <ButtonRisk onClick={handleRevision} variant="reject" type="button">
            Send For Revision
          </ButtonRisk>
          <SendForRevision
            openRevision={openRevision}
            handleRevision={handleRevision}
          />
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
          <AddComment
            openComment={isOpen}
            handleComment={() => setIsOpen(false)}
            popupType={popupType}
          />
        </div>
      )}
      {isCurrentUserPartOfTeam && (
        <div className="px-20 flex flex-row justify-center gap-10 mt-20">
          <ButtonRisk
            onClick={() => {
              setIsOpen(true);
              setPopupType(TaskPopupType.SubmitforApproval);
            }}
            variant="approve"
            type="button"
          >
            Submit for Approval
          </ButtonRisk>
          <AddComment
            openComment={isOpen}
            handleComment={() => setIsOpen(false)}
            popupType={popupType}
          />
        </div>
      )}
    </Paper>
  );
};
export default TaskDetailsCard;
