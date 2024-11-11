import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name }) => {
  return (
    <div className="flex flex-col grow shrink self-stretch my-auto min-w-[240px] w-[311px]">
      <label htmlFor={name} className="self-start font-medium text-zinc-800">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        className="overflow-hidden px-6 py-5 mt-3 rounded-lg border border-solid border-stone-300 text-neutral-500 max-md:px-5"
        placeholder="Type here..."
      />
    </div>
  );
};

export default InputField;
