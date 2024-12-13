import { Icon } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { ITask } from "../../../helpers/type";
import { ControlMeasuresType, TaskStatusEnum } from "../../../helpers/enum";
import { useMemo, useState } from "react";
import { useTaskStore } from "../common/taskStore";
import { Edit } from "@mui/icons-material";
import EditControlMeasures from "./EditControlMeasures";
import { useControlMeasureStore } from "../common/controlMeasureStore";
import { useRiskStore } from "../common/riskstore";

const ControlMeasures = () => {
  const { selectedTask } = useTaskStore();
  const { isTaskApprover } = useRiskStore();
  const { isEditControlMeasure, setIsEditControlMeasure } =
    useControlMeasureStore();

  const controlMeasuresDisplay = useMemo(() => {
    const humanControlMeasures = selectedTask.controlMeasures.filter(
      (measure) => measure.type === ControlMeasuresType.Human
    );
    const technicalControlMeasures = selectedTask.controlMeasures.filter(
      (measure) => measure.type === ControlMeasuresType.Technical
    );
    const organizationalControlMeasures = selectedTask.controlMeasures.filter(
      (measure) => measure.type === ControlMeasuresType.Organizational
    );
    const controlMeasuresDisplay = [
      {
        label: "Human",
        value: humanControlMeasures.map((measure) => measure.controlMeasure),
      },
      {
        label: "Technical",
        value: technicalControlMeasures.map(
          (measure) => measure.controlMeasure
        ),
      },
      {
        label: "Organizational",
        value: organizationalControlMeasures.map(
          (measure) => measure.controlMeasure
        ),
      },
    ];
    return controlMeasuresDisplay;
  }, [selectedTask]);

  return (
    <section className="flex flex-col mt-8 w-full">
      <div className="flex flex-row justify-between items-center w-full">
        <h2 className="text-lg font-semibold text-zinc-800">
          Control Measures
        </h2>
        {isTaskApprover &&
          [
            TaskStatusEnum.PendingApproval,
            TaskStatusEnum.RejectedPendingApproval,
          ].includes(selectedTask.status) && (
            <Icon
              onClick={() => setIsEditControlMeasure(!isEditControlMeasure)}
              className="text-lg text-blue-600 rounded-sm border-1 border-blue-600 cursor-pointer"
            >
              edit
            </Icon>
          )}
      </div>

      <div className="flex flex-col mt-6 w-full text-sm">
        {!isEditControlMeasure &&
          controlMeasuresDisplay.map((item, index) => (
            <ControlMeasureItem
              key={index}
              label={item.label}
              value={item.value}
            />
          ))}
        {isEditControlMeasure && (
          // <EditControlMeasures isOpen={isEditOpen} setIsOpen={setIsEditOpen} />
          <EditControlMeasures />
        )}
      </div>
    </section>
  );
};

function ControlMeasureItem({
  label,
  value,
}: {
  label: string;
  value: string[];
}) {
  return (
    <div className="flex flex-col gap-5 mt-10 justify-between items-start w-full">
      <div className="text-neutral-400 font-semibold flex flex-row justify-between w-full">
        {label}
      </div>
      <div className="text-neutral-600 text-sm  px-20">
        <ul>
          {value.map((item, index) => (
            <li key={index}>
              {index + 1}. {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ControlMeasures;
