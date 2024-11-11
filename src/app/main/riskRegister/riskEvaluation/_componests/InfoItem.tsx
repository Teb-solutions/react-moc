import React from "react";

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  return (
    <div className="flex gap-4 mb-10 text-md items-center mt-4">
      <div className="self-stretch my-auto text-gray-600">{label}:</div>
      <div className="self-stretch my-auto font-medium text-neutral-500">
        {value}
      </div>
    </div>
  );
};

export default InfoItem;
