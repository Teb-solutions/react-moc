import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type: "button" | "submit" | "reset";
  variant: "reject" | "approve" | "neutral";
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  variant,
  onClick,
}) => {
  const baseClasses =
    "overflow-hidden flex flex-row gap-2.5 text-white self-stretch px-20 py-10 rounded-lg max-md:px-5";
  const variantClasses = {
    reject: "bg-red-600",
    approve: "bg-blue-600",
    neutral: "bg-gray-600",
    none: "",
  };
  const onHoverClasses = {
    reject: "hover:bg-red-800",
    approve: "hover:bg-blue-800",
    neutral: "hover:bg-gray-800",
    none: "",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${onHoverClasses[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
