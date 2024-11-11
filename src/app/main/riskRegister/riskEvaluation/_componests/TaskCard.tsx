import { Chip } from "@mui/material";
import React from "react";

interface TaskCardProps {
  id: string;
  severityScore: number;
  risk: number;
  description: string;
  highlighted?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  severityScore,
  risk,
  description,
  highlighted = false,
}) => {
  return (
    <article
      className={`flex flex-col grow shrink justify-center self-stretch p-10 my-auto bg-white rounded-lg ${highlighted ? "border-blue-700 border-solid border-[3px] shadow-[0px_0px_20px_rgba(14,65,244,0.2)]" : "border-gray-300 border-2"} min-w-[240px] w-[326px] max-md:px-5`}
    >
      <div className="flex flex-col w-full">
        <header className="flex gap-10 justify-between items-center w-full text-lg font-semibold whitespace-nowrap text-zinc-800">
          <h3 className="self-stretch my-auto">{id}:</h3>
          <input
            type="checkbox"
            className="self-stretch my-auto"
            aria-label="Select Task"
            style={{ width: "20px", height: "20px" }}
          />
        </header>
        <div className="flex gap-10 justify-between items-center mt-6 w-full">
          <div className="flex flex-col justify-center self-stretch my-auto">
            <h5 className="font-medium text-gray-600">Severity Score</h5>
            <p className="mt-2 font-semibold text-zinc-800">
              {severityScore}/10
            </p>
          </div>
          <RiskCard risk={risk} />
        </div>
        <div className="flex flex-col mt-6 max-w-full w-[360px]">
          <h5 className="font-medium text-gray-600">Task Description</h5>
          <p className="mt-3 text-neutral-400">{description}</p>
        </div>
        <div className="flex flex-col mt-6 max-w-full">
          <Chip
            sx={{ maxWidth: "fit-content", whiteSpace: "nowrap" }}
            label="Pending Approval"
            color="info"
            variant="outlined"
            size="small"
          />
        </div>
      </div>
    </article>
  );
};

const RiskCard = ({ risk }: { risk: number }) => {
  const bgColor = risk > 50 ? "bg-red-800" : "bg-blue-500";
  return (
    <div
      className={`flex gap-1 items-center text-white rounded-md self-stretch p-2 my-auto font-medium text-lime-800 whitespace-nowrap ${bgColor}`}
    >
      <span className="self-stretch my-auto">Risk:</span>
      <span className="self-stretch my-auto">{risk}%</span>
    </div>
  );
};

export default TaskCard;
