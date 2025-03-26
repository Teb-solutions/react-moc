import { riskClassificationDisplay } from "../../moc/common_components/RiskAnalysisCalculate";

const RiskClassificationDisplay = ({
  residualRiskClassification,
  residualRiskClassificationDisplay,
  classes,
}: {
  residualRiskClassification: string;
  residualRiskClassificationDisplay?: string;
  classes?: string;
}) => {
  return (
    <div>
      <button type='button'
        className={`btn rounded-md ${classes ? classes : "text-lg font-bold px-20 py-10 mx-20"} text-white cursor-default   btn-primary border-1
              ${Number(residualRiskClassification) === 1 && "bg-red-500"}
              ${Number(residualRiskClassification) === 2 && "bg-orange-700"}
              ${Number(residualRiskClassification) === 3 && "bg-amber-700"}
              ${Number(residualRiskClassification) === 4 && "bg-yellow-600"}
              ${Number(residualRiskClassification) === 5 && "bg-green-500"}
              `}
      >
        {residualRiskClassificationDisplay
          ? residualRiskClassificationDisplay
          : riskClassificationDisplay(residualRiskClassification)}
      </button>
    </div>
  );
};

export default RiskClassificationDisplay;
