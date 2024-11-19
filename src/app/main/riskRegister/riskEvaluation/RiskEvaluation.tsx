import Button from "../common/Button";
import RiskInitiation from "./_componests/summary/RiskInitiation";
import EvaluationTasks from "./_componests/tasks/EvaluationTasks";
import { Icon } from "@mui/material";
import RiskSection from "./_componests/singleTask/RiskSection";
import RiskSession from "./_componests/session/RiskSession";
import { useState, useEffect } from "react";
import { IRiskRegisterDetails, TeamList } from "../helpers/type";
import { useParams } from "react-router";
import { apiAuth } from "src/utils/http";
import FuseLoading from "@fuse/core/FuseLoading";
import { toast } from "react-toastify";
import { useRiskStore } from "./_componests/common/riskstore";
import jwtDecode from "jwt-decode";
import { getCurrentUserId } from "../helpers/commonFunctions";

const RiskEvaluation = () => {
  // const [risk, setRisk] = useState<IRiskRegisterDetails | null>(null);
  // const [loading, setLoading] = useState(true);
  const { riskId } = useParams<{ riskId: string }>();
  const { risk, setRisk, loading, setLoading, setIsCurrentUserPartOfTeam } =
    useRiskStore();

  const isUserPartOfTeam = (team: TeamList[]) => {
    const userId = Number(getCurrentUserId());
    setIsCurrentUserPartOfTeam(
      team.some((member) => member.staffId === userId)
    );
  };
  useEffect(() => {
    apiAuth
      .get(`/RiskRegister/Details/${riskId}`)
      .then((res) => {
        setRisk(res.data.data);
        isUserPartOfTeam(res.data.data.teamList);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.errorsData.id[0]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      {loading && <FuseLoading />}
      {!loading && !risk && (
        <div className="m-5 p-10">
          <div className="flex flex-row w-full justify-between p-5">
            <h2 className="text-2xl font-semibold text-black p-10">
              Risk Not found !
            </h2>
          </div>
        </div>
      )}
      {!loading && risk && (
        <div className="m-5 p-10">
          <div className="flex flex-row w-full justify-between p-5">
            <h2 className="text-2xl font-semibold text-black p-10">
              HIRA #{risk.hiranumber}
            </h2>
            <RiskSession />
          </div>
          <RiskInitiation />
          <EvaluationTasks />
        </div>
      )}
    </>
  );
};

export default RiskEvaluation;
