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
import { v4 as uuidv4 } from "uuid";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import FuseLoading from "@fuse/core/FuseLoading";
import { useLocation } from "react-router-dom";
import { display } from "@mui/system";

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
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };

  const BoldLabel = styled("label")({
    fontWeight: "bold",
    color: "black",
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
    overflow: "auto",
    // Smooth transition for opening/closing
  });

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
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);

  const [reqDate, setReqDate] = useState(null);
  const [commentss, setCommentss] = useState("");
  const [openDocModal, setOpenDocModal] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [viewDoc, setviewDoc] = useState(false);
  const [documentCounts, setDocumentCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState({
    name: "",
    description: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: "",
  });
  console.log(selectedFile);
  // Extract the task.id from the URL

  const taskType = router["*"];

  const navigate = useNavigate();

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
  const getRecords = () => {
    apiAuth.get(`/Task/List`).then((resp) => {
      setIsLoading(false);
      setTaskList(resp.data.data);
    });
  };

  useEffect(() => {
    getRecords();
  }, []);

  // Function to open sidebar
  const openSidebar = (e, task) => {
    e.preventDefault();

    window.history.pushState({}, "", `/task/${task.id}`);
    setTask(task);
    setSidebarOpen(true);
    if (task.sourceTaskId != null) {
      apiAuth
        .get(`ChangeImpact/ListTaskCommentst?id=${task.order}`)
        .then((response) => {
          const comments = response.data.data;
          setTaskClick(comments);
          comments.forEach((comment) => {
            const id = comment.id;
            apiAuth
              .get(`/DocumentManager/DocumentCount?id=${id}&documentType=Task`)
              .then((documentResp) => {
                const count = documentResp.data.data; // Assuming this is the count value
                setDocumentCounts((prevCounts) => ({
                  ...prevCounts,
                  [id]: count,
                }));
              });
          });
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
      year: "numeric",
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

  const handleSubmits = (task) => {
    let formattedReqDate = reqDate;
    let formattedOldDate = task.dueDate;

    if (reqDate instanceof Date) {
      formattedReqDate = reqDate.toLocaleDateString("en-US");
    }
    if (task.dueDate instanceof Date) {
      formattedOldDate = reqDate.toLocaleDateString("en-US");
    }

    apiAuth
      .put(
        `/Task/TaskDateUpdate/?requestToken=${task?.changeRequestToken}&&taskId=${task?.sourceTaskId}`,
        {
          OldDate: formattedOldDate,
          RequestComments: commentss,
          RequestDate: formattedReqDate,
        }
      )
      .then((response) => {});
  };

  const handleSubmit = () => {
    setSidebarOpen(false);

    setIsLoading(true);

    const path = window.location.pathname;
    const taskId = path.startsWith("/task/") ? path.split("/task/")[1] : null;
    const updatedTask = {
      ...task,
      notes: comments,
      documentId: selectedFile.documentId,
      taskStatus: 2,
      startedDate: "0001-01-01T00:00:00",
    };

    apiAuth
      .put(`/Task/Update?id=${taskId}`, updatedTask)
      .then((response) => {
        setOpen(false);
        toast.success("Task Comment Added");

        setIsLoading(false);
        getRecords();

        setComments("");
      })
      .catch((error) => {
        setIsLoading(false);

        setOpen(false);
        toast.error("Some Error Occured");
      });
  };

  const handleOpenDocModal = (e, task) => {
    setFileDetails(false);
    setSelectedFile({
      name: "",
      description: "",
      type: "",
      document: "binary",
      documentType: "ChangeRequest",
    });
    e.preventDefault();
    setOpenDocModal(true);
    const newGuid = uuidv4();
    setSelectedFile((prevState) => ({
      ...prevState,
      documentId: newGuid,
      changeRequestToken: task?.changeRequestToken,
    }));
  };

  const handleOpenDocModalClose = () => {
    setOpenDocModal(false);
    setOpenDrawer(false);
  };
  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setFileName(file.name);
    }
    const fileType = file.type.startsWith("image/")
      ? file.type?.split("/")[1]
      : file.type;

    setSelectedFile({
      name: file.name,
      description: "",
      type: fileType,
      document: file,
      documentType: "Task",
      documentId: selectedFile.documentId,
      changeRequestToken: selectedFile.changeRequestToken,
    });
  };

  const handleSubmitDocument = () => {
    console.log(selectedFile.documentId, "seleee");
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("descritpion", selectedFile.description);
    formData.append("type", selectedFile.type);
    formData.append("document", selectedFile.document);
    formData.append("documentType", selectedFile.documentType);
    formData.append("documentId", selectedFile.documentId);
    formData.append("changeRequestToken", selectedFile.changeRequestToken);
    apiAuth
      .post("DocumentManager/Create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        apiAuth
          .get(
            `/DocumentManager/DocList/${selectedFile.documentId}/Task?changeRequestToken=${selectedFile.changeRequestToken}`
          )
          .then((response) => {
            setOpenDrawer(false);
            setListDocument(response?.data?.data);
          });
      })
      .catch((error) => {
        console.error("There was an error uploading the document!", error);
      });
  };

  const handelViewDocument = (e, id, task) => {
    e.preventDefault();
    setviewDoc(true);
    setOpenDocModal(true);
    apiAuth
      .get(
        `DocumentManager/DocList/${id}/Task?changeRequestToken=${task.changeRequestToken}`
      )
      .then((response) => {
        setOpenDrawer(false);
        setListDocument(response?.data?.data);
      });
  };
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [documenDowToken, setDocumenDowToken] = useState("");

  const handleDownload = () => {
    apiAuth
      .get(`/DocumentManager/download/${documenDowToken}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
  };

  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    console.log(doc, "doccc");
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };

  const handelViewMoc = (e, list) => {
    e.preventDefault();
    if (list.requestTypeName == "Asset") {
      navigate(`/moc/assetEvaluation/${list.token}`);
    } else if (list.requestTypeName === "Document") {
      navigate(`/moc/evaluation/${list.token}`);
    } else {
      navigate(`/moc/orgEvaluation/${list.token}`);
    }
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <>
      <ToastContainer className="toast-container " />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openDocModal}
        onClose={handleOpenDocModalClose}
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
        <Fade in={openDocModal}>
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
                  {/* <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                              >
                                0 Files
                              </Typography> */}
                </Typography>
                {!viewDoc && (
                  <Box>
                    <Button
                      className=""
                      variant="contained"
                      color="secondary"
                      onClick={toggleDrawer(true)}
                    >
                      <FuseSvgIcon size={20}>
                        heroicons-outline:plus
                      </FuseSvgIcon>
                      <span className="mx-4 sm:mx-8">Upload File</span>
                    </Button>
                  </Box>
                )}
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
                        <img src="/assets/images/etc/icon_N.png" style={{}} />
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
                    onClick={handleSubmitDocument}
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
                        onClick={handelDetailDoc}
                        style={{ textAlign: "-webkit-center" }}
                      >
                        <img src="/assets/images/etc/icon_N.png" />
                      </div>
                      {selectedDocument.name}
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
                      value={selectedDocument.descritpion}
                    />
                  </Box>
                </div>

                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{
                    marginTop: "15px",
                    justifyContent: "end",
                    backgroundColor: " rgba(248,250,252)",
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
                    Delete
                  </Button>
                </div>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
      <div className="p-30 pt-24 pb-24">
        <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            className="text-2xl"
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
              className="p-30 pt-24 pb-0  task_box"
              
            >
              <div className="flex flex-wrap flex-col p-24 rounded-16 shadow overflow-hidden">
                <div className="flex flex-wrap">
                  <div className="flex flex-wrap flex-col flex-auto">
                    <div className="flex flex-wrap items-center justify-between">
                      <div
                        className="py-0.5 px-3 mb-3 rounded-full text-sm font-semibold text-blue-800 bg-blue-100 dark:text-blue-50 dark:bg-blue-500"
                        style={{ padding: "5px" }}
                      >
                        {`${list.requestTypeName} / ${list.requestNo} / ${list.statusName}`}
                      </div>
                    </div>
                    <div className="flex flex-wrap leading-5 text-md text-secondary space-y-2 mt-5">
                      <div className="mr-30">
                        Initiated by <b>{list.initiatorName}</b> on{" "}
                        <b>{formatDates(list.requestDate)}</b>
                        {console.log(list.requestDate, "")}
                      </div>
                      <div className="mr-30">
                        Project Name: <b>{list.projectName}</b>
                      </div>
                      <div className="mr-30">
                        Change Leader: <b>{list.changeLeaderName}</b>
                      </div>
                    </div>
                  </div>
                  <div className="pl-4 btn_margin">
                    <div>
                      <a
                        className="flex items-center min-w-0 h-full w-full  text-lg p-4 border rounded cursor-pointer text-blue-500"
                        href="#"
                        style={{ textDecoration: "none", padding: "15px" }}
                        onClick={(e) => handelViewMoc(e, list)}                    
                      >
                        View MOC details
                      </a>
                    </div>
                  </div>
                </div>
              
                <div className="cdk-drop-list divide-y border rounded mt-3">
                  <div className="w-full" style={{ padding: "2rem" }}>
                    <span className="font-semibold text-gray-500">
                      {filteredTasks.length} Tasks
                    </span>
                  </div>
                  {filteredTasks.map((task, index) => (
                    <div
                      key={index}
                      className="group w-full select-none border-t h-20 task_table_content text-lg font-semibold dark:bg-transparent hover:bg-gray-100 dark:hover:bg-hover"
                      style={{ padding: "2.5rem" }}
                      onClick={(e) => openSidebar(e, task)}
                    >
                      <div className="relative flex d-sm-block  items-center h-full w-full">
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
                      </div>
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
                        border: "1px solid black",
                      }}
                    >
                      <TableRow>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Actual Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Request Comments
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Request Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ width: "20%", border: "1px solid black" }}
                        >
                          Approved Comments
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Approved Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task?.taskDateUpdates?.map((update) => (
                        <TableRow key={update.id}>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {formatDates(update.oldDate)}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.requestComments}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {formatDates(update.requestDate)}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.approvedComments || "N/A"}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.approvedDate
                              ? formatDates(update.approvedDate)
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.taskdateupdateStatus}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
              {task?.taskDateUpdates?.length != 0 && (
                <Grid container spacing={2} className=" flex mt-5">
                  <Grid item xs={12}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Request Date
                    </Typography>
                    <Typography variant="body1" className="mt-2 cursor-pointer">
                      {formatDates(task?.taskDateUpdates?.[0].requestDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Request Comments
                    </Typography>
                    <Typography variant="body1" className="mt-2 cursor-pointer">
                      {task.taskDateUpdates?.[0].requestComments}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {task?.taskDateUpdates?.length == 0 && (
                <Grid container spacing={2} className="mt-5">
                  <Grid item xs={12}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Old Due Date
                    </Typography>
                    <Typography variant="body1" className="mt-2 cursor-pointer">
                      {formatDates(task.dueDate)}
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
                      value={commentss}
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
                      onClick={() => handleSubmits(task)}
                      sx={{ float: "right" }}
                    >
                      Submit for Approval
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
      <div
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        style={{ overflow: "auto" }}
      >
        {/* Add sidebar content here */}
        {/* <button onClick={closeSidebar}>Close Sidebar</button> */}
        <div className="flex flex-auto">
          <form
            className="flex flex-col flex-auto p-30 overflow-y-auto">
            <div
              className="flex items-center justify-between"
              style={{ padding: "5px" }}
            >
              <span className="pr-4 pl-3.5">
                <div className="flex items-center justify-center">
                  <span className="font-bold text-xl">
                    Task # {task.sourceTaskId}
                  </span>
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
                <button
                  className="focus:outline-none close_button"
                  onClick={closeSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fit=""
                    height="24px"
                    width="24px"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
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
                                  <button
                                    className="icon-button"
                                    onClick={(e) =>
                                      handelViewDocument(e, msg.id, task)
                                    }
                                    style={{
                                      top: "-94px",
                                      right: "-2px",
                                    }}
                                  >
                                    <FuseSvgIcon size={20}>
                                      heroicons-solid:document
                                    </FuseSvgIcon>
                                    <span className="count">
                                      {documentCounts[msg.id]}
                                    </span>
                                  </button>
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
                                      {task?.changeLeaderName}{" "}
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
                  <div style={{ position: "relative", margin: "5px" }}>
                    <textarea
                      rows="1"
                      placeholder="Write your comments *"
                      className="w-full border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
                      spellCheck="false"
                      style={{
                        paddingTop: "1.2rem",
                        paddingBottom: "7.2rem",
                        paddingLeft: "1.3rem",
                        paddingRight: "3rem", // Adjusted to make space for the button
                        height: "calc(1.2rem + 7.2rem)", // Adjust height to include padding
                        overflow: "hidden", // Prevent scrollbar
                      }}
                      onChange={(e) => setComments(e.target.value)}
                      value={comments}
                    ></textarea>
                    {task.taskType == 2 && (
                      <button
                        style={{
                          position: "absolute",
                          right: "10px",
                          bottom: "32px",
                          padding: "5px 10px",
                          color: "black",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => handleOpenDocModal(e, task)}
                      >
                        <FuseSvgIcon size={20}>
                          heroicons-outline:document
                        </FuseSvgIcon>
                      </button>
                    )}
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
                      className="focus:outline-none px-4 py-2 text-white bg-blue-600 rounded-md flex items-center justify-center button_rounded"
                      style={{ padding: "10px", marginRight: "10px" }}
                      onClick={handleOpen}
                    >
                      <span className="ml-2 font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          fit=""
                          height="24px"
                          width="24px"
                          preserveAspectRatio="xMidYMid meet"
                          style={{ display: "inline-block" }}
                          focusable="false"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>{" "}
                        Submit
                      </span>
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
                        {task?.changeLeaderName} has approved your task
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
                        {task?.changeLeaderName}
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
