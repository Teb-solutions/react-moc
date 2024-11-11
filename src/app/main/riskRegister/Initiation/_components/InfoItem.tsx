import React from "react";

interface InfoItemProps {
  label: string;
  value: string | number;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  return (
    <div className="flex  flex-col">
      <div className="font-normal text-md text-gray-600">{label}</div>
      <div className="mt-4 text-lg font-medium text-neutral-500">{value}</div>
    </div>
  );
};

export default InfoItem;
