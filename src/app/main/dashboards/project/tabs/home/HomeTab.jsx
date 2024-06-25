import { motion } from "framer-motion";
import SummaryWidget from "./widgets/SummaryWidget";
import OverdueWidget from "./widgets/OverdueWidget";
import IssuesWidget from "./widgets/IssuesWidget";
import FeaturesWidget from "./widgets/FeaturesWidget";
import GithubIssuesWidget from "./widgets/GithubIssuesWidget";
import TaskDistributionWidget from "./widgets/TaskDistributionWidget";
import ScheduleWidget from "./widgets/ScheduleWidget";
import { Paper, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import FuseLoading from "@fuse/core/FuseLoading";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, useCallback, useEffect } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button } from "@mui/material";
import { apiAuth } from "src/utils/http";

/**
 * The HomeTab component.
 */
function HomeTab() {
  const [tabValue, setTabValue] = useState(0);
  const container = {
    show: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const routeParams = useParams();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState({});

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenNewDoc = () => {
    navigate("/moc/activity");
  };

  const handleOpenMoc = (e) => {
    navigate("/moc");
  };

  const fetchdataSetting = useCallback(async () => {
    try {
      await apiAuth.get(`/Dashboard/Get`).then((resp) => {
        console.log(resp.data.data, "88888");
        setData(resp.data.data);
      });
      console.log(data, "889");
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchdataSetting();
  }, []);

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="sm:col-span-2 md:col-span-4">
        <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start justify-between">
            <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
              Decision Tree
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleOpenNewDoc}
              >
                <MenuItem>Technical </MenuItem>
                <MenuItem onClick={handleOpenNewDoc}>Document</MenuItem>
                <MenuItem>Organisation</MenuItem>
              </Menu>{" "}
              {Object.keys(routeParams).length === 0 && (
                <Button
                  className="HomeButton"
                  variant="contained"
                  sx={{
                    backgroundColor: "#fff !important",
                    color: "#1e293b",
                    boxShadow:
                      "0 3px 2px -2px #0003, 0 2px 2px 0 #00000024, 0 1px 5px 0 #0000001f",
                    border: "1px solid #c6c6c6",
                    marginLeft: "10px",
                    "&:hover": {
                      backgroundColor: "#eaebee  !important",
                    },
                  }}
                  onClick={handleClick}
                >
                  <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                  <span className="mx-4 sm:mx-8">Initiate New MOC Request</span>
                </Button>
              )}
            </Typography>
            <div className="mt-12 sm:mt-0 sm:ml-8">
              <Tabs
                value={tabValue}
                onChange={(ev, value) => setTabValue(value)}
                indicatorColor="secondary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons={false}
                className="-mx-4 min-h-40"
                classes={{
                  indicator: "flex justify-center bg-transparent w-full h-full",
                }}
                TabIndicatorProps={{
                  children: (
                    <Box
                      sx={{ bgcolor: "text.disabled" }}
                      className="w-full h-full rounded-full opacity-20"
                    />
                  ),
                }}
              >
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  key={0}
                  label="Technical MOC"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  key={1}
                  label="Document MOC"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                  disableRipple
                  key={2}
                  label="Organization MOC"
                />
              </Tabs>
            </div>
          </div>
          <div className="flex gap-24 w-full mt-32 justify-center">
            {tabValue === 0 ? (
              <img
                className="w-2/3 mx-auto"
                src="assets/Dashboard/mocdashboardimage2.jpg"
              />
            ) : tabValue === 1 ? (
              <img
                className="w-2/3 mx-auto"
                src="assets/Dashboard/document.png"
              />
            ) : (
              <img className="w-2/3 mx-auto" src="assets/Dashboard/org.png" />
            )}
          </div>
        </Paper>
      </motion.div>
      <motion.div variants={item}>
        <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-8 pt-12">
            <Typography
              className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
              color="text.secondary"
            >
              Summary
            </Typography>
            {/* <IconButton aria-label="more" size="large">
            <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
          </IconButton> */}
          </div>
          <div className="text-center mt-8">
            <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-blue-500">
              {data?.tasksDue}
            </Typography>
            <Typography className="text-lg font-medium text-blue-600 dark:text-blue-500">
              Pending Tasks
            </Typography>
          </div>
          <Typography
            className="flex items-baseline justify-center w-full mt-20 mb-24"
            color="text.secondary"
          >
            <span className="truncate">Completed</span>:
            <b className="px-8">{data?.tasksCompleted}</b>
          </Typography>
        </Paper>
      </motion.div>
      <motion.div variants={item}>
        <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-8 pt-12">
            <Typography
              className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
              color="text.secondary"
            >
              Overdue
            </Typography>
            {/* <IconButton aria-label="more" size="large">
            <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
          </IconButton> */}
          </div>
          <div className="text-center mt-8">
            <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-red-500">
              {data?.tasksOverDue}
            </Typography>
            <Typography className="text-lg font-medium text-red-600">
              Tasks
            </Typography>
          </div>
          <Typography
            className="flex items-baseline justify-center w-full mt-20 mb-24"
            color="text.secondary"
          >
            <span className="truncate">
              {/* {data.extra.name} */}From yesterday
            </span>
            :<b className="px-8">{data?.tasksOverDueYesterday}</b>
          </Typography>
        </Paper>
      </motion.div>
      <motion.div variants={item}>
        <Paper
          className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden"
          onClick={handleOpenMoc}
          style={{ cursor: "pointer" }}
        >
          <div className="flex items-center justify-between px-8 pt-12">
            <Typography
              className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
              color="text.secondary"
            >
              MOC Requests
            </Typography>
          </div>
          <div className="text-center mt-8">
            <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-amber-500">
              {data?.requestsOpen}
            </Typography>
            <Typography className="text-lg font-medium text-amber-600">
              Open
            </Typography>
          </div>
          <Typography
            className="flex items-baseline justify-center w-full mt-20 mb-24"
            color="text.secondary"
          >
            <span className="truncate"> Closed today</span>:
            <b className="px-8"> {data?.requestsClosedToday}</b>
          </Typography>
        </Paper>
      </motion.div>
      <motion.div variants={item}>
        <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-8 pt-12">
            <Typography
              className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
              color="text.secondary"
            >
              Approvals
            </Typography>
          </div>
          <div className="text-center mt-8">
            <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-green-500">
              {data?.approvalsPending}
            </Typography>
            <Typography className="text-lg font-medium text-green-600">
              Pending
            </Typography>
          </div>
          <Typography
            className="flex items-baseline justify-center w-full mt-20 mb-24"
            color="text.secondary"
          >
            <span className="truncate">Due</span>:
            <b className="px-8">{data?.tasksDue}</b>
          </Typography>
        </Paper>
      </motion.div>
      {/* <motion.div
				variants={item}
				className="sm:col-span-2 md:col-span-4 lg:col-span-2"
			>
				<TaskDistributionWidget />
			</motion.div>
			<motion.div
				variants={item}
				className="sm:col-span-2 md:col-span-4 lg:col-span-2"
			>
				<ScheduleWidget />
			</motion.div> */}
    </motion.div>
  );
}

export default HomeTab;
