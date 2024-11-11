import Button from "../common/Button";
import RiskInitiation from "./_componests/RiskInitiation";
import EvaluationTasks from "./_componests/EvaluationTasks";
import { Icon } from "@mui/material";

const RiskEvaluation = () => {
  return (
    <div className="m-5 p-10">
      <div className="flex flex-row w-full justify-between p-5">
        <h2 className="text-2xl font-semibold text-black p-10">
          HIRA #MUMRR293468
        </h2>
        <div className="flex flex-col sm:flex-row gap-10">
          <Button type="button" variant="reject">
            End Session
          </Button>

          <Button variant="neutral" type="button">
            <Icon className="text-sm">timer</Icon> 01:30:00
          </Button>
        </div>
      </div>
      <RiskInitiation />
      <EvaluationTasks />
    </div>
  );
};

export default RiskEvaluation;
