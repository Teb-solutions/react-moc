import { Icon, Paper } from "@mui/material";
import InfoItem from "./InfoItem";

import Bar from "src/app/main/documentation/third-party-components/react-apexcharts/examples/Bar";
import Line from "src/app/main/documentation/third-party-components/react-apexcharts/examples/Line";
const infoItems = [
  { label: "Category", value: "Routine" },
  { label: "Site", value: "Mumbai" },
  { label: "Division", value: "LPG" },
  { label: "Area", value: "Headquarters" },
  { label: "Date", value: "10-10-2024" },
  { label: "Initiator", value: "Shruti" },
];
const taskItems = [
  { label: "Total", value: "9" },
  { label: "High Risk", value: "5" },
];
const teamItems = [
  { label: "Site HSE", value: "Vijay Sharma" },
  { label: "Project In Charge", value: "Naveen P" },
  { label: "Maintenance In Charge", value: "Jose Marvin" },
  { label: "HSE In Charge", value: "Vineeth PK" },
  { label: "SIC Approval", value: "Vineeth PK approved on 10-10-2024" },
];
const RiskInitiation = () => {
  return (
    <Paper className="flex flex-col p-10">
      <h3 className="self-stretch font-bold text-blue-600 mb-5 ml">Summary </h3>
      <article className="flex overflow-hidden flex-col justify-center items-start p-10 text-md bg-white rounded-lg">
        <div className="flex flex-col items-start w-full">
          <h4 className="self-stretch mb-5 font-medium text-neutral-600">
            {"Test Title Lorem ipsum dolor sit amet consectetur"}
          </h4>
          <p className="self-stretch mb-10 text-lg text-gray-500">
            {
              "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin."
            }
          </p>
          <div className="flex mt-5  flex-col sm:flex-row w-full">
            <div className="w-full sm:w-1/3 pr-2 text-md">
              {infoItems.map((item, index) => (
                <InfoItem key={index} label={item.label} value={item.value} />
              ))}
              <h4 className="self-stretch text-blue-600 font-medium text-neutral-600">
                Tasks
              </h4>
              {taskItems.map((item, index) => (
                <InfoItem key={index} label={item.label} value={item.value} />
              ))}
            </div>
            <div className="w-full sm:w-1/3 pl-2 text-md">
              <h4 className="self-stretch text-blue-600 font-medium text-neutral-600">
                HIRA Team
                <Icon className="ml-5" fontSize="inherit">
                  edit
                </Icon>
              </h4>
              {teamItems.map((item, index) => (
                <InfoItem key={index} label={item.label} value={item.value} />
              ))}
            </div>
            <div className="w-full sm:w-1/3 mb-0">
              <Line />
            </div>
          </div>
        </div>
      </article>
    </Paper>
  );
};
export default RiskInitiation;
