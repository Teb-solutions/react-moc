import React, { useEffect, useState } from "react";

import InitiationSection from "./_components/InitiationSection";
import SICApproval from "./_components/SICApproval";
import { Paper } from "@mui/material";
import MocHeader from "../common/RiskHeader";
import { useParams } from "react-router";
import { use } from "i18next";
import { apiAuth } from "src/utils/http";
import { IHiraList, IRiskRegisterDetails } from "../helpers/type";
import RiskHeader from "../common/RiskHeader";
import FuseLoading from "@fuse/core/FuseLoading";
import Team from "./_components/Team";
import { HIRAStatus, RiskRegisterStatus } from "../helpers/enum";
import { getCurrentUserId } from "../helpers/commonFunctions";

const ApproveRisk = () => {
  const [risk, setRisk] = useState<IRiskRegisterDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { riskId } = useParams<{ riskId: string }>();

  useEffect(() => {
    apiAuth
      .get(`/RiskRegister/Details/${riskId}`)
      .then((res) => {
        console.log(res.data.data);
        setRisk(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const lastActivity = risk?.activities[risk.activities.length - 1];

  const userId = Number(getCurrentUserId());

  return (
    <>
      {loading && <FuseLoading />}
      {!loading && (
        <div className="m-5 p-10">
          <RiskHeader
            risk={"risk"}
            evaluation={false}
            home={false}
            // sicapproval={true}
            setLeftSidebarOpen={() => {}}
            leftSidebarOpen={false}
          />

          <Paper className="flex flex-col p-10 mt-20">
            {risk && <InitiationSection risk={risk} />}
            {!risk && <div>Loading...</div>}
          </Paper>
          <Paper className="flex flex-col p-10 mt-10">
            {risk.status === RiskRegisterStatus.SICApproval &&
            userId == lastActivity.assignedToStaffId ? (
              <SICApproval risk={risk} />
            ) : (
              <Team risk={risk} />
            )}
          </Paper>
        </div>
      )}
    </>
  );
};

export default ApproveRisk;
