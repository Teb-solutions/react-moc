import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  Step,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { apiAuth } from "src/utils/http";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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
  const [docStaff, setDocStaff] = useState([]);
  const [list, setIsList] = useState([]);
  const [impactList, setImpactList] = useState([]);

  const initialSeconds = sessionTime * 60; // Convert minutes to seconds
  const [currentSeconds, setCurrentSeconds] = useState(() => {
    const storedTime = localStorage.getItem("currentSeconds");
    return storedTime ? parseInt(storedTime, 10) : initialSeconds;
  });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [remark, setRemark] = useState("");
  const [sessionTaskList, setSessionTaskList] = useState([]);

  const handleChangeTask = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTasks(typeof value === "string" ? value.split(",") : value);
  };

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };

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
        const sessionListId = resp.data?.data?.id;
        setSessionTime(sessionList);
        apiAuth
          .get(
            `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${sessionListId}`
          )
          .then((resp) => {
            setIsList(resp.data.data);
          });
        apiAuth
          .get(`/ChangeImpact/ImpactTask?id=${sessionListId}`)
          .then((resp) => {
            setSessionTaskList(resp.data?.data);
          });
        apiAuth.get(`/ChangeImpact/Get?id=${sessionListId}`).then((resp) => {
          setImpactList(resp.data?.data);
        });
      });
    apiAuth.get(`/Staff/LOV`).then((resp) => {
      setDocStaff(resp.data.data);
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

  const [forms, setForms] = useState([]);
  const [AddCunsultation, setAddConsultation] = useState(false);
  const [AddImpact, setAddCImpact] = useState(false);

  const [editConsultation, setEditConsultation] = useState(false);
  const [editStaffName, setEditStaffName] = useState("");
  const [editStaffDate, setEditStaffDate] = useState("");
  const [editStaffId, setEditStaffId] = useState();
  const [editId, setEditId] = useState();
  const [particularList, setParticularList] = useState([]);
  const [particularSubList, setParticularSubList] = useState([]);

  const [impactForm, setImpactForm] = useState({
    particular: "",
    particularSubCategory: "",
    hazardDetail: "",
  });

  const handleAddForm = () => {
    const newForms = [
      ...forms,
      { id: Date.now(), consultedDate: null, consultedStaffId: "" },
    ];
    setForms(newForms);
  };

  const handleRemoveForm = (id) => {
    const newForms = forms.filter((form) => form.id !== id);
    setForms(newForms);
  };

  const handleAddConsultation = () => {
    setAddConsultation(true);
    handleAddForm();
  };
  const handleAddImpact = () => {
    setAddCImpact(true);
  };

  const handlebackList = () => {
    setAddConsultation(false);
    setEditConsultation(false);

    setForms([]);
  };

  const handleChangeImpact = (e) => {
    if (e.target.name == "particular") {
      apiAuth.get(`/LookupData/Lov/17/75`).then((resp) => {
        setParticularSubList(resp?.data.data);
      });
    }

    const { name, value } = e.target;
    setImpactForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlebackImpactList = () => {
    setAddCImpact(false);
    apiAuth
      .get(`/LookupData/Lov/16`, { TeamList: selectedItems })
      .then((resp) => {
        setParticularList(resp?.data.data);
      });
  };

  const handleInputChange = (id, name, value) => {
    const newForms = forms.map((form) =>
      form.id === id ? { ...form, [name]: value } : form
    );
    setForms(newForms);
  };
  const formatDates = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSubmit = () => {
    const payload = forms.map((form) => ({
      id: 0,
      changeRequestId: 0,
      changeEvaluationId: 0,
      consultedDate: form.consultedDate
        ? formatDates(form.consultedDate)
        : null,
      consultedStaffDesignationId: "",
      consultedStaffId: form.consultedStaffId,
      taskReviewId: "",
      comments: "",
      isActive: true,
      isEditable: true,
    }));

    apiAuth
      .post(
        `/ChangeEvaluationConsultation/Create/${Session.id}/${assetEvaluationId}`,
        payload
      )
      .then((resp) => {
        setAddConsultation(false);
        getRecords();
      })
      .catch((error) => {
        console.error("Error submitting the form:", error);
      });
  };
  const handelImpactSubmit = () => {
    const payload = [
      {
        changeImapactId: 0,
        changeRequestId: 0,
        changeEvaluationId: 0,
        particular: impactForm.particular,
        particularSubCategory: impactForm.particularSubCategory,
        principle: "1",
        hazardDetail: impactForm.hazardDetail,
        otherDetail: "",
        changeImpactHazardList: [],
        documentStatus: "Pending",
        isShowDetail: true,
        changeImpactTasks: [],
      },
    ];
    apiAuth
      .put(`ChangeImpact/Create/${Session.id}/${assetEvaluationId}`, payload)
      .then((resp) => {
        setAddCImpact(false);
      });
  };

  const handelEditConsultation = (staff, date, stffid, id) => {
    setAddConsultation(true);

    setEditConsultation(true);
    setEditStaffName(staff);
    setEditStaffDate(new Date(date));
    setEditStaffId(stffid);
    setEditId(id);
  };

  const handleSave = () => {
    const apiData = {
      consultedDate: editStaffDate,
      consultedStaffDesignationId: 0,
      consultedStaffId: editStaffId,
      comments: "",
      impactTaskIds: selectedTasks,
      remark: remark,
    };
    apiAuth
      .put(`/ChangeEvaluationConsultation/UpdateList?id=${editId}`, apiData)
      .then((resp) => {
        setEditConsultation(false);
        getRecords();
      });
    // Send apiData to the API endpoint using fetch or any other method
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
          {!Session.hasActiveSession && (
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
          {/* )} */}

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
              {list.length && !AddCunsultation ? (
                list.map((itms) => (
                  <Accordion style={{ margin: "0px" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      style={{ minHeight: "60px" }}
                    >
                      <div
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        style={{ width: "40%" }}
                      >
                        <div className="flex items-center">
                          <img
                            src="/assets/images/etc/userpic.png"
                            alt="Card cover image"
                            className="rounded-full mr-4"
                            style={{ width: "4rem", height: "4rem" }}
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold leading-none">
                              {itms.staff}
                            </span>
                            <span className="text-sm text-secondary leading-none pt-5">
                              Consulted on {formatDate(itms.consultedDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                        <div className="flex items-center">
                          <div
                            className="py-0.5 px-3 rounded-full text-sm"
                            style={{
                              backgroundColor:
                                itms.comments == "" || itms.comments == null
                                  ? "rgba(252,165,165)"
                                  : "rgba(134,239,172)",
                              padding: "5px",
                            }}
                          >
                            {itms.comments === ""
                              ? "No Comments Added"
                              : "Comments Added"}
                          </div>{" "}
                          <div
                            className="py-0.5 px-3 rounded-full text-sm"
                            style={{
                              backgroundColor:
                                itms.tasks.length == 0
                                  ? "rgba(252,165,165)"
                                  : "rgba(134,239,172)",
                              padding: "5px",
                              marginLeft: "15px",
                            }}
                          >
                            {itms.tasks.length == 0
                              ? "No Task Added"
                              : "Task Added"}
                          </div>
                        </div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stepper orientation="vertical">
                        <Step>
                          <div className="mat-expansion-panel-body ng-tns-c137-15">
                            <div className="mt-2 ng-tns-c137-15">
                              <div className="prose prose-sm max-w-5xl">
                                <div className="ng-star-inserted">
                                  <span
                                    className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                    style={{
                                      padding: "10px",
                                    }}
                                  >
                                    "No Comments Added"
                                  </span>
                                </div>
                              </div>
                            </div>
                            {itms?.remark !== "" &&
                              itms?.tasks.length !== 0 && (
                                <div style={{ alignItems: "flex-start" }}>
                                  <div
                                    className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                    style={{
                                      padding: "20px",
                                      backgroundColor: "#EBF8FF",
                                    }}
                                  >
                                    <p>
                                      <b>Task Added</b> : {itms.tasks[0]}{" "}
                                    </p>
                                  </div>
                                  <div
                                    className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                    style={{
                                      padding: "20px",
                                      backgroundColor: "#EBF8FF",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <p>
                                      <b>Remarks</b> : {itms.remark}{" "}
                                    </p>
                                  </div>
                                </div>
                              )}
                            <div
                              _ngcontent-fyk-c288=""
                              class="flex items-center w-full  border-b justify-between"
                              style={{ marginTop: "5px" }}
                            ></div>
                            <Button
                              className="ms-5"
                              variant="contained"
                              sx={{
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid black",
                                marginTop: "8px",
                              }}
                              startIcon={
                                <FuseSvgIcon size={20}>
                                  heroicons-outline:user-add
                                </FuseSvgIcon>
                              }
                              onClick={() =>
                                handelEditConsultation(
                                  itms.staff,
                                  itms.consultedDate,
                                  itms.consultedStaffId,
                                  itms.id
                                )
                              }
                            >
                              Edit Consultation
                            </Button>
                          </div>
                        </Step>
                      </Stepper>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography className="ps-5">
                  No Evaluation Consultations added
                </Typography>
              )}

              <div className="flex justify-start">
                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{ marginTop: "15px" }}
                >
                  {!AddCunsultation && (
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      style={{ padding: "15px" }}
                      onClick={handleAddConsultation}
                      startIcon={
                        <FuseSvgIcon size={20}>
                          heroicons-outline:plus
                        </FuseSvgIcon>
                      }
                    >
                      Add New Consultation
                    </Button>
                  )}
                </div>
              </div>
              {AddCunsultation && (
                <div className="font-semibold ps-5">
                  <a rel="noopener noreferrer" onClick={handlebackList}>
                    Back to List
                  </a>
                </div>
              )}

              {!editConsultation && (
                <>
                  {AddCunsultation &&
                    forms.map((form, index) => (
                      <div
                        style={{
                          marginTop: "30px",
                          justifyContent: "space-start",
                        }}
                        className="flex flex-row "
                        key={index}
                      >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <FormControl
                            sx={{
                              marginLeft: "10px",
                            }}
                          >
                            <Box sx={{}}>
                              <DatePicker
                                label="Validity Expires On *"
                                name="consultedDate"
                                renderInput={(params) => (
                                  <TextField fullWidth {...params} />
                                )}
                                value={form.consultedDate}
                                onChange={(newValue) =>
                                  handleInputChange(
                                    form.id,
                                    "consultedDate",
                                    newValue
                                  )
                                }
                              />
                            </Box>
                          </FormControl>
                        </LocalizationProvider>
                        <Box
                          sx={{
                            width: 860,
                            maxWidth: "50%",
                            marginLeft: "5rem",
                          }}
                        >
                          <FormControl fullWidth>
                            <InputLabel id="division-label">
                              Search Staff
                            </InputLabel>
                            <Select
                              labelId="division-label"
                              name="consultedStaffId"
                              id={`consultedStaffId-${form.id}`}
                              value={form.consultedStaffId}
                              onChange={(e) =>
                                handleInputChange(
                                  form.id,
                                  "consultedStaffId",
                                  e.target.value
                                )
                              }
                            >
                              <MenuItem value="" disabled>
                                <em>None</em>
                              </MenuItem>
                              {docStaff.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
                                  {option.text}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          className="whitespace-nowrap mt-5"
                          startIcon={
                            <FuseSvgIcon size={20}>
                              heroicons-solid:trash
                            </FuseSvgIcon>
                          }
                          onClick={() => handleRemoveForm(form.id)}
                        ></Button>
                      </div>
                    ))}
                </>
              )}
              {editConsultation && (
                <>
                  <div
                    style={{
                      marginTop: "30px",
                      justifyContent: "space-start",
                    }}
                    className="flex flex-row "
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <FormControl
                        sx={{
                          marginLeft: "10px",
                        }}
                      >
                        <FormLabel component="legend" className="text-14">
                          Consulted On
                        </FormLabel>
                        <Box sx={{}}>
                          <DatePicker
                            name="consultedDate"
                            renderInput={(params) => (
                              <TextField fullWidth {...params} />
                            )}
                            value={editStaffDate}
                            disabled
                          />
                        </Box>
                      </FormControl>
                    </LocalizationProvider>

                    <Box
                      sx={{
                        width: 860,
                        maxWidth: "50%",
                        marginLeft: "5rem",
                      }}
                    >
                      <FormControl fullWidth>
                        <FormLabel component="legend" className="text-14">
                          Staff
                        </FormLabel>
                        <Select
                          labelId="division-label"
                          name="consultedStaffId"
                          id="consultedStaffId"
                          value={editStaffName} // Set the default value here
                          disabled
                        >
                          <MenuItem value={editStaffName} disabled>
                            {editStaffName} {/* Display the value */}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                  <div
                    className="py-0.5 px-3 rounded-full text-sm  mt-5"
                    style={{ paddingLeft: "10px", paddingTop: "10px" }}
                  >
                    No Comments Added By staff
                  </div>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", marginTop: "5px" }}
                  >
                    <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                      <FormLabel
                        htmlFor="reasonForNewDocument"
                        className="font-semibold leading-none"
                      >
                        Tasks
                      </FormLabel>
                      <Select
                        id="reasonForNewDocument"
                        name="reasonForNewDocument"
                        multiple
                        value={selectedTasks}
                        onChange={handleChangeTask}
                        className="mt-5"
                        displayEmpty
                        renderValue={(selected) =>
                          selected.length === 0 ? (
                            <em>None</em>
                          ) : (
                            selected
                              .map((taskId) => {
                                const task = sessionTaskList.find(
                                  (option) => option.value === taskId
                                );
                                return task ? task.text : taskId;
                              })
                              .join(", ")
                          )
                        }
                      >
                        <MenuItem value="" disabled>
                          <em>None</em>
                        </MenuItem>
                        {sessionTaskList.map((option) => (
                          <MenuItem key={option.id} value={option.value}>
                            <Checkbox
                              checked={selectedTasks.indexOf(option.value) > -1}
                            />
                            <ListItemText primary={option.text} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                      <FormLabel
                        htmlFor="reasonForNewDocument"
                        className="font-semibold leading-none"
                      >
                        Remarks
                      </FormLabel>
                      <OutlinedInput
                        id="reasonForNewDocument"
                        name="reasonForNewDocument"
                        onChange={handleRemarkChange}
                        label="Reason For Change*"
                        className="mt-5"
                        // value={valueRemark}
                      />
                    </FormControl>
                  </Box>
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
                      <Button
                        className="whitespace-nowrap"
                        variant="contained"
                        color="secondary"
                        style={{ padding: "15px" }}
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
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
                        onClick={handleAddConsultation}
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
                </>
              )}
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              <Paper>
                {AddImpact && (
                  <>
                    <div
                      className="font-semibold ps-5"
                      style={{ padding: "15px" }}
                    >
                      <a
                        rel="noopener noreferrer"
                        onClick={handlebackImpactList}
                      >
                        Back to Impact View
                      </a>
                    </div>
                    <div
                      className="my-10"
                      style={{ borderTopWidth: "2px" }}
                    ></div>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "5px",
                        margin: "20px",
                      }}
                    >
                      <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                        <FormLabel
                          htmlFor="particular"
                          className="font-semibold leading-none"
                        >
                          Particular *
                        </FormLabel>
                        <Select
                          id="particular"
                          name="particular"
                          value={impactForm.particular}
                          onChange={handleChangeImpact}
                          className="mt-5"
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {particularList.map((option) => (
                            <MenuItem key={option.id} value={option.value}>
                              <ListItemText primary={option.text} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                        <FormLabel
                          htmlFor="particularSubCategory"
                          className="font-semibold leading-none"
                        >
                          Particular Sub Category *
                        </FormLabel>
                        <Select
                          id="particularSubCategory"
                          name="particularSubCategory"
                          value={impactForm.particularSubCategory}
                          onChange={handleChangeImpact}
                          className="mt-5"
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {particularSubList.map((option) => (
                            <MenuItem key={option.id} value={option.value}>
                              <ListItemText primary={option.text} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                        <FormLabel
                          htmlFor="hazardDetail"
                          className="font-semibold leading-none"
                        >
                          Detail of Hazard or How the Action/Task to be Achieved
                        </FormLabel>
                        <OutlinedInput
                          id="hazardDetail"
                          name="hazardDetail"
                          value={impactForm.hazardDetail}
                          onChange={handleChangeImpact}
                          label="Reason For Change*"
                          className="mt-5"
                        />
                      </FormControl>
                    </Box>
                    <div
                      className="my-10"
                      style={{ borderTopWidth: "2px" }}
                    ></div>
                    <Button
                      className="whitespace-nowrap mt-5"
                      style={{
                        border: "1px solid",
                        backgroundColor: "#0000",
                        color: "black",
                        borderColor: "rgba(203,213,225)",
                        marginLeft: "30px",
                      }}
                      variant="contained"
                      startIcon={
                        <FuseSvgIcon size={20}>
                          heroicons-outline:plus
                        </FuseSvgIcon>
                      }
                    >
                      Add New Task
                    </Button>
                    <div
                      className="my-10"
                      style={{ borderTopWidth: "2px" }}
                    ></div>
                    <div className="flex justify-end">
                      <div
                        className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                        style={{ marginTop: "15px" }}
                      >
                        <Button
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                          style={{ margin: "15px" }}
                          //   onClick={() => handleOpen(btn)}
                          startIcon={
                            <FuseSvgIcon size={20}>
                              heroicons-outline:plus
                            </FuseSvgIcon>
                          }
                          onClick={handelImpactSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Paper>
              {!AddImpact && (
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
                      onClick={handleAddImpact}
                    >
                      Add New Impact
                    </Button>
                  </div>
                </div>
              )}
            </CustomTabPanel>
          </Box>

          {AddCunsultation && !editConsultation && (
            <>
              <div
                className="my-10"
                style={{ borderTopWidth: "2px", marginTop: "40px" }}
              ></div>

              <div
                className="flex justify-between items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                style={{ marginTop: "15px" }}
              >
                <Button
                  className="whitespace-nowrap mt-5"
                  style={{
                    border: "1px solid",
                    backgroundColor: "black",
                    color: "white",
                    marginLeft: "10px",
                  }}
                  variant="contained"
                  startIcon={
                    <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                  }
                  onClick={handleAddConsultation}
                >
                  Add Stake
                </Button>

                <div className="flex items-center space-x-12">
                  <Button
                    className="whitespace-nowrap mt-5"
                    style={{
                      border: "1px solid",
                      backgroundColor: "#0000",
                      color: "black",
                      borderColor: "rgba(203,213,225)",
                      marginLeft: "10px",
                    }}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    style={{ padding: "15px" }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </>
          )}
          {!Session.hasActiveSession && (
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
