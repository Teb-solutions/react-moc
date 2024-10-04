import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
// import { useGetAcademyCategoriesQuery } from "../moc/evaluation/AcademyApi";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Container,
  FormControlLabel,
  Grid,
  Badge,
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
import { withStyles } from "@mui/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FuseLoading from "@fuse/core/FuseLoading";
import { useLocation } from "react-router-dom";
import { display, minHeight } from "@mui/system";
import { set } from "lodash";
import dayjs from "dayjs";
import DocumentModal from "../moc/common_modal/documentModal";
import { format, parseISO } from "date-fns";
import DeleteModal from "../moc/common_modal/delete_modal/DeleteModal";

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
    width: "1200px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    // p: 4,
  };
  const StyledBadge = withStyles((theme) => ({
    badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "-61px",
      right: "19px",
    },
  }))(Badge);
  const BoldLabel = styled("label")({
    fontWeight: "bold",
    color: "black",
  });

  const style2 = {
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

  const drawerStyle = (open) => ({
    width: 350,
    bgcolor: "background.paper",
    borderTopRightRadius: "16px",
    borderBottomRightRadius: "16px",
    boxShadow: 24,
    p: 2,
    position: "absolute",
    top: 0,
    bottom: 1,
    right: open ? 0 : -250, // Move drawer out of view when closed
    height: "auto",
    zIndex: 10,
    transition: "right 0.3s ease",
    overflow: "auto",
    // Smooth transition for opening/closing
  });
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  // const { data: categories } = useGetAcademyCategoriesQuery();
  const [taskList, setTaskList] = useState([]);
  const [taskClick, setTaskClick] = useState([]);
  const [deletes, setDeletes] = useState(false);
  const [task, setTask] = useState({});
  const [priority, setPriority] = useState(task.priority);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State variable to control sidebar open/close
  const [selectedCategory, setSelectedCategory] = useState("Pending");
  const [selectedCategoryEvalImp, setSelectedCategoryEvalImp] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [comments, setComments] = useState("");
  const [commentss, setCommentss] = useState("");
  const router = useParams();
  const [open, setOpen] = useState(false);
  const [dateExtendopen, setDateExtendOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);

  const [reqDate, setReqDate] = useState(null);

  const [openDocModal, setOpenDocModal] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [viewDoc, setviewDoc] = useState(false);
  const [documentCounts, setDocumentCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [msgId, setmsgId] = useState("");
  const [taskToken, setTaskToken] = useState("");
  const [taskCommentValidation, setTaskCommentValidation] = useState(null);
  const [dueDateCommentValidation, setDueDateCommentValidation] =
    useState(null);
  const [dueDateValidation, setDueDateValidation] = useState(null);
  const [selectedFile, setSelectedFile] = useState({
    name: "",
    descritpion: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: "",
  });
  const [newDocument, setNewDocument] = useState(false);
  console.log(selectedFile);
  // Extract the task.id from the URL

  const taskType = router["*"];

  const navigate = useNavigate();

  useEffect(() => {
    setPriority(task.priority);
  }, []);

  const handlePriorityChange = (event) => {
    const newPriority = parseInt(event.target.value, 10);
    setPriority(newPriority);
    setTask((prevTask) => ({
      ...prevTask,
      priority: newPriority,
    }));
  };

  const [pendingfilterdTask, setPendingFilterdTask] = useState({});

  const handledateExtendopen = (e, task) => {
    e.preventDefault();
    getRecords();
    setTask(task);
    setDateExtendOpen(true);
    const activeTaskDateUpdate = task.taskDateUpdates.filter(
      (update) => update.taskdateupdateStatus == 1
    );
    console.log(activeTaskDateUpdate, "activeTaskDateUpdate");

    setPendingFilterdTask(activeTaskDateUpdate);
  };
  const handlehandledateExtendClose = () => setDateExtendOpen(false);

  const handleOpen = (e) => {
    e.preventDefault();
    if (!comments || comments === "") {
      // toast.error("Please enter a comment");
      setTaskCommentValidation("Comments are required");
      return;
    }
    if (task.taskType == 2 && priority == 3) {
      setOpen(true);
    } else {
      handleSubmit();
    }
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
    console.clear();
    console.log(task);
    setTaskCommentValidation(null);
    setComments("");
    setCommentss("");
    setReqDate(null);
    setDueDateValidation(null);
    setDueDateCommentValidation(null);
    setSidebarOpen(true);
    setPriority(task.taskStatus);
    if (task.sourceTaskId != null) {
      apiAuth
        .get(`ChangeImpact/ListTaskCommentst?id=${task.order}`)
        .then((response) => {
          setListDocument([]);
          const comments = response.data.data;
          setTaskClick(comments);
          comments.forEach((comment) => {
            const id = comment.id;

            // Fetch document count for each comment
            apiAuth
              .get(`/DocumentManager/DocumentCount?id=${id}&documentType=Task`)
              .then((documentResp) => {
                const count = documentResp.data.data;
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
    if (!commentss || !reqDate) {
      if (!reqDate) setDueDateValidation("Due Date is required");
      if (!comments)
        setDueDateCommentValidation("Please provide a reason for extension");

      return;
    }

    let formattedReqDate = dayjs(reqDate).format("YYYY-MM-DD");
    let formattedOldDate = task.dueDate;

    console.log({
      OldDate: formattedOldDate,
      RequestComments: commentss,
      RequestDate: formattedReqDate,
    });

    apiAuth
      .put(
        `/Task/TaskDateUpdate/?requestToken=${task?.changeRequestToken}&taskId=${task?.sourceTaskId}`,
        {
          OldDate: formattedOldDate,
          RequestComments: commentss,
          RequestDate: formattedReqDate,
        }
      )
      .then((response) => {
        if (response.data.statusCode == 500) {
          getRecords();
          setDateExtendOpen(false);
          toast.error(response.data.message);
        } else {
          setDateExtendOpen(false);
          toast.success(response.data.message);
          setTimeout(() => location.reload(), 1000);

          setCommentss("");
          setReqDate(null);
          setTask({
            ...task,
            activeDateUpdateRequest: 1,
          });
        }
      })
      .catch((err) => {
        setDateExtendOpen(false);
        toast.error("Some error occured");
      });
  };

  const handleSubmit = () => {
    // if (!comments || comments === "") {
    //   // toast.error("Please enter a comment");
    //   setTaskCommentValidation("Comments are required");
    //   return;
    // }

    setSidebarOpen(false);

    setIsLoading(true);

    const path = window.location.pathname;
    const taskId = path.startsWith("/task/") ? path.split("/task/")[1] : null;
    const updatedTask = {
      ...task,
      notes: comments,
      documentId: selectedFile.documentId,
      taskStatus: priority,
      startedDate: "0001-01-01T00:00:00",
    };

    apiAuth
      .put(`/Task/Update?id=${taskId}`, updatedTask)
      .then((response) => {
        setOpen(false);
        toast?.success("Task Comment Added");
        setListDocument([]);

        setIsLoading(false);
        getRecords();

        setComments("");
      })
      .catch((error) => {
        setIsLoading(false);

        setOpen(false);
        toast?.error("Some Error Occured");
      });
  };

  const handleOpenDocModal = (e, task) => {
    setviewDoc(false);
    setFileDetails(false);
    // setListDocument([]);
    setNewDocument(true);
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
    setFileDetails(false);
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
    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");
    setSelectedFile({
      ...selectedFile,
      name: fileNameWithoutExtension,
      description: "",
      type: fileType,
      document: file,
      documentType: "Task",
      documentId: selectedFile.documentId,
      changeRequestToken: selectedFile.changeRequestToken,
    });
  };

  const handleSubmitDocument = () => {
    // Validation: If file-related fields are empty

    if (
      !selectedFile.name.trim() ||
      // !selectedFile.type.trim() ||
      !selectedFile.document ||
      !selectedFile.documentType.trim() ||
      !selectedFile.documentId.trim()
    ) {
      toast.error("Please select your file.");
      handleOpenDocModalClose();
      setSelectedFile({
        ...selectedFile,
        name: "",
        descritpion: "",
      });
      return;
    }

    // Validation: If description field is empty
    if (!selectedFile?.descritpion?.trim()) {
      toast.error("Please add a description.");
      handleOpenDocModalClose();
      setSelectedFile({
        ...selectedFile,
        name: "",
        descritpion: "",
      });
      return;
    }
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("descritpion", selectedFile.descritpion);
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
        if (response.data.statusCode === 200) {
          apiAuth
            .get(
              `/DocumentManager/DocList/${selectedFile.documentId}/Task?changeRequestToken=${selectedFile.changeRequestToken}`
            )
            .then((response) => {
              setOpenDrawer(false);
              setListDocument(response?.data?.data);
              setSelectedFile({
                ...selectedFile,
                name: "",
                description: "",
              });
            });
        } else {
          toast.error(response.data.message);
          setOpenDocModal(false);
          setOpenDrawer(false);
          setSelectedFile({
            ...selectedFile,
            name: "",
            description: "",
          });
        }
      })
      .catch((error) => {
        if (error.errorsData) {
          if (error.errorsData.Name && error.errorsData.Name.length) {
            toast.error(error.errorsData.Name[0]);
          } else {
            toast.error("There was an error uploading the document!");
          }
        } else {
          toast.error("There was an error uploading the document!");
        }
        setOpenDocModal(false);
        setOpenDrawer(false);
        setSelectedFile({
          ...selectedFile,
          name: "",
          description: "",
        });
      });
  };

  const handelViewDocument = (e, id, task) => {
    e.preventDefault();
    setNewDocument(false);
    setviewDoc(true);
    setOpenDocModal(true);
    setmsgId(id);
    setTaskToken(task.changeRequestToken);
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

  const handleCloseDelete = () => {
    setDeletes(false);
  };
  const handleDelete = (e, id, token) => {
    e.preventDefault();
    setDocId(id);
    setDocToken(token);
    setDeletes(true);
  };

  const handleSubmitDelete = () => {
    apiAuth.delete(`DocumentManager/Delete/${docToken}`).then((response) => {
      apiAuth
        .get(
          `/DocumentManager/DocList/${msgId ? msgId : selectedFile.documentId}/Task?changeRequestToken=${taskToken ? taskToken : selectedFile?.changeRequestToken}}`
        )
        .then((response) => {
          setOpenDrawer(false);
          setListDocument(response?.data?.data);
          setDeletes(false);
          setFileDetails(false);
          setSelectedDocument("");
          setSelectedFile({
            ...selectedFile,
            name: "",
            description: "",
          });
        });
    });
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <>
      <ToastContainer
        className="toast-container"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <DeleteModal
        openDelete={deletes}
        handleCloseDelete={handleCloseDelete}
        title=""
      >
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
            onClick={handleCloseDelete}
          >
            Cancel
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            style={{ padding: "23px", backgroundColor: "red" }}
            type="submit"
            onClick={handleSubmitDelete}
          >
            Confirm
          </Button>
        </div>
      </DeleteModal>

      <DocumentModal
        step={1}
        open={openDocModal}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        fileDetails={fileDetails}
        selectedDocument={selectedDocument}
        setFileDetails={setFileDetails}
        selectedFile={selectedFile}
        handelFileChange={handelFileChange}
        handleModalClose={handleOpenDocModalClose}
        handelFileDiscriptionChange={handelFileDiscriptionChange}

        listDocument={listDocument}
        toggleDrawer={toggleDrawer}
        handelDetailDoc={handelDetailDoc}
        handleSubmitDocument={handleSubmitDocument}
        formatDate={formatDate}
        canExecute={!task.completed}
        handleDelete={handleDelete}
        documenDowToken={documenDowToken}
      />

      <div className="p-30 pt-24 pb-24">
        <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel id="category-select-label" className="text-2xl">
            <b>Tasks</b>
          </InputLabel>

          <FormControl
            className="flex w-full sm:w-136"
            variant="outlined"
            style={{ backgroundColor: "white" }}
          >
            <InputLabel id="category-select-label">Status</InputLabel>
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
              <div className="flex flex-wrap flex-col p-24 rounded-16 white_bg shadow overflow-hidden">
                <div className="flex flex-wrap lg:flex-nowrap">
                  <div className="flex flex-wrap flex-col flex-auto">
                    <div className="flex flex-wrap items-center justify-between">
                      <div
                        className="py-0.5 px-3 mb-3 rounded-full text-sm font-semibold text-blue-800 bg-blue-100 dark:text-blue-50 dark:bg-blue-500"
                        style={{ padding: "5px" }}
                      >
                        {`${list.requestTypeName} / ${list.requestNo} / ${list.statusName}`}
                      </div>
                    </div>
                    <div className="flex flex-wrap leading-5 text-md text-secondary space-y-2 my-10 lg:my-0 lg:mt-5">
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
                  <div className="lg:pl-4 mt-0 btn_margin">
                    <div>
                      <a
                        className="flex items-center min-w-0 h-full w-full  text-lg p-4 border rounded cursor-pointer text-blue-500"
                        href="#"
                        style={{
                          textDecoration: "none",
                          padding: "15px",
                          whiteSpace: "nowrap",
                        }}
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
                          #{" "}
                          {task.sourceTaskId
                            ? task.sourceTaskId
                            : task.requestId}
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
                              className="flex items-center text-green-400 mr-5 font-semibold"
                              onClick={(e) => openSidebar(e, task)}
                            >
                              Approved
                            </div>
                          )}
                        {task.taskType === 2 &&
                          task.completed &&
                          task.taskApprovalStatus !== 3 && (
                            <div
                              className="flex items-center text-blue-400 mr-5 font-semibold"
                              onClick={(e) => openSidebar(e, task)}
                            >
                              Awaiting Approval
                            </div>
                          )}
                        {task.taskType === 1 && task.completed && (
                          <div
                            className="flex items-center text-green-400 mr-5 font-semibold"
                            onClick={(e) => openSidebar(e, task)}
                          >
                            Completed
                          </div>
                        )}
                        {!task.completed && (
                          <div
                            className="flex items-center text-red-600 mr-5 font-semibold"
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
                display: "flex",
                justifyContent: "end",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
              }}
              className="cursor-pointer"
              onClick={handlehandledateExtendClose}
            >
              <h4 className="pt-12">Date Extend</h4>{" "}
              <FuseSvgIcon size={25}>heroicons-outline:x</FuseSvgIcon>
            </Box>

            <Box sx={{ overflow: "auto", padding: "5px 30px 30px 30px" }}>
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
                            {update.taskdateupdateStatus == 2
                              ? "Approved"
                              : update.taskdateupdateStatus == 3
                                ? "Rejected"
                                : ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
              {pendingfilterdTask.length != 0 && (
                <Grid container spacing={2} className=" flex mt-5">
                  <Grid item xs={12}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Request Date
                    </Typography>
                    <Typography
                      variant="body1"
                      className="mt-2 cursor-pointer text-grey"
                    >
                      {formatDates(pendingfilterdTask?.[0]?.requestDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" className="font-semibold pt-4 ">
                      Request Comments
                    </Typography>
                    <Typography
                      variant="body1"
                      className="mt-2 cursor-pointer text-grey"
                    >
                      {pendingfilterdTask?.[0]?.requestComments}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {pendingfilterdTask?.length == 0 && (
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
                        minDate={new Date()} // Prevents selection of past dates
                        onChange={(newValue) => {
                          setReqDate(newValue);
                          setDueDateValidation(null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            className={`${dueDateValidation ? "border border-red-500" : ""}`}
                            fullWidth
                            required
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <div>
                      <span className="text-xs text-red-500 text-grey">
                        {dueDateValidation}
                      </span>
                    </div>
                  </Grid>
                  <Grid item xs={12} className="mt-5">
                    <TextField
                      label="Remark"
                      multiline
                      rows={1}
                      fullWidth
                      required
                      value={commentss}
                      className={`${dueDateCommentValidation ? "error" : ""}`}
                      onChange={(e) => {
                        setCommentss(e.target.value);
                        setDueDateCommentValidation(
                          e.target.value.length > 0
                            ? ""
                            : "Please enter a reason for extension"
                        );
                      }}
                    />
                    <div>
                      <span className="text-xs text-red-500 text-grey">
                        {dueDateCommentValidation}
                      </span>
                    </div>
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
          <form className="flex flex-col flex-auto p-30 overflow-y-auto">
            <div
              className="flex items-center justify-between"
              style={{ padding: "5px" }}
            >
              <span className="pr-4 pl-3.5">
                <div className="flex items-center justify-center">
                  <span className="font-bold text-xl">
                    Task #{" "}
                    {task.sourceTaskId ? task.sourceTaskId : task.requestId}
                  </span>
                </div>
              </span>

              <div className="flex items-center">
                {task.taskType === 2 && task.taskStatus !== 3 && (
                  <button
                    className="focus:outline-none px-4 py-2 text-dark bg-white-600 border rounded-3xl flex items-center justify-center"
                    style={{ padding: "10px", marginRight: "10px" }}
                    onClick={(e) => handledateExtendopen(e, task)}
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

            <hr className="mb-24 mt-24" />

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
                                    hour: "numeric",
                                    minute: "numeric",
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
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
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
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
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
                                                ? `Completed on ${new Date(
                                                  msg.completedDate
                                                ).toLocaleString("en-US", {
                                                  month: "short",
                                                  day: "2-digit",
                                                  hour: "numeric",
                                                  minute: "numeric",
                                                  hour12: true,
                                                })}`
                                                : "Unknown"}
                                      </small>
                                    </div>
                                  </div>
                                  {documentCounts[msg.id] ? (
                                    documentCounts[msg.id] != 0 && (
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
                                        {documentCounts[msg.id] != 0 && (
                                          <span
                                            className="count"
                                            style={{
                                              backgroundColor: "black",
                                            }}
                                          >
                                            {documentCounts[msg.id]}
                                          </span>
                                        )}
                                      </button>
                                    )
                                  ) : (
                                    <></>
                                  )}
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
                      className={`w-full border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 ${taskCommentValidation?.length > 0 ? "border-red-500" : ""}`}
                      spellCheck="false"
                      style={{
                        paddingTop: "1.2rem",
                        paddingBottom: "7.2rem",
                        paddingLeft: "1.3rem",
                        paddingRight: "3rem", // Adjusted to make space for the button
                        height: "calc(1.2rem + 7.2rem)", // Adjust height to include padding
                        overflow: "hidden", // Prevent scrollbar
                      }}
                      onChange={(e) => {
                        setComments(e.target.value);
                        setTaskCommentValidation(
                          e.target.value.length > 0
                            ? ""
                            : "Comments are required"
                        );
                      }}
                      value={comments}
                    ></textarea>

                    {task.taskType == 2 && (
                      <StyledBadge
                        badgeContent={newDocument ? listDocument.length : null}
                      >
                        <button
                          style={{
                            position: "absolute",
                            right: "10px",
                            bottom: "32px",
                            padding: "5px 10px",
                            color: "red",
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
                      </StyledBadge>
                    )}
                  </div>
                  <div className="text-red-500 text-xs mt-0 mr-4 text-right">
                    {taskCommentValidation}
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
                        checked={priority == 3}
                        value={3}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="Work in progress"
                        className="mt-2 pr-4"
                        checked={priority == 2}
                        value={2}
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="Started"
                        className="mt-2 pr-4"
                        checked={priority == 1}
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
