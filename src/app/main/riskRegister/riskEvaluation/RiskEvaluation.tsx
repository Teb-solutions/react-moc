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
import { useGetPermenant } from "src/utils/swr";
import { use } from "i18next";
import AddTaskPage from "./_componests/tasks/AddTaskPage";
import { useTaskStore } from "./_componests/common/taskStore";
import EditTaskPage from "./_componests/singleTask/EditTaskPage";
import { Link } from "react-router-dom";
import MocHeader from "../../moc/MocHeader";
import RiskHeader from "../common/RiskHeader";

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

  const {
    data: result,
    isLoading,
    error,
  } = useGetPermenant<{
    data: any;
    message: string;
    statusCode: number;
  }>(`/RiskRegister/Details/${riskId}`);
  useEffect(() => {
    if (result) {
      if (result.statusCode == 200) {
        setRisk(result.data);
        isUserPartOfTeam(result.data.teamList);
        setLoading(false);
      } else {
        toast.error(result.message);
      }
    } else if (error) {
      console.log(error);
      toast.error("Failed to get risk details");
    }
  }, [result, error]);
  const { isAddTaskClicked, isEditTaskClicked } = useTaskStore();
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
          {!isAddTaskClicked && !isEditTaskClicked && (
            <>
              <div className="flex flex-row">
                <RiskHeader
                  risk="risk"
                  home={false}
                  evaluation={true}
                  name={"HIRA #" + risk.hiranumber}
                  setLeftSidebarOpen={() => {}}
                  leftSidebarOpen={false}
                />
              </div>
              <div className="flex flex-row w-full justify-between p-5">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold text-black p-10">
                    HIRA #{risk.hiranumber}
                  </h2>
                </div>
                <RiskSession />
              </div>
              {}
              <RiskInitiation />
              <EvaluationTasks />
            </>
          )}
          {isAddTaskClicked && !isEditTaskClicked && (
            <AddTaskPage riskId={Number(riskId)} />
          )}
          {isEditTaskClicked && !isAddTaskClicked && <EditTaskPage />}
        </div>
      )}
    </>
  );
};

export default RiskEvaluation;
