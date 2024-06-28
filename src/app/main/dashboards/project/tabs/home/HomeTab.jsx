import { motion } from "framer-motion";
import {
  Paper,
  Typography,
  Skeleton,
  Button,
  Box,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { apiAuth } from "src/utils/http";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

function HomeTab() {
  const storedFeature = decryptFeature();
  const feature = storedFeature ? storedFeature : [];
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

  const handleOpenMoc = () => {
    navigate("/moc");
  };

  const fetchdataSetting = () => {
    apiAuth.get(`/Dashboard/Get`).then((resp) => {
      setData(resp.data.data);
    });
  };

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
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem>Technical</MenuItem>
                <MenuItem onClick={handleOpenNewDoc}>Document</MenuItem>
                <MenuItem>Organisation</MenuItem>
              </Menu>
              {Object.keys(routeParams).length === 0 &&
                feature.includes("REQ") && (
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
                    <span className="mx-4 sm:mx-8">
                      Initiate New MOC Request
                    </span>
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
      {/* {data.length > 0 ? (
        <> */}
      <motion.div variants={item}>
        <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-8 pt-12">
            <Typography
              className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
              color="text.secondary"
            >
              Summary
            </Typography>
          </div>
          <Box
            className="text-center mt-8"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {data.tasksDue !== undefined ? (
              <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-blue-500">
                {data.tasksDue}
              </Typography>
            ) : (
              <Skeleton variant="text" width={100} height={60} />
            )}
            <Typography className="text-lg font-medium text-blue-600 dark:text-blue-500">
              Pending Tasks
            </Typography>
          </Box>
          <Typography
            className="flex items-baseline justify-center w-full mt-20 mb-24"
            color="text.secondary"
          >
            <span className="truncate">Completed</span>:
            {data.tasksCompleted !== undefined ? (
              <b className="px-8">{data.tasksCompleted}</b>
            ) : (
              <Skeleton variant="text" width={40} />
            )}
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
          </div>
          <Box
            className="text-center mt-8"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {data.tasksOverDue !== undefined ? (
              <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-red-500">
                {data.tasksOverDue}
              </Typography>
            ) : (
              <Skeleton variant="text" width={100} height={60} />
            )}
            <Typography className="text-lg font-medium text-red-600">
              Tasks
            </Typography>
          </Box>
          <Typography
            className="flex items-baseline justify-center w-full mt-20 mb-24"
            color="text.secondary"
          >
            <span className="truncate">From yesterday</span>:
            {data.tasksOverDueYesterday !== undefined ? (
              <b className="px-8">{data.tasksOverDueYesterday}</b>
            ) : (
              <Skeleton variant="text" width={40} />
            )}
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
          <Box
            className="text-center mt-8"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {data.requestsOpen !== undefined ? (
              <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-amber-500">
                {data.requestsOpen}
              </Typography>
            ) : (
              <Skeleton variant="text" width={100} height={60} />
            )}
            <Typography className="text-lg font-medium text-amber-600">
              Open
            </Typography>
          </Box>
          <Typography
            className="flex items-baseline justify-center w-full mt-20 mb-24"
            color="text.secondary"
          >
            <span className="truncate">Closed today</span>:
            {data.requestsClosedToday !== undefined ? (
              <b className="px-8">{data.requestsClosedToday}</b>
            ) : (
              <Skeleton variant="text" width={40} />
            )}
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
          <Box
            className="text-center mt-8"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {data.approvalsPending !== undefined ? (
              <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-green-500">
                {data.approvalsPending}
              </Typography>
            ) : (
              <Skeleton variant="text" width={100} height={60} />
            )}
            <Typography className="text-lg font-medium text-green-600">
              Pending
            </Typography>
          </Box>
          <Typography
            className="flex items-baseline justify-center w-full mt-20 mb-24"
            color="text.secondary"
          >
            <span className="truncate">Due</span>:
            {data.tasksDue !== undefined ? (
              <b className="px-8">{data.tasksDue}</b>
            ) : (
              <Skeleton variant="text" width={40} />
            )}
          </Typography>
        </Paper>
      </motion.div>
      {/* </>
      ) : (
        <div className="ui_div12">
          <div uk-grid="true">
            {Array.from(new Array(6)).map((_, index) => (
              <Box className="box_d12" key={index}>
                <Skeleton variant="rectangular" width={210} height={218} />
                <Skeleton />
              </Box>
            ))}
          </div>
        </div>
      )} */}
    </motion.div>
  );
}

export default HomeTab;
