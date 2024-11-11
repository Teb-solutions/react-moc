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

const ApproveRisk = () => {
  const [risk, setRisk] = useState<IRiskRegisterDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { riskId } = useParams<{ riskId: string }>();
  console.log(riskId);
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

  return (
    <>
      {loading && <FuseLoading />}
      {!loading && (
        <div className="m-5 p-10">
          <RiskHeader
            risk={"risk"}
            setLeftSidebarOpen={() => {}}
            leftSidebarOpen={false}
          />

          <Paper className="flex flex-col p-10">
            {risk && <InitiationSection risk={risk} />}
            {!risk && <div>Loading...</div>}
          </Paper>
          <Paper className="flex flex-col p-10 mt-10">
            {risk.activities.length === 1 && risk.teamList.length == 0 && (
              <SICApproval risk={risk} />
            )}
            {risk.teamList.length > 0 && <Team risk={risk} />}
          </Paper>
        </div>
      )}
    </>
  );
};

export default ApproveRisk;
