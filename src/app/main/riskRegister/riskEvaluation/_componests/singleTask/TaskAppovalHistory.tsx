import { Check, CheckBox } from "@mui/icons-material";
import { Box, Icon, Popper } from "@mui/material";
import React from "react";
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
  return (
    <div className="mt-5">
      <h3 className="text-base font-semibold text-zinc-800">
        Task Approval History
      </h3>
      {approvers.map((item, index) => (
        <TaskApprovalItem approver={item.name} time={item.date} key={index} />
      ))}
    </div>
  );
};

const TaskApprovalItem = ({ approver, time }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  return (
    <div className="flex flex-row mt-5 w-full justify-between">
      <div>
        <Icon className="text-green-500">check</Icon>
        <span className="font-semibold">
          {approver}
          <span className="ml-4 text-gray-600 text-sm font-normal">
            on {time} AM
          </span>
        </span>
      </div>
      <div>
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
              CoHSE Sreejith Menen approved
            </h6>
            <div className="flex flex-col gap-2">
              <h6 className="font-semibold text-gray-500">Comments</h6>
              <p className="text-gray-800 text-sm font-normal">
                Lorem Ispum Test Comment entered{" "}
              </p>
            </div>
          </Box>
        </Popper>
      </div>
    </div>
  );
};

export default TaskApprovalHistory;
