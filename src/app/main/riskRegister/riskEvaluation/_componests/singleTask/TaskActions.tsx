import { TextField } from "@mui/material";
import Button from "../../../common/Button";
import CommonModal from "../../../common/CommonModal";
import { RiskActionType, TaskPopupType } from "../../../helpers/enum";
import { set } from "lodash";
import { useTaskStore } from "../common/taskStore";
import { apiAuth } from "src/utils/http";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { useState } from "react";
import ControlMeasures from "./ControlMeasures";

const titleMap: { [key in TaskPopupType]: string } = {
  [TaskPopupType.Approve]: "Send for Approval",
  [TaskPopupType.Delete]: "Delete Task",
  [TaskPopupType.Audit]: "Add/View Audit",
  [TaskPopupType.SubmitforApproval]: "Submit for Approval",
};

const messageMap: { [key in TaskPopupType]: string } = {
  [TaskPopupType.Approve]: "Are you sure you want to approve this task?",
  [TaskPopupType.Delete]: "Are you sure you want to delete this task?",
  [TaskPopupType.Audit]: "Are you sure you want to add audit?",
  [TaskPopupType.SubmitforApproval]:
    "Are you sure you want to submit this task for approval?",
};

const TaskActions = ({
  popupType,
  openComment,
  setIsOpenComment,
  riskId,
}: {
  popupType: number;
  openComment: boolean;
  setIsOpenComment: (value: boolean) => void;
  riskId: string;
}) => {
  const title = titleMap[popupType];
  const message = messageMap[popupType];
  const { selectedTask } = useTaskStore();
  const [comment, setComment] = useState<string | null>(null);
  const [commentValidation, setCommentValidation] = useState<string | null>(
    null
  );

  const handleTaskApproval = () => {
    if (!comment) {
      setCommentValidation("Comment is required");
      return;
    }
    apiAuth
      .post(`/RiskRegister/task/approval/${selectedTask.taskId}/${riskId}`, {
        taskId: selectedTask.taskId,
        riskRegisterId: riskId,
        comments: comment,
        actionType: RiskActionType.Approve,
        controlMeasures: selectedTask.controlMeasures,
        // sendBackToApprWfId: 0,
      })
      .then((response) => {
        if (response.data.statusCode == 200) {
          toast.success(response.data.message);
          mutate(`/RiskRegister/task/list/${riskId}`);
          mutate(`/RiskRegister/task/detail/${selectedTask.taskId}`);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to approve task");
      })
      .finally(() => {
        setIsOpenComment(false);
        setComment(null);
      });
  };

  const handleTaskSubmitForApproval = () => {
    apiAuth
      .post(
        `/RiskRegister/task/submit/approval/${selectedTask.taskId}/${riskId}`
      )
      .then((response) => {
        if (response.data.statusCode == 200) {
          toast.success(response.data.message);
          mutate(`/RiskRegister/task/list/${riskId}`);
          mutate(`/RiskRegister/task/detail/${selectedTask.taskId}`);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to submit task for approval");
      })
      .finally(() => {
        setIsOpenComment(false);
      });
  };

  return (
    <CommonModal
      open={openComment}
      handleClose={() => setIsOpenComment(false)}
      title={title}
    >
      <div className="flex flex-col">
        <div className="flex flex-col my-20">
          <p>{message}</p>
          {popupType != TaskPopupType.SubmitforApproval && (
            <div className="flex flex-col my-20">
              <TextField
                className="mt-10"
                id="outlined-basic"
                label="Comment*"
                variant="outlined"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setCommentValidation(null);
                }}
              />
              {commentValidation && (
                <p className="text-red-500">{commentValidation}</p>
              )}
            </div>
          )}
          {popupType === TaskPopupType.Audit && <ViewAudits />}
        </div>
        <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
          <Button
            onClick={() => {
              setIsOpenComment(false);
            }}
            type="button"
            variant="neutral"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (popupType === TaskPopupType.SubmitforApproval) {
                handleTaskSubmitForApproval();
              } else if (popupType === TaskPopupType.Approve) {
                handleTaskApproval();
              }
            }}
            type="button"
            variant="approve"
          >
            Submit
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};
export default TaskActions;

interface Audit {
  auditComment: string;
  auditedByName: string;
  auditDateTime: string; // You can use Date type if you prefer
}

const audits: Audit[] = [
  {
    auditComment: "Initial review completed.",
    auditedByName: "John Doe",
    auditDateTime: "2023-10-01T10:00:00Z",
  },
  {
    auditComment: "Follow-up review completed.",
    auditedByName: "Jane Smith",
    auditDateTime: "2023-10-02T14:30:00Z",
  },
  {
    auditComment: "Final review completed.",
    auditedByName: "Alice Johnson",
    auditDateTime: "2023-10-03T09:15:00Z",
  },
];

const ViewAudits = () => {
  return (
    <div>
      <h2>Audit History</h2>
      <ul className="mt-5">
        {audits.map((audit, index) => (
          <li key={index}>
            <p>
              <strong>Comment:</strong> {audit.auditComment}
            </p>
            <p className="ml-10">
              <span className="font-medium"> By:</span> {audit.auditedByName},
              on {new Date(audit.auditDateTime).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
