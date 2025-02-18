import FusePageSimple from "@fuse/core/FusePageSimple";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import FuseLoading from "@fuse/core/FuseLoading";
import ProjectDashboardAppHeader from "../dashboards/project/ProjectDashboardAppHeader";
import HomeTab from "../dashboards/project/tabs/home/HomeTab";
import TeamTab from "../dashboards/project/tabs/team/TeamTab";
import BudgetTab from "../dashboards/project/tabs/budget/BudgetTab";
import { useCallback } from "react";
import { useEffect } from "react";
import { apiAuth, apiTicketAuth } from "src/utils/http";
import AnalyticsTab from "./components/AnalyticsTab";

function createData(
  activity,
  assigned,
  type,
  number,
  initiated,
  date,
  status,
  token
) {
  return { activity, assigned, type, number, initiated, date, status, token };
}

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

/**
 * The ProjectDashboardApp page.
 */
function MocAnalytics() {
  const [isLoading, setIsLoading] = useState(true);

  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState({});
  
  const fetchdataSetting = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) {
        navigate("/sign-in");
        return;
      }
      apiAuth.get(`/Dashboard/Get`).then(async (resp) => {
        setData(resp?.data?.data);
        setIsLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchdataSetting();
  }, []);

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <Root
      header={<ProjectDashboardAppHeader data={data} />}
      content={
        <div className="w-full my-20 ">
        
          {data && <AnalyticsTab data={data} />}
          
        </div>
      }
    />
  );
}

export default MocAnalytics;
