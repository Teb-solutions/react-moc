import React from "react";

interface RiskItemProps {
  label: string;
  value: string;
}

const RiskItem: React.FC<RiskItemProps> = ({ label, value }) => (
  <div className="flex gap-10 justify-between items-start w-full">
    <div className="text-neutral-400">{label}</div>
    <div className="font-medium text-neutral-600">{value}</div>
  </div>
);

interface RiskSectionProps {
  title: string;
  riskItems: RiskItemProps[];
}

const RiskSection: React.FC<RiskSectionProps> = ({ title, riskItems }) => {
  return (
    <section className="flex flex-col mt-8 w-full">
      <h3 className="text-base font-semibold text-zinc-800">{title}</h3>
      <div className="flex flex-col mt-6 w-full text-sm">
        {riskItems.map((item, index) => (
          <RiskItem key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </section>
  );
};

export default RiskSection;
