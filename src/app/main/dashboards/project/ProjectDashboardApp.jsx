import FusePageSimple from "@fuse/core/FusePageSimple";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import FuseLoading from "@fuse/core/FuseLoading";
import ProjectDashboardAppHeader from "./ProjectDashboardAppHeader";
import HomeTab from "./tabs/home/HomeTab";
import TeamTab from "./tabs/team/TeamTab";
import BudgetTab from "./tabs/budget/BudgetTab";
import { useCallback } from "react";
import { useEffect } from "react";
import { apiAuth, apiTicketAuth } from "src/utils/http";

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
function ProjectDashboardApp() {
  const [isLoading, setIsLoading] = useState(true);

  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState({});
  const [riskMatrixList, setRiskMatrixList] = useState([]);

  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  const fetchdataSetting = useCallback(async () => {
    try {
      if (!localStorage.getItem("jwt_access_ticket_token")) {
        const ticketResp = await apiTicketAuth.post("/Account/access-token", {
          userName: "MOC_CLIENT",
          password: "M@c_3#21c_ukl",
          deviceId: "string",
        });


        localStorage.setItem(
          "jwt_access_ticket_token",
          ticketResp.data.accessToken
        );
      }
      apiAuth.get(`/Dashboard/Get`).then(async (resp) => {
        setData(resp?.data?.data);
        const transformedData = resp?.data?.data?.approvalsPendingRequests?.map(
          (item, index) =>
            createData(
              item.lastActivityName,
              item.lastActivityStartedAt,
              item.requestTypeName,
              item.requestNo,
              item.initiatorName,
              item.requestDate,
              item.statusName,
              item.token
            )
        );
        apiAuth.get(`/Staff/List`).then((resp) => { });

        setRiskMatrixList(transformedData);
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
        <div className="w-full ">
          {/* <Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="secondary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="w-full px-24 -mx-4 min-h-40"
						classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
						TabIndicatorProps={{
							children: (
								<Box
									sx={{ bgcolor: 'text.disabled' }}
									className="w-full h-full rounded-full opacity-20"
								/>
							)
						}}
					>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Home"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Budget"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
							disableRipple
							label="Team"
						/>
					</Tabs> */}
          {tabValue === 0 && (
            <HomeTab
              data={data}
              setRiskMatrixList={setRiskMatrixList}
              riskMatrixList={riskMatrixList}
            />
          )}
          {/* {tabValue === 1 && <BudgetTab />}
					{tabValue === 2 && <TeamTab />} */}
        </div>
      }
    />
  );
}

export default ProjectDashboardApp;
