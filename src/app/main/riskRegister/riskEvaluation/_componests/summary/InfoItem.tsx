import React from "react";

const InitationInfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex gap-4 mb-10 text-md items-center mt-4">
      <div className="self-stretch my-auto text-gray-600">{label}:</div>
      <div className="self-stretch my-auto font-medium text-neutral-500">
        {value}
      </div>
    </div>
  );
};

export default InitationInfoItem;
