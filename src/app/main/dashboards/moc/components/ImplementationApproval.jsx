import { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SwipeableViews from "react-swipeable-views";
import { apiAuth } from "src/utils/http";
import { ChangeDeadlineLabel } from "./ChangeDeadLineLabels";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TableContainer from "@mui/material/TableContainer";
import { styled } from "@mui/material/styles";
import Initiation from "./Initiation";
// Adjust the path based on your project structure

function createData(
  index,

  Task,
  Audit,
  date,
  staff
) {
  return { Task, Audit, date, staff };
}

function ImplementationApproval({
  assetEvaluationId,
  currentActivityForm,
  lastActCode,
  AppActions,
  AppActivity,
  setContent,
  contentDetailsini,
}) {
  const columns = [
    { id: "index", label: "#", minWidth: 50 },
    {
      id: "Task",
      label: "Task",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Audit",
      label: "Audit Comments",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "date",
      label: "Done By date",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "staff",
      label: "Done By staff",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const steps = [
    {
      label: "RFQ",
    },
    {
      label: "Vendor Finalization",
    },
    {
      label: "Mobilization",
    },
    {
      label: "Closeout",
    },
    {
      label: "Handover",
    },
  ];
  const styleImp = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "1px",
  };
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "900px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };
  const styleAuditCom = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const [activeStep, setActiveStep] = useState(0);
  const [ImpDetails, setImpDetails] = useState([]);
  const [impComments, setImpComments] = useState([]);
  const [openImplemntationTask, setOpenImplemntationTask] = useState(false);
  const [openAudit, setOpenAudit] = useState(false);
  const [openAuditComment, setOpenAuditComment] = useState(false);

  const handleCloseImplemntationTask = () => setOpenImplemntationTask(false);
  const handleCloseAudit = () => setOpenAudit(false);
  const handleCloseAuditComment = () => setOpenAuditComment(false);

  const [errorsAddTask, setErrorsAddTask] = useState({});
  const [currentAudit, setCurrentAudit] = useState([]);
  const [docStaff, setDocStaff] = useState([]);

  //modal part
  const [open, setOpen] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [selectedFile, setSelectedFile] = useState({
    name: "",
    description: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });

  const drawerStyle = (open) => ({
    width: 350,
    bgcolor: "background.paper",
    borderTopRightRadius: "16px",
    borderBottomRightRadius: "16px",
    boxShadow: 24,
    p: 2,
    position: "absolute",
    top: 0,
    right: open ? 0 : -250, // Move drawer out of view when closed
    height: "100%",
    zIndex: 10,
    transition: "right 0.3s ease",
    overflow: "auto", // Smooth transition for opening/closing
  });
  const BoldLabel = styled("label")({
    fontWeight: "bold",
    color: "black",
  });

  const handelOpenAudit = async (audits, value) => {
    setOpenAudit(true);

    if (value == "fullList") {
      const response = await apiAuth.get(
        `/ChangeImplementation/AuditList/${assetEvaluationId}`
      );
      console.log(response, "ressss");
      const transformedData = response.data.data.map((item, index) =>
        createData(
          index + 1,
          item.task,
          item.comments,
          item.donebydate,
          item.auditDoneBy
        )
      );
      setCurrentAudit(transformedData);
    } else {
      const transformedData = audits.map((item, index) =>
        createData(
          index + 1,
          item.task,
          item.comments,
          item.donebydate,
          item.auditDoneBy
        )
      );
      setCurrentAudit(transformedData);
    }
  };

  const [auditData, setAuditData] = useState({
    comments: "",
    isActive: true,
    auditsid: "",
  });

  const handelOpenAuditComment = (auditsid) => {
    setOpenAuditComment(true);
    setAuditData((prevState) => ({
      ...prevState,
      auditsid: auditsid,
    }));
  };

  const [taskAdd, setTaskAdd] = useState({
    showPreviousTasks: false,
    actionWhat: "",
    actionHow: "",
    assignedStaffId: "",
    dueDate: new Date(),
    audit: "",
  });

  const validateAddTask = () => {
    let tempErrors = {};

    if (!taskAdd.actionWhat) tempErrors.actionWhat = "Action Name is required";
    if (!taskAdd.actionHow) tempErrors.actionHow = "Action Name is required";
    if (!taskAdd.assignedStaffId)
      tempErrors.assignedStaffId = "Assigned Staff  is required";

    if (!taskAdd.dueDate) tempErrors.dueDate = "Date Field is required";
    if (!taskAdd.audit) tempErrors.audit = "Audit Field is required";

    // Add other validations here
    setErrorsAddTask(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleChangeAddTask = (e) => {
    const { name, value } = e.target;
    setTaskAdd((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleAddAuditComment = (e) => {
    const { name, value } = e.target;
    setAuditData((prevState) => ({
      ...prevState,
      comments: value,
    }));
  };

  const [comments, setComments] = useState("");
  const [currentActiveStepLabel, setCurrentActiveStepLabel] = useState("");

  const getRecords = async () => {
    try {
      const response = await apiAuth.get(
        `/ChangeImpact/ListTask?id=${assetEvaluationId}`
      );
      setImpDetails(response.data?.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    getRecords();
  }, [currentActiveStepLabel]);

  useEffect(() => {
    // Update current active step label whenever activeStep changes
    setCurrentActiveStepLabel(steps[activeStep]?.label);
  }, [activeStep, steps]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const [expanded, setExpanded] = useState(null); // State to track expanded Accordion

  const handleAccordionChange = (panelId) => (event, isExpanded) => {
    setExpanded(isExpanded ? panelId : null);
  };

  const handleChangeTaskDate = (date) => {
    setTaskAdd((prevState) => ({
      ...prevState,
      dueDate: date,
    }));
  };

  const handelComments = (e, taskid) => {
    apiAuth
      .get(`ChangeImpact/ListTaskCommentst?id=${taskid}`)
      .then((resp) => {
        const comments = resp.data.data;
        setImpComments(comments);
      })
      .catch((error) => {
        console.error("Error fetching task comments:", error);
      });
  };

  const handleOpenImplemntationTask = () => {
    setOpenImplemntationTask(true);
    apiAuth.get(`Staff/LOV`).then((resp) => {
      setDocStaff(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/16`).then((resp) => {
      setParticular(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/11`).then((resp) => {});
  };

  const handelApproveImpl = (e, task) => {
    const updatedTask = {
      ...task,
      submissionList: impComments,
      comments: comments,
      parentId: 0,
      taskStatus: 3,
      changeEvaluationId: 0,
      changeImapactId: 0,
      taskStatusText: "Work In Progress",
    };

    apiAuth
      .post(`ChangeImpact/ActionTask?id=${assetEvaluationId}`, updatedTask)
      .then((response) => {
        getRecords();
        handelComments(e, task.id);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handelRejectImpl = (e, task) => {
    const updatedTask = {
      ...task,
      comments: comments,
      submissionList: impComments,
      ChangeEvaluationId: 0,
      ParentId: 0,
      taskStatus: 4,
    };
    apiAuth
      .post(`ChangeImpact/ActionTask?id=${assetEvaluationId}`, updatedTask)
      .then((response) => {
        handelComments(e, task.id);
        getRecords();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handelTaskSubmit = (e) => {
    if (validateAddTask()) {
      let deadlineValue;

      switch (currentActiveStepLabel) {
        case "RFQ":
          deadlineValue = 1;

          break;
        case "Vendor Finalization":
          deadlineValue = 2;
          break;
        case "Mobilization":
          deadlineValue = 3;
          break;
        case "Closeout":
          deadlineValue = 4;
          break;
        case "Handover":
          deadlineValue = 5;
          break;
        default:
          deadlineValue;
          break;
      }
      const updatedTaskAdd = {
        ...taskAdd,
        deadline: deadlineValue,
        changeEvaluationId: 0,
        ChangeImapactId: 0,
        parentId: 0,
        // Assuming you have a deadline property in taskAdd
      };
      console.log(updatedTaskAdd, "updatedTaskAdd");
      apiAuth
        .put(`/Task/AddNewTask/${assetEvaluationId}`, updatedTaskAdd)
        .then((resp) => {
          getRecords();
        });
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handelAuditCommentSubmit = () => {
    apiAuth
      .put(
        `/ChangeImplementation/Audit/?requestToken=${assetEvaluationId}&&taskId=${auditData.auditsid}`,
        {
          comments: auditData.comments,
          isActive: auditData.isActive,
        }
      )
      .then((resp) => {
        setOpenAuditComment(false);
        getRecords();
      });
  };

  const SubmitApprovelCreate = (e, btnid) => {
    apiAuth
      .post(`/ChangeImplementation/ExecuteActivity/${assetEvaluationId}`, {
        activityUID: lastActCode.uid,
        actionUID: btnid,
        formUID: lastActCode?.formUID,
      })
      .then((resp) => {
        apiAuth
          .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
          .then((resp) => {
            setContent(resp.data.data.phases);
          });
      });
  };

  const ListDoc = (docu_id, id) => {
    apiAuth
      .get(`/DocumentManager/DocList/${docu_id}/Task?changeRequestToken=${id}`)
      .then((Resp) => {
        setListDocument(Resp?.data?.data);
      });
  };

  const handleOpen = (id) => {
    setOpen(true);
    ListDoc(id, assetEvaluationId);
  };

  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
  };
  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };
  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDownload = () => {
    apiAuth
      .get(`/DocumentManager/download/${documenDowToken}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", selectedDocument.name); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
  };
  return (
    <div className="w-full">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleModalClose}
        closeAfterTransition
        // Customize backdrop appearance
        BackdropComponent={Backdrop}
        // Props for backdrop customization
        BackdropProps={{
          timeout: 500, // Adjust as needed
          style: {
            // Add backdrop styles here
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style1}>
            <Box sx={{ flex: 1 }}>
              <Box className="flex justify-between" style={{ margin: "30px" }}>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  File Manager
                  <Typography id="transition-modal-subtitle" component="h2">
                    {listDocument.length} Files
                  </Typography>
                </Typography>
                <Box>
                  {/* <Button
                    className=""
                    variant="contained"
                    color="secondary"
                    onClick={toggleDrawer(true)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                    <span className="mx-4 sm:mx-8">Upload File</span>
                  </Button> */}
                </Box>
              </Box>
              <Box>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  className="d-flex flex-wrap p-6 md:p-8 md:py-6 min-h-[415px] max-h-120 space-y-8 overflow-y-auto custom_height"
                  component="div"
                  style={{
                    backgroundColor: "#e3eeff80",
                  }}
                >
                  {listDocument.map((doc, index) => (
                    <div className="content " key={index}>
                      <div
                        onClick={() => handelDetailDoc(doc)}
                        style={{ textAlign: "-webkit-center" }}
                      >
                        {doc.fileType === "JPG" ? (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        ) : doc.fileType === "JPG" ? (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        ) : (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        )}
                        <h6>{doc?.name}</h6>
                        <h6>by {doc?.staffName}</h6>
                      </div>
                    </div>
                  ))}
                </Typography>
              </Box>
            </Box>
            {openDrawer && !fileDetails && (
              <Box sx={drawerStyle(openDrawer)}>
                <div className="flex justify-end">
                  <Button
                    className=""
                    variant="contained"
                    style={{ backgroundColor: "white" }}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:close</FuseSvgIcon>
                    x
                  </Button>
                </div>
                <div>&nbsp;</div>
                <div className="text-center">
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      handelFileChange(e);
                    }}
                  />
                  <label htmlFor="fileInput">
                    <Button
                      className=""
                      variant="contained"
                      color="secondary"
                      style={{
                        backgroundColor: "#24a0ed",
                        borderRadius: "5px",
                        paddingLeft: "50px",
                        paddingRight: "50px",
                      }}
                      component="span"
                    >
                      <FuseSvgIcon size={20}>
                        heroicons-outline:plus
                      </FuseSvgIcon>
                      <span className="mx-4 sm:mx-8">Upload File</span>
                    </Button>
                  </label>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<BoldLabel>Information</BoldLabel>}
                      variant="standard"
                      disabled
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="selectedFileName"
                      label="Selecte File"
                      variant="standard"
                      disabled
                      value={selectedFile.name}
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<BoldLabel>Description</BoldLabel>}
                      name="description"
                      variant="standard"
                      onChange={handelFileDiscriptionChange}
                      value={selectedFile.description}
                    />
                  </Box>
                </div>

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
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid grey",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    type="submit"
                    onClick={handleSubmitAsset}
                  >
                    Submit
                  </Button>
                </div>
              </Box>
            )}

            {fileDetails && (
              <Box sx={drawerStyle(fileDetails)}>
                <div className="flex justify-end">
                  <Button
                    className=""
                    variant="contained"
                    style={{ backgroundColor: "white" }}
                    onClick={() => setFileDetails(false)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:close</FuseSvgIcon>
                    x
                  </Button>
                </div>
                <div>&nbsp;</div>
                <div className="text-center">
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      handelFileChange(e);
                    }}
                  />
                  <label htmlFor="fileInput">
                    <div className=" ">
                      <div
                        // onClick={handelDetailDoc}
                        style={{
                          textAlign: "-webkit-center",
                        }}
                      >
                        <img src="/assets/images/etc/icon_N.png" />
                      </div>
                      {selectedDocument?.name}
                    </div>
                  </label>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<BoldLabel>Information</BoldLabel>}
                      variant="standard"
                      disabled
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="selectedFileName"
                      label="Created By"
                      variant="standard"
                      disabled
                      value={selectedDocument.staffName}
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label=" Created At"
                      name="description"
                      variant="standard"
                      disabled
                      value={formatDate(selectedDocument.createdAt)}
                    />
                  </Box>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="standard-basic"
                      label={<BoldLabel>Description</BoldLabel>}
                      name="Description"
                      variant="standard"
                      disabled
                      value={
                        selectedDocument.description == null
                          ? ""
                          : selectedDocument.descritpion
                      }
                    />
                  </Box>
                </div>

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
                    color="secondary"
                    type="submit"
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                </div>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAuditComment}
        onClose={handleCloseAuditComment}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAuditComment}>
          <Box sx={styleAuditCom}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
              }}
            >
              <h4>Add Audit</h4>
            </Box>
            <Box>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                style={{
                  fontSize: "4rem",
                  fontWeight: "800px !important",
                }}
              >
                <div className="flex-auto">
                  <div className="flex flex-col-reverse">
                    <div
                      style={{
                        marginTop: "30px",
                        justifyContent: "space-between",
                        margin: "10px",
                      }}
                      className="flex flex-row"
                    >
                      <Box sx={{ width: "100%" }}>
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          Comments *
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="comments"
                          onChange={handleAddAuditComment}
                        />
                      </Box>
                    </div>
                  </div>{" "}
                </div>
                <div className="flex justify-end ">
                  <Button
                    className="whitespace-nowrap ms-5 me-12 "
                    variant="contained"
                    color="secondary"
                    style={{
                      marginTop: "5px",
                    }}
                    onClick={handelAuditCommentSubmit}
                  >
                    Save
                  </Button>
                </div>
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openImplemntationTask}
        onClose={handleCloseImplemntationTask}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openImplemntationTask}>
          <Box sx={styleImp}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
              }}
            >
              Add New Task
            </Box>
            <Box>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                style={{
                  fontSize: "4rem",
                  fontWeight: "800px !important",
                }}
              >
                <div className="flex-auto">
                  <div className="flex flex-col-reverse">
                    <div
                      style={{
                        marginTop: "30px",
                        justifyContent: "space-between",
                        margin: "15px",
                      }}
                      className="flex flex-row "
                    >
                      <Box
                        sx={{
                          width: 380,
                          maxWidth: "48%",
                        }}
                      >
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          What is the Task *
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="actionWhat"
                          onChange={handleChangeAddTask}
                          value={taskAdd.actionWhat}
                          error={!!errorsAddTask.actionWhat}
                          helperText={errorsAddTask.actionWhat}
                        />
                      </Box>

                      <Box
                        sx={{
                          width: 380,
                          maxWidth: "48%",
                        }}
                      >
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          How is the task done *
                        </FormLabel>
                        <TextField
                          fullWidth
                          name="actionHow"
                          onChange={handleChangeAddTask}
                          value={taskAdd.actionHow}
                          error={!!errorsAddTask.actionHow}
                          helperText={errorsAddTask.actionHow}
                        />
                      </Box>
                    </div>
                  </div>{" "}
                  <div className="flex flex-col-reverse">
                    <div
                      style={{
                        marginTop: "30px",
                        justifyContent: "space-between",
                        margin: "15px",
                      }}
                      className="flex flex-row "
                    >
                      <FormControl
                        sx={{
                          width: 380,
                          maxWidth: "48%",
                        }}
                      >
                        <Box>
                          <FormLabel
                            className="font-medium text-14"
                            component="legend"
                          >
                            MOC Phase *
                          </FormLabel>
                          <TextField
                            fullWidth
                            name="deadline"
                            value={currentActiveStepLabel}
                            onChange={handleChangeAddTask}
                          />
                        </Box>
                      </FormControl>
                      <FormControl
                        sx={{
                          width: 380,
                          maxWidth: "48%",
                        }}
                        error={!!errorsAddTask.assignedStaffId}
                      >
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          Task Assigned to*
                        </FormLabel>
                        <Select
                          variant="outlined"
                          onChange={handleChangeAddTask}
                          value={taskAdd.assignedStaffId}
                          name="assignedStaffId"
                        >
                          {docStaff.map((option) => (
                            <MenuItem key={option.id} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errorsAddTask.assignedStaffId && (
                          <FormHelperText>
                            {errorsAddTask.assignedStaffId}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </div>
                  </div>{" "}
                  <div className="flex flex-col-reverse">
                    <div
                      style={{
                        marginTop: "30px",
                        justifyContent: "space-between",
                        margin: "15px",
                      }}
                      className="flex flex-row "
                    >
                      <Box
                        sx={{
                          width: 380,
                          maxWidth: "48%",
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <FormControl error={!!errorsAddTask.dueDate}>
                            <FormLabel
                              className="font-medium text-14"
                              component="legend"
                            >
                              Due Date*
                            </FormLabel>
                            <Box sx={{}}>
                              <DatePicker
                                name="dueDate"
                                value={taskAdd.dueDate}
                                onChange={(date) => handleChangeTaskDate(date)}
                                renderInput={(params) => (
                                  <TextField fullWidth {...params} />
                                )}
                              />
                            </Box>
                            {!!errorsAddTask.dueDate && (
                              <FormHelperText>
                                {errorsAddTask.dueDate}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </LocalizationProvider>
                      </Box>
                      <Box
                        sx={{
                          width: 380,
                          maxWidth: "48%",
                        }}
                      >
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          Audit Commnt*
                        </FormLabel>
                        <TextField
                          fullWidth
                          id="fullWidth"
                          name="audit"
                          onChange={handleChangeAddTask}
                          value={taskAdd.audit}
                          error={!!errorsAddTask.audit}
                          helperText={errorsAddTask.audit}
                        />
                        <h6 className="text-grey">
                          If this task is based on Audit comments, please select
                          the Audit comment
                        </h6>
                      </Box>
                    </div>
                  </div>{" "}
                </div>
                <div className="flex justify-end ">
                  <Button
                    className="whitespace-nowrap ms-5 me-12 "
                    variant="contained"
                    color="secondary"
                    style={{
                      marginTop: "10px",
                    }}
                    onClick={handelTaskSubmit}
                  >
                    Save
                  </Button>
                </div>
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAudit}
        onClose={handleCloseAudit}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAudit}>
          <Box sx={style1}>
            <Box
              className="p-30 pt-24 pb-24"
              style={{
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                color: "white",
              }}
            >
              Audit List
            </Box>
            <div className="p-30 pt-24 pb-24">
              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full border-b justify-end"
                style={{ marginTop: "10px" }}
              >
                <TextField
                  variant="filled"
                  fullWidth
                  placeholder="Search"
                  style={{
                    marginBottom: "15px",
                    backgroundColor: "white",
                  }}
                  //   value={searchTerm}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{
                          marginTop: "0px",
                          paddingTop: "0px",
                        }}
                      >
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 320 }}
                />
              </div>
              <Box sx={{ overflow: "auto" }}>
                <TableContainer style={{ marginTop: "15px" }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns?.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              minWidth: column.minWidth,
                            }}
                          >
                            {column?.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentAudit
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.code}
                              sx={{ padding: "default" }}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                      borderBottom: "1px solid #dddddd",
                                    }}
                                  >
                                    {column.render
                                      ? column.render(row) // Render custom actions
                                      : column.format &&
                                          typeof value === "number"
                                        ? column.format(value)
                                        : value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  style={{ display: "flex", marginTop: "10px" }}
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={currentAudit.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            </div>
          </Box>
        </Fade>
      </Modal>

      <Initiation
        contentDetailsini={contentDetailsini}
        assetEvaluationId={assetEvaluationId}
      />
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
          <div>
            <div className="flex items-center w-full border-b justify-between p-30 pt-24 pb-24">
              <h2 className="text-2xl font-semibold">Implementation</h2>
            </div>
            <Box className="p-30 pt-24 pb-24" sx={{ width: "100%" }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps?.map((step, index) => (
                  <Step key={step?.label}>
                    <StepLabel
                      StepIconProps={{
                        sx: {
                          "&.MuiStepIcon-root": { color: "blue" },
                          "&.MuiStepIcon-active": { color: "blue" },
                          "&.MuiStepIcon-completed": { color: "blue" },
                        },
                      }}
                      sx={{
                        backgroundColor:
                          activeStep === index ? "#f0f0f0" : "#f9f9f9",
                        padding: "15px",
                        borderRadius: "10px",
                        marginTop: "0",
                      }}
                    >
                      {step?.label}
                    </StepLabel>
                    <StepContent>
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full justify-between pt-10 pb-10"
                      >
                        <div className="flex items-center">
                          <h2
                            _ngcontent-fyk-c288=""
                            class="text-xl font-semibold"
                            style={{ marginRight: "15px" }}
                          >
                            {ImpDetails.length} Tasks
                          </h2>
                          {!lastActCode.isComplete &&
                            lastActCode.status === "Pending" && (
                              <Button
                                className="whitespace-nowrap "
                                style={{
                                  border: "1px solid",
                                  backgroundColor: "#0000",
                                  color: "black",
                                  borderColor: "rgba(203,213,225)",
                                }}
                                variant="contained"
                                color="warning"
                                onClick={handleOpenImplemntationTask}
                              >
                                Add New Task
                              </Button>
                            )}
                          {/* <Button
                            className="whitespace-nowrap mt-5 mb-5 ms-5"
                            style={{
                              border: "1px solid",
                              backgroundColor: "#0000",
                              color: "black",
                              borderColor: "rgba(203,213,225)",
                            }}
                            variant="contained"
                            color="warning"
                            // onClick={handleOpen}
                          >
                            Audits Lists
                          </Button> */}
                        </div>

                        <TextField
                          variant="filled"
                          fullWidth
                          placeholder="Search"
                          style={{
                            backgroundColor: "white",
                          }}
                          //   value={searchTerm}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                style={{
                                  marginTop: "0px",
                                  paddingTop: "0px",
                                }}
                              >
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ width: 320 }}
                        />
                      </div>
                      {ImpDetails.map((detail) => {
                        const deadlineLabel = ChangeDeadlineLabel.get(
                          detail.deadline
                        );

                        if (deadlineLabel === step?.label) {
                          return (
                            <Accordion
                              key={detail.id}
                              expanded={expanded === detail.id}
                              sx={{
                                mt: 2,
                                minHeight: "70px",
                                transition: "height 0.3s",
                                "&.Mui-expanded": {
                                  minHeight: "100px",
                                },
                                "@media (max-width: 600px)": {
                                  mt: 4,
                                },
                              }}
                              onChange={handleAccordionChange(detail.id)}
                            >
                              <AccordionSummary
                                className="justify-content-Accordian_title"
                                style={{ minHeight: "60px" }}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index + 1}-content`}
                                id={`panel${index + 1}-header`}
                                onClick={(e) => handelComments(e, detail.id)}
                              >
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  // style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    Task #{detail.id}
                                  </div>
                                </div>

                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  // style={{ width: "17%" }}
                                >
                                  <div className="flex items-center" style={{}}>
                                    {detail.isCompleted &&
                                    detail.taskStatus === 3 ? (
                                      <span className="text-green">
                                        Approved
                                      </span>
                                    ) : detail.isCompleted &&
                                      detail.taskStatus !== 3 ? (
                                      <span className="text-red">
                                        Awaiting Approval
                                      </span>
                                    ) : (
                                      <span className="text-black">
                                        Not Completed
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  // style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    No Risks
                                  </div>
                                </div>
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  // style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    {detail.assignedStaff}
                                  </div>
                                </div>

                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  // style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    {formatDate(detail.dueDate)}
                                  </div>
                                </div>
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  // style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    <Button
                                      className="whitespace-nowrap"
                                      style={{
                                        border: "1px solid",
                                        backgroundColor: "#0000",
                                        color: "black",
                                        borderColor: "rgba(203,213,225)",
                                      }}
                                      variant="contained"
                                      color="warning"
                                      onClick={() =>
                                        handelOpenAudit(detail.audits, "")
                                      }
                                    >
                                      Audits
                                    </Button>
                                    {lastActCode?.canExecute && (
                                      <Button
                                        className="whitespace-nowrap ms-5"
                                        style={{
                                          border: "1px solid",
                                          backgroundColor: "#0000",
                                          color: "black",
                                          borderColor: "rgba(203,213,225)",
                                        }}
                                        variant="contained"
                                        color="warning"
                                        onClick={() =>
                                          handelOpenAuditComment(detail.id)
                                        }
                                      >
                                        <FuseSvgIcon
                                          className="text-48"
                                          size={24}
                                          color="action"
                                        >
                                          heroicons-outline:document-text
                                        </FuseSvgIcon>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Stepper orientation="vertical">
                                  <Step>
                                    <div style={{ alignItems: "flex-start" }}>
                                      <div className="flex flex-col items-start mt-5">
                                        <div
                                          className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                          style={{
                                            padding: "20px",
                                            backgroundColor: "#dbeafe",
                                          }}
                                        >
                                          <b>{detail?.assignedByStaff}</b>
                                          <p>
                                            What is the task :{" "}
                                            {detail?.actionWhat}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-start mt-5">
                                        <div
                                          className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                          style={{
                                            padding: "20px",
                                            backgroundColor: "#dbeafe",
                                          }}
                                        >
                                          <p>
                                            How is Task done :{" "}
                                            {detail?.actionHow}
                                          </p>
                                        </div>
                                      </div>
                                      {detail?.particularName &&
                                        detail?.particularSubName && (
                                          <div className="flex flex-col items-start mt-5">
                                            <div
                                              className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                              style={{
                                                padding: "20px",
                                                backgroundColor: "#dbeafe",
                                              }}
                                            >
                                              <p>
                                                Impact :{" "}
                                                {`${detail?.particularName} > ${detail?.particularSubName}`}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      <div className="flex flex-col items-start mt-5">
                                        <div
                                          className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                          style={{
                                            padding: "20px",
                                            backgroundColor: "#dbeafe",
                                          }}
                                        >
                                          <p>
                                            Due Date :{" "}
                                            {formatDate(detail.dueDate)}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-center my-3">
                                        <div className="flex-auto border-b"></div>
                                        <div
                                          className="flex-0 "
                                          style={{ fontSize: "xx-small" }}
                                        >
                                          <b>{detail?.assignedByStaff}</b> has
                                          assigned task to{" "}
                                          <b>{detail?.assignedStaff}</b> on{" "}
                                          {formatDate(detail.assignedAt)}
                                        </div>
                                        <div className="flex-auto border-b"></div>
                                      </div>

                                      {impComments.map((msg) => (
                                        <div
                                          key={msg.id}
                                          className="flex flex-row flex-wrap mb-2"
                                          style={{
                                            width: "auto",
                                            display: "block",
                                            clear: "both",
                                          }}
                                        >
                                          {msg?.remark && (
                                            <div
                                              className="flex flex-row items-start mt-5"
                                              style={{ position: "relative" }}
                                            >
                                              <div
                                                className="relative max-w-3/4 px-3 py-2 rounded-lg bg-grey-100 text-gray-700"
                                                style={{ padding: "10px" }}
                                              >
                                                <div
                                                  className="font-semibold"
                                                  style={{
                                                    fontSize: "smaller",
                                                  }}
                                                >
                                                  {" "}
                                                  {detail.assignedStaff}{" "}
                                                </div>
                                                <div
                                                  dangerouslySetInnerHTML={{
                                                    __html: msg?.remark,
                                                  }}
                                                ></div>
                                                <div className="my-0.5 text-xs font-medium text-secondary">
                                                  <small>
                                                    {msg.startedDate &&
                                                    !msg.workInProgressDate &&
                                                    !msg.completedDate &&
                                                    !msg.dueDate
                                                      ? `Started on ${formatDate(msg.startedDate)}`
                                                      : msg.workInProgressDate &&
                                                          !msg.completedDate &&
                                                          !msg.dueDate
                                                        ? `Work in Progress since ${formatDate(msg.workInProgressDate)}`
                                                        : msg.dueDate &&
                                                            !msg.completedDate
                                                          ? `Due on ${formatDate(msg.dueDate)}`
                                                          : msg.completedDate
                                                            ? `Completed on ${formatDate(msg.completedDate)}`
                                                            : "Unknown"}
                                                  </small>
                                                </div>
                                              </div>
                                              <button
                                                className="icon-button"
                                                onClick={() =>
                                                  handleOpen(msg.id)
                                                }
                                                style={{
                                                  top: "-15px",
                                                  right: "-20px",
                                                }}
                                              >
                                                <FuseSvgIcon size={20}>
                                                  heroicons-solid:document
                                                </FuseSvgIcon>
                                                <span className="count">
                                                  {listDocument.length}
                                                  {/* {documentCounts[msg.id]} */}
                                                </span>
                                              </button>
                                            </div>
                                          )}
                                          {msg.comments && (
                                            <div className="flex flex-col items-start mt-5">
                                              <div
                                                className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                                style={{
                                                  padding: "10px",
                                                  backgroundColor: "#dbeafe",
                                                }}
                                              >
                                                <div
                                                  className="font-semibold"
                                                  style={{
                                                    fontSize: "smaller",
                                                  }}
                                                >
                                                  {" "}
                                                  {detail.assignedByStaff}{" "}
                                                </div>
                                                <div
                                                  className="min-w-4 leading-5 "
                                                  dangerouslySetInnerHTML={{
                                                    __html: msg.comments,
                                                  }}
                                                  style={{
                                                    fontSize: "smaller",
                                                  }}
                                                ></div>
                                                <div
                                                  className="min-w-4 leading-5"
                                                  style={{
                                                    fontSize: "xx-small",
                                                  }}
                                                >
                                                  {" "}
                                                  {msg.approvalStatusDate && (
                                                    <>
                                                      {msg.approverId
                                                        ? "Approved on"
                                                        : "Rejected on"}{" "}
                                                      {new Date(
                                                        msg.approvalStatusDate
                                                      ).toLocaleString(
                                                        "en-US",
                                                        {
                                                          month: "short",
                                                          day: "2-digit",
                                                          hour: "numeric",
                                                          minute: "numeric",
                                                          hour12: true,
                                                        }
                                                      )}
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                      {detail.isCompleted &&
                                        detail.taskStatus !== 3 && (
                                          <>
                                            <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                                              <div
                                                _ngcontent-fyk-c288=""
                                                class="flex items-center w-full  border-b justify-between"
                                              ></div>
                                            </div>
                                            {currentActivityForm.canEdit && (
                                              <div
                                                className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                                style={{ width: "100%" }}
                                              >
                                                <Box
                                                  sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                  }}
                                                >
                                                  <FormControl
                                                    fullWidth
                                                    sx={{
                                                      m: 1,
                                                      maxWidth: "100%",
                                                    }}
                                                  >
                                                    <span className="font-semibold leading-none">
                                                      Comments*
                                                    </span>
                                                    <OutlinedInput
                                                      id="reasonForNewDocument"
                                                      name="reasonForNewDocument"
                                                      onChange={(e) =>
                                                        setComments(
                                                          e.target.value
                                                        )
                                                      }
                                                      label="Reason For Change*"
                                                      className="mt-5"
                                                    />
                                                  </FormControl>
                                                </Box>
                                              </div>
                                            )}
                                            {currentActivityForm.canEdit && (
                                              <div className="flex justify-start ">
                                                <Button
                                                  className="whitespace-nowrap ms-5 "
                                                  variant="contained"
                                                  color="secondary"
                                                  style={{
                                                    marginTop: "10px",
                                                    backgroundColor: "white",
                                                    color: "black",
                                                  }}
                                                  onClick={(e) =>
                                                    handelRejectImpl(e, detail)
                                                  }
                                                >
                                                  Reject
                                                </Button>
                                                <Button
                                                  className="whitespace-nowrap ms-5 "
                                                  variant="contained"
                                                  color="secondary"
                                                  style={{
                                                    marginTop: "10px",
                                                  }}
                                                  onClick={(e) =>
                                                    handelApproveImpl(e, detail)
                                                  }
                                                >
                                                  Approve
                                                </Button>
                                              </div>
                                            )}
                                          </>
                                        )}
                                    </div>
                                  </Step>
                                </Stepper>
                              </AccordionDetails>
                            </Accordion>
                          );
                        }
                        return null;
                      })}
                      <div
                        className="flex mt-7"
                        style={{ justifyContent: "end" }}
                      >
                        <Box>
                          <div>
                            <Button
                              disabled={index === 0}
                              onClick={handleBack}
                              sx={{
                                mr: 1,
                                backgroundColor:
                                  index !== 0 ? "black" : "default",
                                color: index !== 0 ? "white" : "default",
                                "&:hover": {
                                  backgroundColor:
                                    index !== 0 ? "black" : "default",
                                },
                              }}
                              style={{
                                paddingLeft: "35px",
                                paddingRight: "35px",
                              }}
                            >
                              Back
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleNext}
                              sx={{ mr: 1 }}
                              style={{
                                color: "white",
                                backgroundColor: "blue",
                                paddingLeft: "35px",
                                paddingRight: "35px",
                              }}
                            >
                              {index === steps.length - 1 ? "Finish" : "Next"}
                            </Button>
                          </div>
                        </Box>
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {activeStep === steps.length && (
                <Paper square elevation={0} className="pt-24 pb-24">
                  <Button
                    onClick={handleReset}
                    sx={{ mt: 1, mr: 1 }}
                    style={{
                      border: "1px solid",
                      backgroundColor: "#0000",
                      color: "black",
                      borderColor: "rgba(203,213,225)",
                    }}
                  >
                    Reset
                  </Button>
                </Paper>
              )}
            </Box>
          </div>

          {/* <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          ></div> */}
          <div className="p-30 pt-24 pb-24">
            <Button
              className="whitespace-nowrap "
              style={{
                border: "1px solid",
                backgroundColor: "#0000",
                color: "black",
                borderColor: "rgba(203,213,225)",
              }}
              variant="contained"
              color="warning"
              onClick={() => handelOpenAudit("", "fullList")}
            >
              <FuseSvgIcon className="text-48" size={24} color="action">
                heroicons-outline:document-text
              </FuseSvgIcon>
              Audit Lists
            </Button>
          </div>
          {lastActCode?.canExecute && (
            <div className="flex justify-end p-30">
              {AppActions.map((btn) => (
                <>
                  <Button
                    key={btn.uid}
                    className="whitespace-nowrap ms-5"
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: "10px" }}
                    onClick={(e) => SubmitApprovelCreate(e, btn.uid)}
                  >
                    {btn.name}
                  </Button>
                </>
              ))}
            </div>
          )}
        </Paper>
      </SwipeableViews>
    </div>
  );
}

export default ImplementationApproval;
