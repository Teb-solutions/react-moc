import React from "react";
import { Icon } from "@mui/material"; // Adjust the import path as necessary

interface ReusableButtonProps {
  onClick: () => void;
  icon: string;
  text: string;
  className?: string;
}

const TaskButton: React.FC<ReusableButtonProps> = ({
  onClick,
  icon,
  text,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex gap-2 w-full items-center mb-4 self-stretch px-10 py-5 my-auto text-sm font-medium text-blue-700 whitespace-nowrap rounded bg-blue-700 bg-opacity-10 ${className}`}
    >
      <Icon>{icon}</Icon>
      <span className="ml-4 self-stretch my-auto">{text}</span>
    </button>
  );
};

export default TaskButton;
