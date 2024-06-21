import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useGetAcademyCategoriesQuery } from "../moc/evaluation/AcademyApi";
import { useState } from "react";
import {
  Button,
  Container,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box, Modal, Paper } from "@mui/material";
import { apiAuth } from "src/utils/http";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Task = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "615px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1100px",
    maxWidth: "80vw",
    height: "55%",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };

  const { data: categories } = useGetAcademyCategoriesQuery();
  const [taskList, setTaskList] = useState([]);
  const [taskClick, setTaskClick] = useState([]);

  const [task, setTask] = useState({});
  const [priority, setPriority] = useState(task.priority);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State variable to control sidebar open/close
  const [selectedCategory, setSelectedCategory] = useState("Pending");
  const [selectedCategoryEvalImp, setSelectedCategoryEvalImp] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [comments, setComments] = useState("");
  const router = useParams();
  const [open, setOpen] = useState(false);
  const [dateExtendopen, setDateExtendOpen] = useState(false);

  const taskType = router["*"];

  useEffect(() => {
    setPriority(task.priority);
  }, [task]);

  const handlePriorityChange = (event) => {
    const newPriority = parseInt(event.target.value, 10);
    setPriority(newPriority);
    setTask((prevTask) => ({
      ...prevTask,
      priority: newPriority,
    }));
  };
  const handledateExtendopen = (e) => {
    e.preventDefault();
    setDateExtendOpen(true);
  };
  const handlehandledateExtendClose = () => setDateExtendOpen(false);

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  function getRecords() {
    apiAuth.get(`/Task/List`).then((resp) => {
      setTaskList(resp.data.data);
    });
  }

  useEffect(() => {
    getRecords();
  }, []);

  // Function to open sidebar
  const openSidebar = (e, task) => {
    e.preventDefault();
    setTask(task);
    setSidebarOpen(true);
    if (task.sourceTaskId != null) {
      apiAuth
        .get(`ChangeImpact/ListTaskCommentst?id=${task.sourceTaskId}`)
        .then((response) => {
          setTaskClick(response.data.data);
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // Function to close sidebar
  const closeSidebar = (e) => {
    e.preventDefault();
    setSidebarOpen(false);
  };

  function calculateDiff(data) {
    let date = new Date(data);
    let currentDate = new Date();

    let days = Math.floor(
      (date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24
    );
    return days;
  }

  const handleSubmit = () => {
    const updatedTask = {
      ...task,
      notes: comments,
    };

    apiAuth
      .put(`/Task/Update?id=${taskType}`, updatedTask)
      .then((response) => {
        setOpen(false);
        console.log(response);
      })
      .catch((error) => {
        setOpen(false);
        console.error(error);
      });
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }

    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [sidebarOpen]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      if (isNaN(date)) {
        throw new Error("Invalid date");
      }
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      console.error("Error parsing date:", error.message);
      return "Invalid date";
    }
  };

  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  function handleSelectedCategory(event) {
    setSelectedCategory(event.target.value);
  }
  function handleSelectedCategoryEvalImp(event) {
    setSelectedCategoryEvalImp(event.target.value);
  }
  const handleAll = (value) => {
    setSelectedCategory(value);
  };

  const handleConsultationorImp = (value) => {
    setSelectedCategoryEvalImp(value);
  };

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterTasks = (list) => {
    let filteredTasks = list.taskList;

    // Filter based on completion status
    if (selectedCategory === "Complete") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    } else if (selectedCategory === "Pending") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    }

    // Filter based on task type
    if (selectedCategoryEvalImp === "Evaluation Consultation") {
      filteredTasks = filteredTasks.filter((task) => task.taskType === 1);
    } else if (selectedCategoryEvalImp === "Evaluation Impacts Tasks") {
      filteredTasks = filteredTasks.filter((task) => task.taskType === 2);
    }

    if (searchTerm) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredTasks;
  };

  const [reqDate, setReqDate] = React.useState(null);
  const [commentss, setCommentss] = React.useState("");

  const handleSubmits = () => {
    // Handle the form submission logic
    console.log("Request Date:", reqDate);
    console.log("Comments:", comments);
  };

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }
  return (
    <>
      <div className="" style={{ margin: "30px" }}>
        <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            style={{ fontSize: "x-large" }}
          >
            <b>Tasks</b>
          </InputLabel>

          <FormControl
            className="flex w-full sm:w-136"
            variant="outlined"
            style={{ backgroundColor: "white" }}
          >
            <InputLabel id="category-select-label">Site</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              label="Category"
              value={selectedCategory}
              onChange={handleSelectedCategory}
            >
              <MenuItem value="All" onClick={(e) => handleAll("All")}>
                <em> All </em>
              </MenuItem>
              <MenuItem value="Complete" onClick={(e) => handleAll("Complete")}>
                <em> Complete </em>
              </MenuItem>
              <MenuItem value="Pending" onClick={(e) => handleAll("Pending")}>
                <em> Pending </em>
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            className="flex w-full sm:w-136 flex-grow-1"
            variant="outlined"
            style={{ backgroundColor: "white" }}
          >
            <InputLabel id="category-select-label">Type</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              label="Category"
              value={selectedCategoryEvalImp}
              onChange={handleSelectedCategoryEvalImp}
            >
              <MenuItem
                value="All"
                onClick={(e) => handleConsultationorImp("All")}
              >
                <em> All </em>
              </MenuItem>
              <MenuItem
                value="Evaluation Consultation"
                onClick={(e) =>
                  handleConsultationorImp("Evaluation Consultation")
                }
              >
                <em> Evaluation Consultation </em>
              </MenuItem>
              <MenuItem
                value="Evaluation Impacts Tasks"
                onClick={(e) =>
                  handleConsultationorImp("Evaluation Impacts Tasks")
                }
              >
                <em> Evaluation Impacts Tasks </em>
              </MenuItem>
            </Select>
          </FormControl>
          <Box className="flex-grow-1" style={{ backgroundColor: "white" }}>
            <TextField
              fullWidth
              label="Search by Task Name"
              id="fullWidth"
              value={searchTerm}
              onChange={handleSearchTerm}
            />
          </Box>
        </div>
      </div>
      {taskList.map((list) => {
        const filteredTasks = filterTasks(list);

        if (filteredTasks.length > 0) {
          return (
            <Paper
              key={list.changeRequestId}
              className="sm:my-8 p-24 rounded-16 shadow overflow-hidden"
              style={{ margin: "20px" }}
            >
              <div className="flex flex-col p-4">
                <div className="flex">
                  <div className="flex flex-col flex-auto">
                    <div className="flex items-center justify-between">
                      <div
                        className="py-0.5 px-3 mb-3 rounded-full text-sm font-semibold text-blue-800 bg-blue-100 dark:text-blue-50 dark:bg-blue-500"
                        style={{ padding: "5px" }}
                      >
                        {`${list.requestTypeName} / ${list.requestNo} / ${list.statusName}`}
                      </div>
                    </div>
                    <div className="flex flex-col leading-5 text-md text-secondary space-y-2">
                      <div>
                        Initiated by <b>{list.initiatorName}</b> on{" "}
                        <b>{formatDate(list.requestDate)}</b>
                      </div>
                      <div>
                        Project Name: <b>{list.projectName}</b>
                      </div>
                      <div>
                        Change Leader: <b>{list.changeLeaderName}</b>
                      </div>
                    </div>
                  </div>
                  <div className="pl-4">
                    <div
                      className="text-lg p-4 border rounded cursor-pointer text-blue-500"
                      style={{ padding: "15px" }}
                    >
                      <a
                        className="flex items-center min-w-0 h-full w-full pr-7"
                        href={`/moc/evaluation/${list.changeRequestToken}`}
                        style={{ textDecoration: "none" }}
                      >
                        View MOC details
                      </a>
                    </div>
                  </div>
                </div>
                <div>&nbsp;</div>
                <div className="cdk-drop-list divide-y border rounded mt-3">
                  <div className="w-full" style={{ padding: "2rem" }}>
                    <span className="font-semibold text-gray-500">
                      {filteredTasks.length} Tasks
                    </span>
                  </div>
                  {filteredTasks.map((task, index) => (
                    <div
                      key={index}
                      className="group w-full select-none border-t h-20 text-lg font-semibold dark:bg-transparent hover:bg-gray-100 dark:hover:bg-hover"
                      style={{ padding: "2.5rem" }}
                      onClick={(e) => openSidebar(e, task)}
                    >
                      <Link
                        to={`/task/${task.id}`}
                        className="relative flex items-center h-full pl-3 w-full"
                      >
                        <div className="z-10 absolute -top-px right-0 -bottom-px flex flex-0 w-1 bg-primary"></div>
                        <div
                          className="flex items-center mr-4"
                          style={{ color: !task.completed ? "black" : "grey" }}
                        >
                          # {task.sourceTaskId}
                        </div>
                        <div
                          className="mr-4 truncate"
                          style={{
                            minWidth: "30%",
                            width: "30%",
                            border: "none",
                          }}
                        >
                          {task.title ? (
                            <span
                              style={{
                                color: !task.completed ? "black" : "grey",
                              }}
                            >
                              {task.title.toLowerCase()}
                            </span>
                          ) : (
                            <span
                              className="select-none text-hint"
                              style={{
                                color: !task.completed ? "black" : "grey",
                              }}
                            >
                              {task.type.toLowerCase()} title
                            </span>
                          )}
                        </div>
                        {task.taskType === 2 &&
                          task.completed &&
                          task.taskApprovalStatus === 3 && (
                            <div
                              className="flex items-center text-green-400 font-semibold"
                              onClick={(e) => openSidebar(e, task)}
                            >
                              Approved
                            </div>
                          )}
                        {task.taskType === 2 &&
                          task.completed &&
                          task.taskApprovalStatus !== 3 && (
                            <div
                              className="flex items-center text-blue-400 font-semibold"
                              onClick={(e) => openSidebar(e, task)}
                            >
                              Awaiting Approval
                            </div>
                          )}
                        {task.taskType === 1 && task.completed && (
                          <div
                            className="flex items-center text-green-400 font-semibold"
                            onClick={(e) => openSidebar(e, task)}
                          >
                            Completed
                          </div>
                        )}
                        {!task.completed && (
                          <div
                            className="flex items-center text-red-600 font-semibold"
                            onClick={(e) => openSidebar(e, task)}
                          >
                            Pending
                          </div>
                        )}
                        {!task.completed &&
                          task.taskType === 2 &&
                          task.dueDate !== null && (
                            <div>
                              {calculateDiff(task.dueDate) > 0 && (
                                <span>
                                  due in {calculateDiff(task.dueDate)} days
                                </span>
                              )}
                              {calculateDiff(task.dueDate) < 0 && (
                                <span className="text-red-600">
                                  due exceeded by{" "}
                                  {Math.abs(calculateDiff(task.dueDate))} days
                                </span>
                              )}
                              {calculateDiff(task.dueDate) === 0 && (
                                <span className="text-red-600">due today</span>
                              )}
                            </div>
                          )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </Paper>
          );
        }
        return null;
      })}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box>
              <div className="flex">
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "15px",
                    marginRight: "5px",
                    marginTop: "5px",

                    color: "red",
                  }}
                >
                  <img src="/assets/images/etc/icon.png" />
                </Typography>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "2rem",
                  }}
                >
                  Confirm action
                  <Typography
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                    style={{
                      fontSize: "15px",
                      fontWeight: "800px !important",
                      color: "grey",
                    }}
                  >
                    Once submitted, you cannot update the comments. Are you sure
                    you want to continue?
                  </Typography>
                </Typography>
              </div>
            </Box>
            <div
              className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
              style={{
                marginTop: "15px",
                justifyContent: "end",
                backgroundColor: " rgba(248,250,252)",
                padding: "10px",
              }}
            >
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="primary"
                style={{
                  padding: "23px",
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid grey",
                }}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                style={{ padding: "23px", backgroundColor: "red" }}
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={dateExtendopen}
        onClose={handlehandledateExtendClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={dateExtendopen}>
          <Box sx={style1}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            ></Box>

            <Box sx={{ overflow: "auto", padding: "5px 30px 0 30px" }}>
              <Grid container spacing={2} className="mt-5">
                <Grid item xs={12}>
                  <Table
                    className="mat-elevatio demo-table col-span-12 mt-0 w-full"
                    sx={{ width: "100%" }}
                  >
                    <TableHead
                      sx={{
                        borderBottom: "2px solid silver",
                        fontSize: "medium",
                      }}
                    >
                      <TableRow>
                        <TableCell className="text-left pb-3">
                          Actual Date
                        </TableCell>
                        <TableCell className="text-left pb-3">
                          Request Comments
                        </TableCell>
                        <TableCell className="text-left pb-3">
                          Request Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ width: "20%" }}
                        >
                          Approved Comments
                        </TableCell>
                        <TableCell className="text-left pb-3">
                          Approved Date
                        </TableCell>
                        <TableCell className="text-left pb-3">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{/* Table rows will go here */}</TableBody>
                  </Table>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="mt-5">
                <Grid item xs={12}>
                  <Typography variant="body1" className="font-semibold pt-4">
                    Old Due Date
                  </Typography>
                  <Typography variant="body1" className="mt-2 cursor-pointer">
                    November 15, 2023
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  style={{ maxWidth: "100%", flexBasis: "100%" }}
                >
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    style={{ width: "100%" }}
                  >
                    <DatePicker
                      label="Request Date*"
                      value={reqDate}
                      onChange={(newValue) => setReqDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth required />
                      )}
                      minDate={new Date("2023-11-15")}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} className="mt-5">
                  <TextField
                    label="Remark"
                    multiline
                    rows={1}
                    fullWidth
                    required
                    value={comments}
                    onChange={(e) => setCommentss(e.target.value)}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ paddingTop: "15px", paddingBottom: "20px" }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmits}
                    sx={{ float: "right" }}
                  >
                    Submit for Approval
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Add sidebar content here */}
        {/* <button onClick={closeSidebar}>Close Sidebar</button> */}
        <div className="flex flex-auto">
          <form
            className="flex flex-col flex-auto p-6 pt-10 sm:p-8 sm:pt-10 overflow-y-auto"
            style={{ overflow: "hidden" }}
          >
            <div
              className="flex items-center justify-between -mt-3 -ml-4"
              style={{ padding: "5px" }}
            >
              <span className="pr-4 pl-3.5">
                <div className="flex items-center justify-center">
                  <span className="font-bold text-xl">Task #</span>
                </div>
              </span>

              <div className="flex items-center">
                {task.taskType === 2 && task.taskStatus !== 3 && (
                  <button
                    className="focus:outline-none px-4 py-2 text-dark bg-white-600 border rounded-3xl flex items-center justify-center"
                    style={{ padding: "10px", marginRight: "10px" }}
                    onClick={handledateExtendopen}
                  >
                    {task.activeDateUpdateRequest !== 1 ? (
                      <span className="ml-2 font-semibold">Extend Date</span>
                    ) : (
                      <span className="ml-2">Extend Date Requested</span>
                    )}
                  </button>
                )}
                <button className="focus:outline-none" onClick={closeSidebar}>
                  close
                </button>
              </div>
            </div>
            <div>&nbsp;</div>

            <hr className="my-4" />
            <div>&nbsp;</div>

            <div className="w-full">
              <div className="relative flex flex-auto flex-col w-full">
                <div className="flex-auto">
                  <div className="flex flex-col-reverse">
                    <div className="flex flex-col flex-auto flex-shrink">
                      {task.taskType == 1 && (
                        <>
                          <div className="flex flex-col flex-wrap items-start mb-2">
                            <div
                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                              style={{
                                padding: "20px",
                                backgroundColor: "#EBF8FF",
                              }}
                            >
                              <div className="font-semibold">
                                {" "}
                                {task.assignedByStaff}
                              </div>
                              <div className="min-w-4 leading-5">
                                {" "}
                                Please add your consultation comments for the
                                moc{" "}
                              </div>
                              <div className="my-0.5 text-xs font-medium text-secondary">
                                {" "}
                                {new Date(task.assignedAt).toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                          <div>&nbsp;</div>
                          <div className="flex items-center justify-center my-3">
                            <div className="flex-auto border-b"></div>
                            <div className="flex-0 mx-4 text-sm font-medium leading-5 text-secondary">
                              {" "}
                              You are added as a stakeholder on{" "}
                              {new Date(task.assignedAt).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  hour12: true,
                                }
                              )}{" "}
                            </div>
                            <div className="flex-auto border-b"></div>
                          </div>
                          {task.completed && (
                            <div
                              className="flex flex-col flex-wrap items-start mb-2"
                              style={{ alignItems: "end" }}
                            >
                              <div
                                className="relative max-w-3/4 px-3 py-2 rounded-lg bg-grey-100 text-gray-700"
                                style={{ padding: "13px" }}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: task.notes,
                                  }}
                                ></div>
                                <div className="my-0.5 text-xs font-medium text-secondary">
                                  {" "}
                                  {task.completedDate && (
                                    <>
                                      {new Date(
                                        task.completedDate
                                      ).toLocaleString("en-US", {
                                        month: "short",
                                        day: "2-digit",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                      })}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {task.taskType == 2 && (
                        <>
                          <div className="flex flex-col flex-wrap items-start mb-2">
                            <div
                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                              style={{
                                padding: "20px",
                                backgroundColor: "#EBF8FF",
                              }}
                            >
                              <div className="font-semibold">
                                {" "}
                                {task.assignedByStaff}{" "}
                              </div>
                              <div className="min-w-4 leading-5">
                                {" "}
                                What is Task: {task.title}{" "}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col flex-wrap items-start mb-2">
                            <div
                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                              style={{
                                padding: "20px",
                                backgroundColor: "#EBF8FF",
                              }}
                            >
                              <div className="min-w-4 leading-5">
                                {" "}
                                How is Task done: {task.taskhow}{" "}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col flex-wrap items-start mb-2">
                            <div
                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                              style={{
                                padding: "20px",
                                backgroundColor: "#EBF8FF",
                              }}
                            >
                              <div className="min-w-4 leading-5">
                                {" "}
                                Due Date:{" "}
                                {new Date(task.dueDate).toLocaleDateString(
                                  "en-US"
                                )}{" "}
                              </div>
                            </div>
                          </div>
                          <div>&nbsp;</div>
                          <div className="flex items-center justify-center my-3">
                            <div className="flex-auto border-b"></div>
                            <div className="flex-0 mx-4 text-sm font-medium leading-5 text-secondary">
                              {" "}
                              {task.assignedAt === null ? (
                                <span>
                                  {task.assignedByStaff} has assigned a task to
                                  you
                                </span>
                              ) : (
                                <span>
                                  {task.assignedByStaff} has assigned a task to
                                  you on{" "}
                                  {new Date(task.assignedAt).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true,
                                    }
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="flex-auto border-b"></div>
                          </div>
                          <div>&nbsp;</div>
                          {taskClick.map((msg) => (
                            <div
                              key={msg.id}
                              className="flex flex-col flex-wrap mb-2"
                            >
                              {/* Remark Section */}
                              {msg.remark && (
                                <div className="flex flex-col items-end">
                                  <div
                                    className="relative max-w-3/4 px-3 py-2 rounded-lg bg-grey-100 text-gray-700"
                                    style={{ padding: "20px" }}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: msg.remark,
                                      }}
                                    ></div>
                                    <div className="my-0.5 text-xs font-medium text-secondary">
                                      <small>
                                        {msg.startedDate &&
                                        !msg.workInProgressDate &&
                                        !msg.completedDate &&
                                        !msg.dueDate
                                          ? `Started on ${formatDates(msg.startedDate)}`
                                          : msg.workInProgressDate &&
                                              !msg.completedDate &&
                                              !msg.dueDate
                                            ? `Work in Progress since ${formatDates(msg.workInProgressDate)}`
                                            : msg.dueDate && !msg.completedDate
                                              ? `Due on ${formatDates(msg.dueDate)}`
                                              : msg.completedDate
                                                ? `Completed on ${formatDates(msg.completedDate)}`
                                                : "Unknown"}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Comments Section */}
                              {msg.comments && (
                                <div className="flex flex-col items-start">
                                  <div
                                    className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                    style={{
                                      padding: "20px",
                                      backgroundColor: "#EBF8FF",
                                    }}
                                  >
                                    <div className="font-semibold">
                                      {" "}
                                      {task.changeLeaderName}{" "}
                                    </div>
                                    <div
                                      className="min-w-4 leading-5 "
                                      dangerouslySetInnerHTML={{
                                        __html: msg.comments,
                                      }}
                                      style={{ fontSize: "smaller" }}
                                    ></div>
                                    <div
                                      className="min-w-4 leading-5"
                                      style={{ fontSize: "xx-small" }}
                                    >
                                      {" "}
                                      {msg.approvalStatusDate && (
                                        <>
                                          Rejected on{" "}
                                          {new Date(
                                            msg.approvalStatusDate
                                          ).toLocaleString("en-US", {
                                            month: "short",
                                            day: "2-digit",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                          })}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {/* {taskClick.map(
                            (message) =>
                              message.comments && (
                                <div className="flex flex-col flex-wrap items-start mb-2">
                                  <div
                                    className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                    style={{
                                      padding: "20px",
                                      backgroundColor: "#EBF8FF",
                                    }}
                                  >
                                    <div className="font-semibold">
                                      {" "}
                                      {task.changeLeaderName}{" "}
                                    </div>
                                    <div
                                      className="min-w-4 leading-5"
                                      dangerouslySetInnerHTML={{
                                        __html: message.comments,
                                      }}
                                    ></div>
                                    <div className="min-w-4 leading-5">
                                      {" "}
                                      {message.approvalStatusText}
                                      {message.approvalStatusDate && (
                                        <>
                                          on{" "}
                                          {new Date(
                                            message.approvalStatusDate
                                          ).toLocaleString("en-US", {
                                            month: "short",
                                            day: "2-digit",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                          })}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                          )} */}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>&nbsp;</div>
              {!task.completed && (
                <div>
                  <div className="w-full">
                    <textarea
                      rows="1"
                      placeholder="Write your comments *"
                      className="w-full h-9  border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                      spellCheck="false"
                      style={{
                        paddingTop: "1.2rem",
                        paddingBottom: "7.2rem",

                        paddingLeft: "1.3rem",
                        paddingRight: "0.3rem",
                        margin: "5px",
                        height: "calc(1.2rem + 7.2rem)", // Adjust height to include padding
                        overflow: "hidden", // Prevent scrollbar
                      }}
                      onChange={(e) => setComments(e.target.value)}
                    ></textarea>
                  </div>
                  {task.taskType == 2 && (
                    <RadioGroup
                      className="flex flex-row-reverse"
                      value={priority}
                      aria-label="priority"
                      onChange={handlePriorityChange}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        label="Completed"
                        className="mt-2"
                        checked={task.priority == 3}
                        value={3}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="Work in progress"
                        className="mt-2 pr-4"
                        checked={task.priority == 2}
                        value={2}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="Started"
                        className="mt-2 pr-4"
                        checked={task.priority == 1}
                        value={1}
                      />
                    </RadioGroup>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex-auto"></div>
                    <button
                      className="focus:outline-none px-4 py-2 text-white bg-blue-600 rounded-md flex items-center justify-center"
                      style={{ padding: "10px", marginRight: "10px" }}
                      onClick={handleOpen}
                    >
                      <span className="ml-2 font-semibold">Submit</span>
                    </button>
                  </div>
                </div>
              )}
              {task.completed &&
                task.taskApprovalStatus === 3 &&
                task.taskType === 2 && (
                  <div className="flex items-center justify-center my-3">
                    <div className="flex-auto border-b"></div>
                    <div
                      className="flex-0 mx-4 text-sm font-medium leading-5 text-success"
                      style={{ color: "green" }}
                    >
                      {" "}
                      <span className="text-success">
                        {task.changeLeaderName} has approved your task
                      </span>
                    </div>
                    <div className="flex-auto border-b"></div>
                  </div>
                )}
              {task.completed &&
                (task.taskApprovalStatus == 2 ||
                  task.taskApprovalStatus == 4) && (
                  <div className="flex items-center justify-center my-3">
                    <div className="flex-auto border-b"></div>
                    <div
                      className="flex-0 mx-4 text-sm font-medium leading-5 text-success"
                      style={{ color: "green" }}
                    >
                      {" "}
                      <span className="text-success">
                        Awaiting approval from
                        {task.changeLeaderName}
                      </span>
                    </div>
                    <div className="flex-auto border-b"></div>
                  </div>
                )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Task;
