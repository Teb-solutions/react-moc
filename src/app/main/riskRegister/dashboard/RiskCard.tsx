import { ArrowForward } from "@material-ui/icons";

import { Button, Card } from "@mui/material";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router";
import { IHiraList } from "../helpers/type";
import { RiskCategory, RiskRegisterStatus } from "../helpers/enum";

const colorPicker = (text: number) => {
  switch (text) {
    case 0:
      return "bg-green-600 text-green-600";
    default:
      return "bg-pink-700 text-pink-700";
  }
};
const Badge = ({ text }: { text: number }) => {
  const color = colorPicker(text);
  return (
    <span
      className={`gap-2.5 self-stretch px-5 py-2 my-auto text-md font-medium ${color} bg-opacity-10 rounded-[90px]`}
    >
      High Risk Tasks: {text}
    </span>
  );
};

const RiskCard = ({ risk }: { risk: IHiraList }) => {
  const navigation = useNavigate();
  return (
    <Card className="flex flex-col shadow w-full">
      <div className="flex flex-col pt-24 text-lg w-full">
        <header className="flex justify-between items-center px-24">
          <div className="flex gap-5 items-center">
            {/* <Badge text={risk.category} /> */}
            <h2 className="text-xl font-medium text-slate-500">
              {risk.hiranumber}
            </h2>
          </div>
          <div
            className={`flex items-start self-stretch my-auto text-lg ${risk.highRiskTaskCount > 0 ? "text-red-400" : "text-green-400"} `}
          >
            <div className="flex flex-wrap gap-5 items-start">
              <div className="font-semibold">
                <Badge text={risk.highRiskTaskCount || 0} />
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-col text-md my-20 px-24">
          <div className="flex flex-wrap gap-5 items-start w-full text-slate-500">
            <div className="text-gray-500 font-normal">Initiated by:</div>
            <div className="text-zinc-800 font-medium">
              {risk.initiatedbyStaffName || risk.siteInChargeName}
            </div>
            <div className="text-gray-500">on</div>
            <div className=" text-zinc-700 font-medium">
              {dayjs(risk.date).format("MMMM DD, YYYY")}
            </div>
          </div>
          <div className="flex flex-wrap gap-5 items-start mt-10 w-full text-slate-500">
            <div className="text-gray-500 font-normal">Division:</div>
            <div className="text-zinc-800 font-medium">{risk.divisionName}</div>
          </div>
          <div className="flex gap-10 justify-between items-start mt-10 w-full">
            <div className="flex flex-wrap gap-5 items-start">
              <div className="text-gray-500 font-normal">Site Name:</div>
              <div className="text-zinc-700 font-medium">{risk.siteName}</div>
            </div>
            <div className="flex items-start">
              <div className="flex flex-wrap gap-5 items-start">
                <div className="text-gray-500 font-normal">Task Count:</div>
                <div className="text-zinc-800 font-medium">
                  {risk?.taskCount || 0}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start mt-10 w-full">
            <div className="flex flex-wrap gap-5 items-start">
              <div className="text-gray-500 font-normal">Project Name:</div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 1000 }}
                title={risk.projectName}
                arrow
              >
                <div className="text-zinc-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]">
                  {risk.projectName}
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-0 border-1 bg-blue-700 bg-opacity-10  p-10">
          <div className="my-auto text-lg font-medium text-slate-500 px-14">
            {/* {risk.divisionName} */}
            {RiskCategory[risk.category].replace("_", " ")}
          </div>
          <Button
            onClick={() => {
              risk.status === RiskRegisterStatus.Evaluation
                ? navigation(`/risk/riskevaluation/${risk.id}`)
                : navigation(`/risk/approverisk/${risk.id}`);
            }}
            variant="outlined"
            size="small"
            color="info"
          >
            View
            <ArrowForward />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RiskCard;
