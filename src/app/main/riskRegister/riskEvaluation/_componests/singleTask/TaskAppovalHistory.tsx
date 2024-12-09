import {
  Cancel,
  CancelTwoTone,
  Check,
  CheckBox,
  CheckCircleOutlineTwoTone,
  CheckCircleTwoTone,
  Info,
  InfoSharp,
  InfoTwoTone,
} from "@mui/icons-material";
import { Alert, Box, Icon, Popper } from "@mui/material";
import React from "react";
import { useTaskStore } from "../common/taskStore";
import { IApprovals } from "../../../helpers/type";
import dayjs from "dayjs";
import {
  RiskActionType,
  RiskRegisterTeamRoleDisplayNames,
} from "../../../helpers/enum";
const approvers = [
  {
    name: "SIC",
    date: "10-10-2024 10:10",
  },
  {
    name: "CO HSE",
    date: "10-10-2024 10:10",
  },
  {
    name: "VP HSE",
    date: "10-10-2024 10:10",
  },
  {
    name: "VP HSE",
    date: "10-10-2024 10:10",
  },
];
const TaskApprovalHistory = () => {
  const { selectedTask } = useTaskStore();
  // console.log(selectedTask);
  return (
    <div className="mt-5 mb-10">
      <h3 className="text-base font-semibold text-zinc-800">
        Task Approval History
      </h3>
      {selectedTask.approvals?.map((item, index) => (
        <TaskApprovalItem approvalItem={item} key={index} />
      ))}
    </div>
  );
};

const TaskApprovalItem = ({ approvalItem }: { approvalItem: IApprovals }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  return (
    <div className="flex mb-5 flex-row w-full justify-between items-center">
      <div className="flex items-center">
        <Icon className="border-0 mt-2" fontSize="large">
          {approvalItem.isActive ? (
            <InfoTwoTone className="text-amber-800" />
          ) : approvalItem.actionType == RiskActionType.Approve ? (
            <CheckCircleTwoTone className="text-green-500" />
          ) : (
            <CancelTwoTone className="text-red-500" />
          )}
        </Icon>{" "}
        <div className="flex flex-row font-semibold mt-20">
          <div className="flex flex-col gap-2">
            {RiskRegisterTeamRoleDisplayNames[approvalItem.role]}
            <span className="text-gray-600 text-sm font-normal">
              {approvalItem.staffName}
              {approvalItem.isActive && "'s approval is pending"}

              {!approvalItem.isActive &&
                !approvalItem.completedAt &&
                approvalItem.actionType == RiskActionType.Approve &&
                ` approved`}
              {!approvalItem.isActive &&
                !approvalItem.completedAt &&
                approvalItem.actionType == RiskActionType.SendBack &&
                ` sent back to review`}
              {!approvalItem.isActive &&
                approvalItem.completedAt &&
                ` on ${dayjs(approvalItem.completedAt).format("MMM DD, YYYY")}`}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Icon
          aria-describedby={id}
          onClick={handleClick}
          className="text-blue-700 text-xl cursor-pointer"
        >
          sms
        </Icon>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
            <h6 className="flex flex-col gap-2 text-gray-700 mb-5">
              {approvalItem.staffName}
            </h6>

            <div className="flex flex-col gap-2">
              <h6 className="font-semibold text-gray-500">Approval Status</h6>
              <p className="text-gray-800 text-sm font-normal">
                {approvalItem.isActive
                  ? "Approval Pending"
                  : approvalItem.actionType == RiskActionType.Approve
                    ? "Approved"
                    : "Sent back to review"}
              </p>
              <p className="text-gray-800 text-sm font-normal">
                Assigned on:{" "}
                {dayjs(approvalItem.startedAt).format("MMM DD, YYYY")}
              </p>
              {approvalItem.completedAt && (
                <p className="text-gray-800 text-sm font-normal">
                  Completed on:{" "}
                  {dayjs(approvalItem.completedAt).format("MMM DD, YYYY")}
                </p>
              )}
            </div>

            {approvalItem.comments && (
              <div className="flex flex-col gap-2">
                <h6 className="font-semibold text-gray-500">Comments</h6>
                <p className="text-gray-800 text-sm font-normal">
                  {approvalItem.comments}
                </p>
              </div>
            )}
          </Box>
        </Popper>
      </div>
    </div>
  );
};

export default TaskApprovalHistory;
