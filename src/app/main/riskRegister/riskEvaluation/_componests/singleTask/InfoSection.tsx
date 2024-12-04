import React, { useMemo } from "react";
import { useTaskStore } from "../common/taskStore";
import useFetchLookUpData from "../common/useFetchLookUpData";
import { riskClassificationDisplay } from "src/app/main/moc/common_components/RiskAnalysisCalculate";
import { TaskStatusDisplayNames } from "../../../helpers/enum";

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="flex gap-10 mt-10  justify-between p-5 items-start w-full">
    <div className="text-neutral-400">{label}:</div>
    <div className="font-medium text-neutral-600 text-right">{value}</div>
  </div>
);

const InfoSection: React.FC = () => {
  const { selectedTask } = useTaskStore();
  const hazardTypeUrl = "/LookupData/Lov/28";
  const {
    data: hazardTypes,
    loading: hazardLoading,
    error: hazardError,
  } = useFetchLookUpData(hazardTypeUrl);

  const infoItems: InfoItemProps[] = useMemo(
    () => [
      {
        label: "Task",
        value: selectedTask.taskName,
      },
      { label: "Subtask", value: selectedTask.subTaskName },
      { label: "Area", value: "Terminal 1?????" },
      { label: "Role", value: "Project In Charge?????" },
      {
        label: "Hazard Type",
        value:
          hazardTypes &&
          hazardTypes.filter(
            (item) => item.value === selectedTask.hazardType
          )[0]?.text,
      },
      {
        label: "Hazardous Situation",
        value: selectedTask.hazardousSituation,
      },
      {
        label: "Consequnces",
        value: selectedTask.consequence,
      },
      {
        label: "Status",
        value: TaskStatusDisplayNames[selectedTask.status],
      },
      {
        label: "Risk",
        value:
          riskClassificationDisplay(selectedTask.residualRiskClassification) +
          " (" +
          selectedTask.residualRiskClassification +
          ")",
      },
    ],
    [selectedTask, hazardTypes]
  );

  return (
    <section className="flex flex-col mt-6 w-full">
      <div className="flex flex-col justify-center w-full text-sm">
        {infoItems.map((item, index) => (
          <InfoItem key={index} label={item.label} value={item.value} />
        ))}
      </div>
      <hr className="mt-8 w-full border border-solid border-neutral-200" />
    </section>
  );
};

export default InfoSection;
