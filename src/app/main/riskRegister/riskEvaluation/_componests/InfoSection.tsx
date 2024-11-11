import React from "react";

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
  const infoItems: InfoItemProps[] = [
    {
      label: "Task",
      value:
        "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin. ",
    },
    // { label: "Subtask Title", value: "Text" },
    { label: "Area", value: "Terminal 1" },
    { label: "Role", value: "Project In Charge" },
    { label: "Hazard Type", value: "Hazard Type test title" },
    {
      label: "Hazardous Situation",
      value:
        "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
    },
    {
      label: "Consequnces",
      value:
        "Lorem ipsum dolor sit amet consectetur. Viverra et nec volutpat sollicitudin.",
    },
  ];

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
