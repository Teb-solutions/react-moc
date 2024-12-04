import React from "react";

const InitationInfoItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => {
  return (
    <div className="flex gap-4 mb-10 text-md items-center mt-4">
      <div
        className={`self-stretch font-medium my-auto ${color ? color : "text-gray-600"}`}
      >
        {label}:
      </div>
      <div
        className={`self-stretch font-medium my-auto font-medium ${color ? color : "text-neutral-500"}`}
      >
        {value}
      </div>
    </div>
  );
};

export default InitationInfoItem;
