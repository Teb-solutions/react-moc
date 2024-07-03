import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { apiAuth } from "src/utils/http";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  maxWidth: "80vw",
  height: "65%",
  borderRadius: "16px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  padding: "0px",
};

const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  maxWidth: "80vw",
  height: "50vh",
  maxHeight: "80vh",
  borderRadius: "16px",
  backgroundColor: "#ffffff",
  boxShadow: "24px",
  padding: "0px",
};

function EvaluationChange({
  AppActions,
  AppActivity,
  TeamAssignmentList,
  assetEvaluationId,
}) {
  const [open, setOpen] = useState(false);
  const [openSession, setOpenSession] = useState(false);
  const [Session, setSession] = useState({});
  const [SessionList, setSessionList] = useState([]);
  const [sessionTime, setSessionTime] = useState();
  const [selectedItems, setSelectedItems] = useState([]);

  const initialSeconds = sessionTime * 60; // Convert minutes to seconds
  const [currentSeconds, setCurrentSeconds] = useState(() => {
    const storedTime = localStorage.getItem("currentSeconds");
    return storedTime ? parseInt(storedTime, 10) : initialSeconds;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          const newTime = prevSeconds - 1;
          localStorage.setItem("currentSeconds", newTime.toString());
          return newTime;
        } else {
          clearInterval(timer);
          return prevSeconds;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hoursToDay = Math.floor(currentSeconds / 3600);
  const minutesToDday = Math.floor((currentSeconds % 3600) / 60);
  const secondsToDday = currentSeconds % 60;

  const [value, setValue] = useState(0);

  useEffect(() => {
    getRecords();
  }, []);

  const handleClose = () => setOpen(false);
  const handleCloseSession = () => setOpenSession(false);

  const handleOpen = () => {
    setOpen(true);
    apiAuth
      .get(`/ChangeEvaluationSession/List/${assetEvaluationId}`)
      .then((resp) => {
        const sessionList = resp.data?.data;
        const activeSessions = sessionList.filter(
          (session) => session.isActive
        );
        console.log(activeSessions[0].timeoutMin, "activeSessions");

        setSessionList(activeSessions);
        setSessionTime(activeSessions[0].timeoutMin);
      });
  };

  const handleOpenSession = () => {
    apiAuth
      .get(`/ChangeEvaluationSession/List/${assetEvaluationId}`)
      .then((resp) => {
        setSessionList(resp.data?.data);
      });

    setOpenSession(true);
  };

  const handleChange = (newValue) => setValue(newValue);

  const calculateModalHeight = () => {
    const totalItems = Object.values(groupedData).reduce(
      (acc, val) => acc + val.length,
      0
    );
    const baseHeight = 400;
    const additionalHeightPerItem = 40;
    const calculatedHeight = baseHeight + totalItems * additionalHeightPerItem;
    return calculatedHeight;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const getRecords = () => {
    apiAuth
      .get(`/ChangeEvaluation/Get/${assetEvaluationId}/null/1`)
      .then((resp) => {
        setSession(resp.data?.data);
        const sessionList = resp.data?.data?.activeSession?.timeoutMin;

        setSessionTime(sessionList);
      });
  };

  const groupByRoleName = (teamAssignmentList) => {
    return teamAssignmentList.reduce((acc, item) => {
      if (!acc[item.roleName]) {
        acc[item.roleName] = [];
      }
      acc[item.roleName].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByRoleName(TeamAssignmentList);
  useEffect(() => {
    const defaultSelections = TeamAssignmentList.filter(
      (item) => item.roleName === "change leader" || item.roleName === "hseq"
    ).map((item) => ({
      teamType: item.teamType,
      staffId: item.staffId,
      staffName: item.staffName,
    }));
    setSelectedItems(defaultSelections);
  }, []);

  const handleCheckboxChange = (teamType, staffId, staffName) => {
    const selectedItem = { teamType, staffId, staffName };

    // Check if the item is already selected
    const isSelected = selectedItems.some(
      (item) => item.teamType === teamType && item.staffId === staffId
    );

    if (isSelected) {
      // Remove the item from selectedItems if already selected
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter(
          (item) => !(item.teamType === teamType && item.staffId === staffId)
        )
      );
    } else {
      // Add the item to selectedItems if not already selected
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        selectedItem,
      ]);
    }
  };
  const handelCreateSession = () => {
    apiAuth
      .post(
        `/ChangeEvaluationSession/Create/${Session.id}/${assetEvaluationId}`,
        { TeamList: selectedItems }
      )
      .then((resp) => {
        setOpen(false);
        getRecords();
      })
      .catch((error) => {
        console.error("Error creating session:", error);
      });
  };
  return (
    <div className="w-full">
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow overflow-hidden">
          <div>
            <div className="flex items-center w-full border-b pb-5 justify-between">
              <h2 className="text-2xl font-semibold">Evaluation</h2>
              <div>
                <Button
                  className="whitespace-nowrap mt-5"
                  style={{
                    border: "1px solid",
                    backgroundColor: "transparent",
                    color: "black",
                    borderColor: "rgba(203,213,225)",
                    marginRight: "5px",
                  }}
                  variant="contained"
                  color="warning"
                  startIcon={
                    <FuseSvgIcon size={20}>
                      {Session?.activeSession?.status == 2
                        ? "heroicons-outline:x"
                        : "heroicons-outline:user-add"}
                    </FuseSvgIcon>
                  }
                  onClick={handleOpen}
                >
                  {console.log(SessionList, "Session")}
                  {!Session?.activeSession && <span>Create Session</span>}
                  {Session?.activeSession?.status == 1 && (
                    <span>Session acceptance pending</span>
                  )}
                  {Session?.activeSession?.status == 2 && (
                    <span>
                      Stop Session{" "}
                      <b className="text-red">
                        {hoursToDay} Hr {minutesToDday} Min {secondsToDday} Sec
                      </b>
                    </span>
                  )}
                </Button>
                <Button
                  className="whitespace-nowrap mt-5"
                  style={{
                    border: "1px solid",
                    backgroundColor: "transparent",
                    color: "black",
                    borderColor: "rgba(203,213,225)",
                  }}
                  variant="contained"
                  color="warning"
                  startIcon={
                    <FuseSvgIcon size={20}>
                      heroicons-outline:user-add
                    </FuseSvgIcon>
                  }
                  onClick={handleOpenSession}
                >
                  Session List
                </Button>
              </div>
            </div>
          </div>
          {!Session?.activeSession && (
            <div className="ng-star-inserted mt-5">
              <div className="ng-star-inserted">
                <div
                  className="mt-4 py-2 px-5 rounded-lg bg-red-100 dark:bg-red-700"
                  style={{
                    backgroundColor: "rgb(255 196 202)",
                    padding: "5px",
                  }}
                >
                  {Session?.activeSession?.status == 1
                    ? "Session will be started after once all the team members accepts"
                    : " Please start session to make any changes."}
                </div>
              </div>
            </div>
          )}

          <Box sx={{ width: "100%", mt: 2 }} className="hello">
            <Box sx={{ display: "flex" }}>
              <Button
                onClick={() => handleChange(0)}
                variant={value === 0 ? "contained" : "outlined"}
                sx={{
                  backgroundColor: value === 0 ? "#e6e6e6" : "transparent",
                  color: value === 0 ? "black" : "black",
                  borderColor: "white",
                }}
              >
                Change Evaluation Consultation
              </Button>
              <Button
                onClick={() => handleChange(1)}
                className="ms-5"
                variant={value === 1 ? "contained" : "outlined"}
                sx={{
                  backgroundColor: value === 1 ? "#e6e6e6" : "transparent",
                  color: value === 1 ? "black" : "black",
                  borderColor: "white",
                }}
              >
                Change Evaluation Impacts
              </Button>
            </Box>

            <CustomTabPanel value={value} index={0}>
              <Typography className="ps-5">
                No Evaluation Consultations added
              </Typography>
              <div className="flex justify-start">
                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{ marginTop: "15px" }}
                >
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    style={{ padding: "15px" }}
                    //   onClick={() => handleOpen(btn)}
                    startIcon={
                      <FuseSvgIcon size={20}>
                        heroicons-outline:plus
                      </FuseSvgIcon>
                    }
                  >
                    Add New Consultation
                  </Button>
                </div>
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              <Typography variant="h6"></Typography>
              <Typography></Typography>
              <div className="flex justify-start">
                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{ marginTop: "15px" }}
                >
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    style={{ padding: "15px" }}
                    //   onClick={() => handleOpen(btn)}
                    startIcon={
                      <FuseSvgIcon size={20}>
                        heroicons-outline:plus
                      </FuseSvgIcon>
                    }
                  >
                    Add New Impact
                  </Button>
                </div>
              </div>
            </CustomTabPanel>
          </Box>

          {!Session?.activeSession && (
            <>
              <div
                className="my-10"
                style={{ borderTopWidth: "2px", marginTop: "40px" }}
              ></div>

              <div className="flex justify-end">
                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{ marginTop: "15px" }}
                ></div>
                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{ marginTop: "15px" }}
                >
                  {AppActions.map((btn) => (
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      style={{ padding: "15px" }}
                      key={btn.name}
                      //   onClick={() => handleOpen(btn)}
                    >
                      {btn.name}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </Paper>
      </SwipeableViews>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style1}>
            <div
              className="flex items-center justify-between p-24 border-b"
              style={{
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <Typography variant="h6" className="text-white">
                Evaluation Session
              </Typography>
              <FuseSvgIcon
                className="cursor-pointer text-white"
                size={32}
                onClick={handleClose}
              >
                heroicons-outline:x
              </FuseSvgIcon>
            </div>

            {SessionList[0]?.isActive ? (
              <div style={{ margin: "20px" }}>
                <span>
                  Evaluation Session started by{" "}
                  <b>{SessionList[0]?.startedByStaffName}</b> on{" "}
                  <b>{formatDate(SessionList[0]?.startedAt)}</b>
                </span>
                <div className="mt-5 row" style={{ marginTop: "20px" }}>
                  <b className="ng-star-inserted">CHANGE LEADER</b>
                  <div
                    className="ng-star-inserted"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div style={{ flex: "65%" }}>
                      <div className="ng-star-inserted">
                        <span>Tebs Dev Team Name</span>
                        <span
                          style={{ color: "orangered", fontSize: "small" }}
                          className="ng-star-inserted"
                        >
                          Acceptance Pending
                        </span>
                      </div>
                    </div>
                  </div>
                  <br className="ng-star-inserted" />
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-start justify-between p-24"
                style={{ height: "100%", overflowY: "scroll" }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {Object.keys(groupedData).map((role) => (
                      <>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {role}
                        </Typography>
                        <Table>
                          <TableHead>
                            <TableRow></TableRow>
                          </TableHead>
                          <TableBody>
                            {groupedData[role].map((item) => (
                              <div
                                key={item.value}
                                style={{ marginTop: "10px" }}
                              >
                                <label>
                                  <Checkbox
                                    checked={selectedItems.some(
                                      (selectedItem) =>
                                        selectedItem.teamType ===
                                          item.teamType &&
                                        selectedItem.staffId === item.staffId
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        item.teamType,
                                        item.staffId,
                                        item.staffName
                                      )
                                    }
                                  />
                                  <span>{item.staffName}</span>
                                </label>
                              </div>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    ))}

                    <div className="flex justify-end">
                      <div
                        className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                        style={{ marginTop: "15px", marginRight: "15px" }}
                      >
                        <Button
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                          style={{ padding: "15px" }}
                          onClick={handelCreateSession}
                        >
                          Start Session
                        </Button>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openSession}
        onClose={handleCloseSession}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openSession}>
          <Box sx={style2}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
              }}
            >
              Evaluation Session
            </Box>

            <Box sx={{ overflow: "auto", padding: "5px 30px 0 30px" }}>
              <Grid
                container
                spacing={2}
                className="mt-5"
                style={{ overflow: "scroll", height: "40vh" }}
              >
                <Grid item xs={12}>
                  <Table
                    className="mat-elevatio demo-table col-span-12 mt-0 w-full"
                    sx={{ width: "100%" }}
                  >
                    <TableHead
                      sx={{
                        borderBottom: "2px solid silver",
                        fontSize: "medium",
                        border: "1px solid black",
                      }}
                    >
                      <TableRow>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        ></TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Session
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Teams
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ border: "1px solid black" }}>
                      {SessionList.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {session.length}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {session.isRejected === 1 && (
                              <span className="bg-red-100 rounded px-3 py-1 text-secondary font-semibold">
                                Rejected
                              </span>
                            )}
                            {!session.isRejected && (
                              <>
                                {session.isExpired && (
                                  <span
                                    className="bg-red-200 rounded px-3 py-1 text-secondary font-semibold"
                                    style={{
                                      backgroundColor: "rgba(254,202,202)",
                                    }}
                                  >
                                    Expired
                                  </span>
                                )}
                                {session.isActive && (
                                  <span className="bg-green-100 rounded px-3 py-1 text-secondary font-semibold">
                                    Active
                                  </span>
                                )}
                                {session.isSessionEnded && (
                                  <span className="bg-red-200 rounded px-3 py-1 text-secondary font-semibold">
                                    Ended
                                  </span>
                                )}
                              </>
                            )}
                            <div>
                              Session started by {session.startedByStaffName}at
                              {formatDate(session.startedAt)}
                            </div>
                            {session?.isSessionEnded && (
                              <div class="mt-2">
                                Session ended at{" "}
                                {session.endedAt && formatDate(session.endedAt)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {session.teamList.map((team, index) => (
                              <div key={index}>
                                {team.staffName}-
                                {team.approvalStatus === 1 ? (
                                  <span style={{ color: "orangered" }}>
                                    Acceptance Pending
                                  </span>
                                ) : team.approvalStatus === 2 ? (
                                  <span className="text-green">
                                    Accepted at{" "}
                                    {team.updatedAt &&
                                      formatDate(team.updatedAt)}
                                  </span>
                                ) : (
                                  <span className="text-red">
                                    Rejected at
                                    {team.updatedAt &&
                                      formatDate(team.updatedAt)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default EvaluationChange;
