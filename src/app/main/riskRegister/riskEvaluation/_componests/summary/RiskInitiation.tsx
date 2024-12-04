import { Box, Icon, Paper, Popper } from "@mui/material";

import Line from "src/app/main/documentation/third-party-components/react-apexcharts/examples/Line";
import { IRiskRegisterDetails, LabelValue } from "../../../helpers/type";
import {
  RiskCategory,
  RiskCategoryToTeamRoleMapping,
  RiskClassification,
  RiskRegisterTeamRoleDisplayNames,
} from "../../../helpers/enum";
import dayjs from "dayjs";
import { DoDisturb, Info } from "@mui/icons-material";
import { id } from "date-fns/locale";
import { useEffect, useState } from "react";

import InitationInfoItem from "./InfoItem";
import { useRiskStore } from "../common/riskstore";
import { useTaskStore } from "../common/taskStore";
import PieChart from "./PieChart";
import LineChart from "./LineChart";

const RiskInitiation = () => {
  const { risk } = useRiskStore();
  const infoItems = [
    { label: "Category", value: RiskCategory[risk.category] },
    { label: "Site", value: risk.siteName },
    { label: "Division", value: risk.divisionName },
    { label: "Area", value: "??????" },
    { label: "Date", value: dayjs(risk.date).format("MMM DD, YYYY") },
    { label: "Initiator", value: risk.siteInChargeName + "******" }, //change this value
  ];
  const teamItems = [];
  risk.teamList.forEach((team) => {
    teamItems.push({
      label: RiskRegisterTeamRoleDisplayNames[team.teamType],
      value: team.staffName,
    });
  });

  const { tasks } = useTaskStore();
  const [highRiskTasks, setHighRiskTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const highRiskTasks = tasks.filter(
      (task) =>
        Number(task.residualRiskClassification) === RiskClassification.HighRisk
    );
    const totalTasks = tasks.length;
    setHighRiskTasks(highRiskTasks.length);
    setTotalTasks(totalTasks);
  }, [tasks]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const [selectedHeader, setSelectedHeader] = useState("Summary");

  return (
    <Paper className="flex flex-col">
      <div
        className="flex flex-row gap-20 bg-blue-600 rounded-t-md px-10 pt-10"
        // style={{ background: "#3f51b5" }}
      >
        <h3
          onClick={() => setSelectedHeader("Summary")}
          className={`self-stretch font-bold ${selectedHeader == "Summary" ? "text-gray-700 bg-white rounded-t-md" : "text-white"} cursor-pointer ml px-10 py-4`}
        >
          Summary{" "}
        </h3>
        <h3
          onClick={() => setSelectedHeader("TaskDetails")}
          className={`self-stretch font-bold ${selectedHeader == "TaskDetails" ? "text-gray-700 bg-white rounded-t-md" : "text-white"}  cursor-pointer ml px-10 py-4`}
        >
          Task Details{" "}
        </h3>
      </div>
      <article
        className={`${selectedHeader == "Summary" ? "flex" : "hidden"} overflow-hidden flex-col justify-center items-start p-10 text-md bg-white rounded-lg`}
      >
        <div className="flex flex-col items-start w-full">
          <h4 className="self-stretch mb-5 font-medium text-neutral-600">
            {risk.projectName}
          </h4>
          <p className="self-stretch mb-10 text-lg text-gray-500">
            {risk.projectDescription}
          </p>
          <div className="flex mt-5  flex-col sm:flex-row w-full">
            <div className="w-full sm:w-1/3 pr-2 text-md">
              {infoItems.map((item, index) => (
                <InitationInfoItem
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
              {/* <h4 className="self-stretch text-blue-600 font-medium text-neutral-600">
                Tasks
              </h4>
              <div className="bg-blue-50 border-1 shadow-lg p-2 rounded-md text-blue-500">
                <InitationInfoItem
                  label={"Total Tasks"}
                  value={totalTasks.toString()}
                />
                <InitationInfoItem
                  label={"High Risk Tasks"}
                  value={highRiskTasks.toString()}
                />
              </div> */}
            </div>
            <div className="w-full sm:w-1/3 pl-2 text-md">
              <h4 className="self-stretch text-blue-600 font-medium text-neutral-600">
                HIRA Team
                <Icon className="ml-5" fontSize="inherit">
                  edit
                </Icon>
              </h4>
              {teamItems.map((item, index) => (
                <InitationInfoItem
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
              <div className="flex flex-row mt-5">
                <InitationInfoItem
                  label="SIC Approval"
                  value={
                    risk.siteInChargeName +
                    " approved on " +
                    dayjs(risk.activities[1].completedDate).format(
                      "MMM DD, YYYY"
                    )
                  }
                />
                <Icon
                  aria-describedby={id}
                  onClick={handleClick}
                  className="ml-5"
                  fontSize="inherit"
                >
                  comment
                </Icon>
                <Popper id={id} open={open} anchorEl={anchorEl}>
                  <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
                    <div className="flex flex-col gap-2">
                      <h6 className="font-semibold text-gray-500">Comments</h6>
                      <p className="text-gray-800 text-sm font-normal">
                        {risk.activities[1].assignedToStaffName +
                          "******comment required"}
                      </p>
                    </div>
                  </Box>
                </Popper>
              </div>
            </div>
            <div className="w-full sm:w-1/3 mb-0">
              <LineChart />
            </div>
          </div>
        </div>
      </article>
      <article
        className={`${selectedHeader == "TaskDetails" ? "flex" : "hidden"} overflow-hidden flex-col justify-center items-start p-10 text-md bg-white rounded-lg`}
      >
        <div className="flex flex-col items-start w-full">
          <h4 className="self-stretch mb-5 font-medium text-neutral-600">
            {risk.projectName}
          </h4>
          <p className="self-stretch mb-10 text-lg text-gray-500">
            {risk.projectDescription}
          </p>
          <div className="flex mt-5  flex-col sm:flex-row w-full">
            <div className="w-full sm:w-1/3 pr-2 text-md">
              <InitationInfoItem
                label={"Total Tasks"}
                value={totalTasks.toString()}
              />
              <InitationInfoItem
                label={"High Risk Tasks"}
                value={highRiskTasks.toString()}
                color="text-red-500"
              />
              <InitationInfoItem
                label={"Significant Risk Tasks"}
                value={tasks
                  .filter(
                    (task) =>
                      Number(task.residualRiskClassification) ===
                      RiskClassification.SignificantRisk
                  )
                  .length.toString()}
                color="text-orange-700"
              />
              <InitationInfoItem
                label={"Average Risk Tasks"}
                value={tasks
                  .filter(
                    (task) =>
                      Number(task.residualRiskClassification) ===
                      RiskClassification.AverageRisk
                  )
                  .length.toString()}
                color="text-amber-700"
              />
              <InitationInfoItem
                label={"Low Risk Tasks"}
                value={tasks
                  .filter(
                    (task) =>
                      Number(task.residualRiskClassification) ===
                      RiskClassification.LowRisk
                  )
                  .length.toString()}
                color="text-yellow-600"
              />
              <InitationInfoItem
                label={"Very Low Risk Tasks"}
                value={tasks
                  .filter(
                    (task) =>
                      Number(task.residualRiskClassification) ===
                      RiskClassification.VeryLowRisk
                  )
                  .length.toString()}
                color="text-green-500"
              />
            </div>
            <div className="w-full sm:w-1/3 mb-0">
              <PieChart />
            </div>
            <div className="w-full sm:w-1/3 mb-0">
              <LineChart />
            </div>
          </div>
        </div>
      </article>
    </Paper>
  );
};
export default RiskInitiation;
