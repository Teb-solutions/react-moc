const RiskDisplay = ({
  risk,
  riskDisplay,
}: {
  risk: string;
  riskDisplay: string;
}) => {
  // const bgColor = risk > 50 ? "bg-red-800" : "bg-blue-500";
  return (
    <div
      className={`flex gap-1 items-center text-white rounded-md self-stretch py-2 px-4 my-auto font-medium text-lime-800 whitespace-nowrap 
          ${Number(risk) === 1 && "bg-red-500"}
                ${Number(risk) === 2 && "bg-orange-700"}
                ${Number(risk) === 3 && "bg-amber-700"}
                ${Number(risk) === 4 && "bg-yellow-600"}
                ${Number(risk) === 5 && "bg-green-500"}
        `}
    >
      <span className="self-stretch my-auto">{riskDisplay}</span>
    </div>
  );
};

export default RiskDisplay;
