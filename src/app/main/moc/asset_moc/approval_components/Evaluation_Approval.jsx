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
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Badge,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import React, { useEffect, useCallback, useRef } from "react";
import SwipeableViews from "react-swipeable-views";
import SearchIcon from "@mui/icons-material/Search";
import Chart from "react-apexcharts";
import { useState } from "react";
import { apiAuth } from "src/utils/http";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FuseLoading from "@fuse/core/FuseLoading";
import Initiation from "../../common_components/Initiation";
import { animateVisualElement } from "framer-motion";
import { map } from "lodash";
import { display, maxHeight } from "@mui/system";
import RiskAnalysisTableView from "../../common_components/RiskAnalysisTableView";
import RiskAnalysis from "../../common_components/RiskAnalysis";
import DocumentModal from "../../common_modal/documentModal";
import { format, parseISO } from "date-fns";
import DeleteModal from "../../common_modal/delete_modal/DeleteModal";

const EvaluationApproval = ({
  contentDetails,
  showRiskAnalysisChart,
  riskAnalysisChartOptions,
  assetEvaluationId,
  lastActCode,
  AppActivity,
  AppActions,
  // remarkRequest,
  // setRemarkRequest,
  setContent,
  setContentDetails,
  CountApprove,
  contentDetailsini,
  currentActivityForm,
  contentDetailsT,
}) => {
  const textareaRef = useRef(null);
  const [reviewed, setReviewed] = useState({});
  const [deletes, setDeletes] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [listDocument, setListDocument] = useState([]);
  const [listDocument1, setListDocument1] = useState([]);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  const [remarkRequest, setRemarkRequest] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageTask, setErrorMessageTask] = useState("");

  const [selectedFile, setSelectedFile] = useState({
    name: "",
    descritpion: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });

  //ResponseTask start
  const [Resdeletes, setResDeletes] = useState(false);
  const [taskRespOpen, setTaskRespOpen] = useState(false);
  const [fileDetailsRes, setFileDetailsRes] = useState(false);
  const [openDrawerRes, setOpenDrawerRes] = useState(false);
  const [taskRespListDocument, setTaskRespListDocument] = useState([]);

  const [selectedResDocument, setSelectedResDocument] = useState(null);
  const [selectedRespFile, setSelectedRespFile] = useState({
    name: "",
    descritpion: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });

  //ResponseTask end
  const [documenResDowToken, setDocumenResDowToken] = useState("");
  const [handelCommentRemarks, setHandelCommentRemarks] = useState({});

  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showSendPopup, setShowSendPopup] = useState(false);
  const [dateExtendopen, setDateExtendOpen] = useState(false);
  const handlehandledateExtendClose = () => setDateExtendOpen(false);
  const [selectedStaff, setSelectedStaff] = useState([]);

  //show and previs
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [previousTasks, setPreviousTasks] = useState({});

  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [staff, setStaff] = useState([]);

  const [newRemark, setNewRemark] = useState("");
  const [newImpactTaskRemark, setNewImpactTaskRemark] = useState("");

  const [open, setOpen] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [clickedTasks, setClickedTasks] = useState({});
  const [showReview, setshowReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentExtValidation, setCommentExtValidation] = useState(null);

  const handleInputChange = (event, type) => {
    if (type === "Consultaion") {
      setNewRemark(event.target.value);
      if (event.target.value.trim() !== "") {
        setErrorMessage(""); // Clear error message on input change
      }
    } else if (type === "ImpactTask") {
      setNewImpactTaskRemark(event.target.value);
      if (event.target.value.trim() !== "") {
        setErrorMessageTask(""); // Clear error message on input change
      }
    }
  };
  const handleRemarkChange = (index, event) => {
    const updatedRemarks = [...remarkRequest];
    updatedRemarks[index].remark = event.target.value;
    setRemarkRequest(updatedRemarks);
  };
  function getRecords() {
    try {
      apiAuth
        .get(`/ApprovalManager/RemarksbyRequest/${AppActivity.uid}`)
        .then((resp) => {
          setRemarkRequest(resp.data.data);
        });
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }
  useEffect(() => {
    getRecords();
  }, [AppActivity.uid, contentDetails]);
  const handleSaveClick = (type) => {
    if (type === "Consultaion" && newRemark.trim() === "") {
      setErrorMessage("Consultaion Comments are required.");
      return;
    }
    if (type === "ImpactTask" && newImpactTaskRemark.trim() === "") {
      setErrorMessageTask("ImpactTask Comments are required.");
      return;
    }
    const remark = type === "Consultaion" ? newRemark : newImpactTaskRemark;
    if (!remark) {
      toast?.error("Please enter a comment");
      return;
    }
    const payload = {
      activityId: AppActivity.uid,
      remark: remark,
      activityCode: lastActCode.code,
      evaluationType: type,
      version: lastActCode.version,
    };
    if (remark === newRemark) {
      apiAuth
        .post(`/ApprovalManager/CreateComment/${assetEvaluationId}/0`, payload)
        .then((resp) => {
          toast?.success("Consultation comment added.");
          setNewRemark("");
          setNewImpactTaskRemark("");
          getRecords();
        });
    } else {
      apiAuth
        .post(`/ApprovalManager/CreateComment/${assetEvaluationId}/0`, payload)
        .then((resp) => {
          toast?.success("Task comment added.");
          setNewRemark("");
          setNewImpactTaskRemark("");
          getRecords();
        })
        .catch((error) => {
          console.error("Error adding comment:", error);
          toast?.error("Error adding comment");
        });
    }

    console.log(payload, "payyy");
  };
  const handleUpdateClick = (index, id) => {
    if (!remarkRequest[index].remark) {
      toast?.error("Please enter a comment");
      return;
    }
    const payload = {
      activityId: remarkRequest[index].activityId,
      remark: remarkRequest[index].remark,
      activityCode: remarkRequest[index].activityCode,
      evaluationType: remarkRequest[index].evaluationTypeString,
      version: remarkRequest[index].version,
    };

    apiAuth
      .post(
        `/ApprovalManager/CreateComment/${assetEvaluationId}/${id}`,
        payload
      )
      .then((response) => {
        if (response.status === 200) {
          // alert("Comment updated successfully");
          // const updatedRemarks = [...remarks];
          // updatedRemarks[index] = response.data.data[index];
          // setRemarks(updatedRemarks);
          toast.success("Comment updated successfully");
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
          toast.error(
            `Error: ${error.response.data.message || "Error updating comment"}`
          );
        }
      });
  };
  const handleStaffChange = (event) => {
    setSelectedStaff(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handledateExtendopen = (e) => {
    e.preventDefault();
    apiAuth.get(`/Staff/LOV`).then((resp) => {
      setStaff(resp.data.data);
    });
    setDateExtendOpen(true);
  };
  const style1Modal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1200px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",
    p: 4,
    boxShadow: 24,
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
  };

  const styleAi = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1200px",
    maxWidth: "80vw",
    height: "auto",
    maxHeight: "800px",
    overflow: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
  };

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
    overflow: "auto", // Smooth transition for opening/closing
  });

  const StyledBadge = withStyles((theme) => ({
    Badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);

  async function EvaluationApiRecall() {
    const response = await apiAuth.get(
      `/SummaryDetails/List?id=${assetEvaluationId}&&code=${lastActCode.code}&&version=${lastActCode.version}&&refVersion=${lastActCode.refVersion}`
    );

    setHandelCommentRemark("");
    await setContentDetails(response?.data?.data);

  }

  const setHandelCommentRemark = (id, value) => {
    setHandelCommentRemarks((prevRemarks) => ({
      ...prevRemarks,
      [id]: value,
    }));
  };
  const handelCommentImp = async (id, rwid, value) => {
    const remark = handelCommentRemarks[id];
    if (value == 1) {
      // setshowReview(true);
      apiAuth
        .put(
          `/ChangeEvaluationConsultation/AddReview/${id}/${lastActCode.code}/0`,
          {
            remark: remark,
          }
        )
        .then(async (resp) => {
          toast?.success("Review successfully added");
          setHandelCommentRemarks((prevRemarks) => ({
            ...prevRemarks,
            [id]: "", // Clear remark after saving
          }));
          testRevEvaluationApiRecalliew();
        });
    } else {
      apiAuth
        .put(
          `/ChangeEvaluationConsultation/AddReview/${id}/${lastActCode.code}/${rwid}`,
          {
            remark: remark,
          }
        )
        .then(async (resp) => {
          setHandelCommentRemarks((prevRemarks) => ({
            ...prevRemarks,
            [id]: "", // Clear remark after updating
          }));
          toast?.success("Review successfully updated");
          EvaluationApiRecall();
        });
    }
  };

  const handelImpactCommentImp = (id, value) => {
    const remark = handelCommentRemarks[id];

    apiAuth
      .put(`/Task/AddReview/${id}/${lastActCode.code}`, {
        remark: remark,
      })
      .then((resp) => {
        setHandelCommentRemarks((prevRemarks) => ({
          ...prevRemarks,
          [id]: "", // Clear remark after updating
        }));
        if (value === 1) {
          // setshowReview(true);
          toast?.success("Review successfully added");
          EvaluationApiRecall();
        } else {
          toast?.success("Review successfully Updated");
          EvaluationApiRecall();
        }
        setHandelCommentRemarks((prevRemarks) => ({
          ...prevRemarks,
          [id]: "", // Clear remark after updating
        }));
      });
  };

  const handleExpansionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const hasAddedComment = (comments) => {
    return comments.some((comment) => comment.isCreatedByMe);
  };

  const isMyComment = (comment) => {
    return comment.isCreatedByMe;
  };
  console.log(AppActivity, "AppActivity");
  const formatDatess = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };
  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
  const handelreview = (id) => {
    apiAuth
      .put(`/SummaryDetails/ConsultationReviewStatus/${assetEvaluationId}`, {
        Task: [id],
        ActivityCode: lastActCode.code,
      })
      .then((response) => {
        toast?.success("Successfully marked the item as reviewed");
        setReviewed((prevReviewed) => ({
          ...prevReviewed,
          [id]: true,
        }));
        setClickedTasks((prevClickedTasks) => ({
          ...prevClickedTasks,
          [id]: true,
        }));
        console.log(response);
      });
  };

  const handelImpactreview = (id) => {
    apiAuth
      .put(`/SummaryDetails/TaskReviewStatus/${assetEvaluationId}`, {
        Task: [id],
        ActivityCode: lastActCode.code,
      })
      .then((response) => {
        toast?.success("Successfully marked the item as reviewed");

        setReviewed((prevReviewed) => ({
          ...prevReviewed,
          [id]: true,
        }));
        setClickedTasks((prevClickedTasks) => ({
          ...prevClickedTasks,
          [id]: true,
        }));
        console.log(response);
      });
  };

  const handleCheckboxChange = (isChecked, taskDetails) => {
    if (isChecked) {
      const updatedTasks = [...selectedTasks, taskDetails];
      setSelectedTasks(updatedTasks);

      // Show send popup when first checkbox is checked
      if (updatedTasks?.length === 1) {
        setShowSendPopup(true);
      }
    } else {
      // Remove task from selectedTasks if unchecked
      const filteredTasks = selectedTasks.filter(
        (task) => task.id !== taskDetails.id
      );
      setSelectedTasks(filteredTasks);

      // Hide send popup if no tasks are selected
      if (filteredTasks?.length === 0) {
        setShowSendPopup(false);
      }
    }
  };

  const sendSelectedTasks = () => {
    // Implement your logic to send selectedTasks array to an API or perform an action
    console.log("Sending selected tasks:", selectedTasks);
    // Reset selectedTasks array after sending
    setSelectedTasks([]);
    // Hide send popup
    setShowSendPopup(false);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const taskIds = selectedTasks.map((task) => task.id);
    // Prepare payload in the required format
    if (selectedStaff.length === 0 || email === "" || comments === "") {
      setIsLoading(false);
      setCommentExtValidation("* Please fill all madatory fields");
      return;
    }
    const payload = {
      comments: comments,
      team: selectedStaff,
      Task: taskIds, // Assuming Task ID is fixed or derived from another source
      emails: email,
      ActivityCode: lastActCode?.code,
      Version: lastActCode?.version,
    };
    // alert(comments);
    apiAuth
      .put(`/SummaryDetails/SendComment/${assetEvaluationId}`, payload)
      .then((response) => {
        setDateExtendOpen(false);

        toast?.success(
          "Selected tasks successfully sent for external consultation"
        );

        apiAuth
          .get(
            `/SummaryDetails/List?id=${assetEvaluationId}&&code=${lastActCode.code}&&version=${lastActCode.version}&&refVersion=${lastActCode.refVersion}`
          )
          .then((resp) => {
            setIsLoading(false);
            location.reload();

            setShowSendPopup(false);

            setContentDetails(resp.data.data);
          });
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const SubmitApprovelCreate = (e, btuid, btname, bttype) => {
    setIsLoading(true);
    const payload = {
      activityId: AppActivity.uid,
      actionType: bttype,
      actionUid: btuid,
      actionUID: btuid,
      actionName: btname,
      formUID: AppActivity.formUID,
      formType: AppActivity.form,
      version: AppActivity.version,
      remark: null,
      taskscomment: null,
      consultaioncomment: null,
      activityCode: AppActivity.code,
    };
    apiAuth
      .post(`/ApprovalManager/Create/${assetEvaluationId}`, payload)
      .then((response) => {
        if (response.data.statusCode != 400) {
          toast?.success("Successfull");
          setIsLoading(false);

          apiAuth
            .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
            .then((resp) => {
              setContent(resp.data.data.phases);
            });
        } else {
          setIsLoading(false);

          toast?.error(response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const ListDoc = (id, activeid) => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${activeid}/Approval?changeRequestToken=${id}`
      )
      .then((Resp) => {
        setListDocument(Resp?.data?.data);
      });
  };
  const formatDateModal = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      return format(date, "MMMM dd, yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };
  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      return format(date, "MMMM dd, yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
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
    // if (file) {
    //   const url = URL.createObjectURL(file);
    //   setFileUrl(url);
    //   setFileName(file.name);
    // }
    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");
    const fileType = e.target.files[0].type.startsWith("image/")
      ? e.target.files[0].type?.split("/")[1]
      : e.target.files[0].type;
    setSelectedFile({
      ...selectedFile,
      name: fileNameWithoutExtension,

      type: fileType,
      document: e.target.files[0],
      documentType: "Approval",
      documentId: AppActivity.uid,
      changeRequestToken: assetEvaluationId,
    });
  };
  const handleOpen1 = () => {
    setOpen1(true);
    setSelectedFile({
      name: "",
      descritpion: "",
    });
    ListDoc(assetEvaluationId, AppActivity.uid);
  };

  const handleModalClose = () => {
    setOpen1(false);
    setOpenDrawer(false);
  };

  const handleModalClose1 = () => {
    setOpen(false);
    setOpenDrawer(false);
  };

  const handleSubmitResponse = (e) => {

    if (
      !selectedRespFile.name.trim() ||
      !selectedRespFile.type.trim() ||
      !selectedRespFile.document ||
      !selectedRespFile.documentType.trim()

    ) {
      toast.error("Please select your file.");
      handleRespModalClose()
      setSelectedFile({
        ...selectedRespFile,
        name: "",
        description: "",
      });
      return;
    }

    // Validation: If description field is empty
    if (!selectedRespFile?.descritpion?.trim()) {
      toast.error("Please add a description.");
      handleRespModalClose()
      setSelectedFile({
        ...selectedRespFile,
        name: "",
        description: "",
      });
      return;
    }


    const formData = new FormData();
    formData.append("name", selectedRespFile.name);
    formData.append("descritpion", selectedRespFile.descritpion);
    formData.append("type", selectedRespFile.type);
    formData.append("document", selectedRespFile.document);
    formData.append("documentType", "ExternalCnsltn");
    formData.append("documentId", selectedRespFile.documentId);
    formData.append("changeRequestToken", assetEvaluationId);
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
              `/DocumentManager/DocList/${selectedRespFile.documentId}/ExternalCnsltn?changeRequestToken=${assetEvaluationId}`
            )
            .then((Resp) => {
              setOpenDrawerRes(false);
              setTaskRespListDocument(Resp?.data?.data);
              setSelectedRespFile({
                ...selectedRespFile,
                name: "",
                description: "",
              });
            });
          apiAuth
            .get(
              `/SummaryDetails/List?id=${assetEvaluationId}&&code=${lastActCode.code}&&version=${lastActCode.version}&&refVersion=${lastActCode.refVersion}`
            )
            .then((resp) => {
              setContentDetails(resp.data.data);
            });
        } else {
          toast.error(response.data.message);
          setTaskRespOpen(false);
          setOpenDrawerRes(false);
          setSelectedRespFile({
            ...selectedRespFile,
            name: "",
            description: "",
          });
        }
      })
      .catch((error) => {
        setOpen(false);
        setOpen1(false);
        console.error("There was an error uploading the document!", error);
        if (error.errorsData) {
          if (error.errorsData.Name && error.errorsData.Name.length) {
            toast.error(error.errorsData.Name[0]);
          } else {
            toast.error("There was an error uploading the document!");
          }
        } else {
          toast.error("There was an error uploading the document!");
        }
        setTaskRespOpen(false);
        setOpenDrawerRes(false);
        setSelectedRespFile({
          ...selectedRespFile,
          name: "",
          description: "",
        });
      });
  };

  const handleSubmitAsset = (e) => {
    if (
      !selectedFile.name.trim() ||
      // !selectedFile.type.trim() ||
      !selectedFile.document ||
      !selectedFile.documentType.trim() ||
      !selectedFile.documentId.trim()
    ) {
      toast.error("Please select your file.");
      handleModalClose()
      setSelectedFile({
        ...selectedFile,
        name: "",
        description: "",
      });
      return;
    }

    // Validation: If description field is empty
    if (!selectedFile?.descritpion?.trim()) {
      toast.error("Please add a description.");
      handleModalClose()
      setSelectedFile({
        ...selectedFile,
        name: "",
        description: "",
      });
      return;
    }
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("descritpion", selectedFile.descritpion);
    formData.append("type", selectedFile.type);
    formData.append("document", selectedFile.document);
    formData.append("documentType", "Approval");
    formData.append("documentId", AppActivity.uid);
    formData.append("changeRequestToken", assetEvaluationId);
    apiAuth
      .post("DocumentManager/Create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.statusCode === 200) {
          apiAuth
            .get(
              `/DocumentManager/DocList/${AppActivity.uid}/Approval?changeRequestToken=${assetEvaluationId}`
            )
            .then((response) => {
              setOpenDrawer(false);
              setListDocument(response?.data?.data);
              setSelectedFile({
                ...selectedFile,
                name: "",
                descritpion: "",
              });
              apiAuth.get(
                `/SummaryDetails/List?id=${assetEvaluationId}&&code=${lastActCode.code}&&version=${lastActCode.version}&&refVersion=${lastActCode.refVersion}`
              );


              setContentDetails(response?.data?.data);
            });

        } else {
          toast.error(response.data.message);
          setOpen(false);
          setOpen1(false);

          setOpenDrawer(false);
          setSelectedFile({
            ...selectedFile,
            name: "",
            description: "",
          });
        }
      })
      .catch((error) => {
        setOpen(false);
        setOpen1(false);
        console.error("There was an error uploading the document!", error);
        if (error.errorsData) {
          if (error.errorsData.Name && error.errorsData.Name.length) {
            toast.error(error.errorsData.Name[0]);
          } else {
            toast.error("There was an error uploading the document!");
          }
        } else {
          toast.error("There was an error uploading the document!");
        }
        setOpen(false);
        setOpen1(false);
        setOpenDrawer(false);
        setSelectedFile({
          ...selectedFile,
          name: "",
          description: "",
        });
      });
  };

  const handleDownload = () => {
    apiAuth
      .get(`/DocumentManager/download/${documenDowToken}`, {
        responseType: "blob",
      })
      .then((response) => {
        setOpenDrawer(false);
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

  const ListDoc1 = (id) => {
    apiAuth.get(`/DocumentManager/SummaryDoclist/${id}`).then((Resp) => {
      setListDocument1(Resp?.data?.data);
    });
  };

  const handleOpen = () => {
    setOpen(true);
    ListDoc1(assetEvaluationId);
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
          `/DocumentManager/DocList/${docId}/Approval?changeRequestToken=${selectedDocument?.changeRequestToken}`
        )
        .then((response) => {
          setOpenDrawer(false);
          setListDocument(response?.data?.data);
          setDeletes(false);
          setFileDetails(false);
          setSelectedDocument("");
        });
    });
  };

  //Response Modal
  const handelRespDetailDoc = (doc) => {
    setSelectedResDocument(doc);
    setFileDetailsRes(true);
    setDocumenResDowToken(doc.token);
  };
  const handleRespModalClose = () => {
    setTaskRespOpen(false);
    setFileDetailsRes(false)
    setOpenDrawerRes(false)
    setSelectedFile({
      ...selectedRespFile,
      name: "",
      description: "",
    });
  };
  const TaskDocuHandle = (id) => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${id}/ExternalCnsltn?changeRequestToken=${assetEvaluationId}`
      )
      .then((Resp) => {
        setTaskRespListDocument(Resp?.data?.data);
      });
    setTaskRespOpen(true);
    setSelectedRespFile({
      ...selectedRespFile,
      documentId: id,
    });
  };
  const toggleDrawerRes = (open) => () => {
    setOpenDrawerRes(open);
  };
  const handelFileResDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedRespFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handelRespFileChange = (e) => {
    const file = e.target.files[0];
    // if (file) {
    //   const url = URL.createObjectURL(file);
    //   setFileUrl(url);
    //   setFileName(file.name);
    // }
    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");
    const fileType = e.target.files[0].type.startsWith("image/")
      ? e.target.files[0].type?.split("/")[1]
      : e.target.files[0].type;
    setSelectedRespFile({
      ...selectedRespFile,
      name: fileNameWithoutExtension,

      type: fileType,
      document: e.target.files[0],
    });
  };
  const handleResCloseDelete = () => {
    setResDeletes(false);
  };

  const handleResDelete = (e, id, token) => {
    e.preventDefault();
    setDocId(id);
    setDocToken(token);
    setResDeletes(true);
  };

  const handleResSubmitDelete = () => {
    apiAuth.delete(`DocumentManager/Delete/${docToken}`).then((response) => {
      apiAuth
        .get(
          `/DocumentManager/DocList/${docId}/ExternalCnsltn?changeRequestToken=${assetEvaluationId}`
        )
        .then((response) => {
          setOpenDrawerRes(false);
          setTaskRespListDocument(response?.data?.data);
          setResDeletes(false);
          setFileDetailsRes(false);
          setSelectedResDocument("");
        });
      apiAuth
        .get(
          `/SummaryDetails/List?id=${assetEvaluationId}&&code=${lastActCode.code}&&version=${lastActCode.version}&&refVersion=${lastActCode.refVersion}`
        )
        .then((resp) => {
          setContentDetails(resp.data.data);
        });
    });
  };

  const handleResDownload = () => {
    apiAuth
      .get(`/DocumentManager/download/${documenResDowToken}`, {
        responseType: "blob",
      })
      .then((response) => {
        setOpenDrawer(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", selectedResDocument.name); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
  };

  const toggleDetails = (impid) => {
    if (selectedTaskId === impid) {
      // If the clicked task is already selected, close it by setting selectedTaskId to null
      setSelectedTaskId(null);
    } else {
      // Fetch data and set the selected task ID
      apiAuth.get(`/Task/GetPreviousVersions/${impid}`).then((resp) => {
        setPreviousTasks((prev) => ({
          ...prev,
          [impid]: resp.data.data,
        }));
      });
      setSelectedTaskId(impid);
    }
  };

  const [apiOpenModal, setAiOpenModal] = useState(false);
  const handelCloseAiModal = () => {
    setAiOpenModal(false);
  };

  const handelOpenAiModal = () => {
    setAiOpenModal(true);
  };
  const uniqueEvaluationTeam = React.useMemo(() => {
    const teamMap = new Map();

    contentDetails?.evaluationTeam?.forEach((member) => {
      const key = `${member.teamType}-${member.staffId}`;
      if (!teamMap.has(key)) {
        teamMap.set(key, member);
      }
    });

    return Array.from(teamMap.values());
  }, [contentDetails]);

  const [potentialFrequencyDetails, setPotentialFrequencyDetails] = useState(
    []
  );

  const [formValues, setFormValues] = useState({
    task: "",
    subTask: "",
    hazardousSituation: "",
    consequence: "",
    time: "",
    frequencyDetails: "",
    frequencyScoring: "",
    likelihoodScoring: "",
    severityScoring: "",
    potentialRisk: "",
    humanControlMeasure: "",
    technicalControlMeasure: "",
    organisationalControlMeasure: "",
    modifiedTime: "",
    modifiedFrequencyDetails: "",
    residualFrequencyScoring: "",
    residualLikelihoodScoring: "",
    residualSeverityScoring: "",
    residualRisk: "",
    residualRiskClassification: "",
  });

  const [viewrisk, setViewRisk] = useState(false);
  const [risk, setRisk] = useState(false);
  const [subTaskDetail, setSubTaskDetail] = useState([]);
  const [Classifications, setClassification] = useState("");

  const calculateRiskClassification = (residualRisk) => {
    let classification = "";
    let classificationValue = "";

    if (residualRisk > 400) {
      classification = "HighRisk";
      classificationValue = "1";
    } else if (residualRisk > 200 && residualRisk <= 400) {
      classification = "SignificantRisk";
      classificationValue = "2";
    } else if (residualRisk > 70 && residualRisk <= 200) {
      classification = "AverageRisk";
      classificationValue = "3";
    } else if (residualRisk > 20 && residualRisk <= 70) {
      classification = "LowRisk";
      classificationValue = "4";
    } else if (residualRisk <= 20) {
      classification = "VeryLowRisk";
      classificationValue = "5";
    }

    return { classification, classificationValue };
  };
  const handelViewDetails = (id, subid) => {
    setPotentialFrequencyDetails([]);
    setFormValues({
      ...formValues,
      hazardType: "",
      hazardousSituation: "",
      consequence: "",
      time: "",
      frequencyDetails: "",
      frequencyScoring: "",
      likelihoodScoring: "",
      severityScoring: "",
      potentialRisk: "",
      humanControlMeasure: "",
      technicalControlMeasure: "",
      organisationalControlMeasure: "",
      modifiedTime: "",
      modifiedFrequencyDetails: "",
      residualFrequencyScoring: "",
      residualLikelihoodScoring: "",
      residualSeverityScoring: "",
      residualRisk: "",
    });

    setViewRisk(true);
    setRisk(true);
    apiAuth.get(`/RiskAnalysis/SubTaskDetail?id=${subid}`).then((resp) => {
      setSubTaskDetail(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/28`).then((resp) => {
      setSubTaskhazardDetail(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/29`).then((resp) => {
      setPotentialTimeDetails(resp.data.data);
    });
    apiAuth.get(`/LookupData/Lov/30/0`).then((resp) => {
      setPotentialFrequencyDetails(resp.data.data);
    });
    apiAuth.get(`/RiskAnalysis/RiskAnalysisDetail?id=${id}`).then((resp) => {
      const data = resp.data.data.riskAnalysisHazardSituation[0];
      setFormValues({
        ...formValues,
        hazardType: {
          value: resp?.data?.data?.hazardType,
        },
        // hazardType: resp?.data?.data?.hazardType,
        hazardousSituation: data?.hazardousSituation,
        consequence: data?.consequence,
        time: data?.time,
        frequencyDetails: data?.frequencyDetails,
        frequencyScoring: data?.frequencyScoring,
        likelihoodScoring: data?.likelihoodScoring,
        severityScoring: data?.severityScoring,
        potentialRisk: data?.potentialRisk,
        humanControlMeasure: data?.humanControlMeasure,
        technicalControlMeasure: data?.technicalControlMeasure,
        organisationalControlMeasure: data?.organisationalControlMeasure,
        modifiedTime: data?.modifiedTime,
        modifiedFrequencyDetails: data?.modifiedFrequencyDetails,
        residualFrequencyScoring: data?.residualFrequencyScoring,
        residualLikelihoodScoring: data?.residualLikelihoodScoring,
        residualSeverityScoring: data?.residualSeverityScoring,
        residualRisk: data?.residualRisk,
        residualRiskClassification: data?.residualRiskClassification,
      });

      const { classification, classificationValue } =
        calculateRiskClassification(data?.residualRisk);

      setClassification(classification);
    });
  };
  const [errorsAddTask, setErrorsAddTask] = useState({});
  const [errorsSub, setErrorsSub] = useState({});
  const [AddImpact, setAddCImpact] = useState(false);
  const [particularList, setParticularList] = useState([]);
  const [particularSubList, setParticularSubList] = useState([]);
  const [hazardList, setHazardList] = useState([]);
  const [editRiskAnalysDetail, setEditRiskAnalysDetail] = useState([]);

  const [impactForm, setImpactForm] = useState({
    particular: "",
    particularSubCategory: "",
    hazardDetail: "",
    changeImpactTasks: [],
    changeImpactHazardList: [],
  });

  const handleChangeImpact = (e) => {
    const { name, value } = e.target;

    if (name === "particular") {
      apiAuth.get(`/LookupData/Lov/17/${value}`).then((resp) => {
        setParticularSubList(resp?.data.data);
      });
    }
    if (name === "particularSubCategory") {
      apiAuth.get(`/LookupData/Lov/18/${e.target.value}`).then((resp) => {
        setHazardList(resp?.data.data);
      });
    }
    setImpactForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errorsAddTask[name]) {
      setErrorsAddTask((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handlebackImpactList = () => {
    setAddCImpact(false);
    apiAuth.get(`/LookupData/Lov/16`).then((resp) => {
      setParticularList(resp?.data.data);
    });
  };

  const [AddTaskforms, setAddTakForms] = useState([]);
  const [subTaskhazardDetail, setSubTaskhazardDetail] = useState([]);
  const [potentialTimeDetails, setPotentialTimeDetails] = useState([]);
  const [TaskhazardRiskApi, setSubTaskhazardRiskApi] = useState([]);
  const [TaskhazardRiskViewName, setSubTaskhazardRiskViewName] = useState("");
  const [generalGuidePdf, setGeneralGuidePdf] = useState(null);

  const handleInputChangeHazard = (event, option) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      hazardType: {
        text: option.text,
        value: option.value,
        isReadOnly: option.isReadOnly,
      },
      task: subTaskDetail.taskName,
      subTask: subTaskDetail.subTaskName,
    }));

    setErrorsSub((prevErrors) => ({
      ...prevErrors,
      [event.target.name]: "",
    }));

    apiAuth
      .get(`/RiskAnalysis/download/${option.text}`, {
        responseType: "blob",
      })
      .then((resp) => {
        setSubTaskhazardRiskApi(resp.data);
        console.log(resp.data, "daaaa");
        setSubTaskhazardRiskView(true);
        setSubTaskhazardRiskViewName(option.text);
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      });
  };

  const handleGeneralGuideClick = () => {
    apiAuth
      .get(`/RiskAnalysis/downloadGeneral`, {
        responseType: "blob",
      })
      .then((resp) => {
        setGeneralGuidePdf(resp.data);
      });
  };

  const calculateFrequencyScoring = (text) => {
    if (["t < 2.4min", "t < 0.2h", "t < 0.8h", "t < 8.5h"].includes(text)) {
      return 0.5;
    } else if (
      [
        "2.4 <= t < 24min",
        "0.2 <= t < 2h",
        "0.8 <= t < 8h",
        "8.5 <= t < 85h",
      ].includes(text)
    ) {
      return 1;
    } else if (
      [
        "24min <= t < 1.6h",
        "2 <= t < 8h",
        "8 <= t < 32h",
        "85 <= t < 340h",
      ].includes(text)
    ) {
      return 2;
    } else if (
      [
        "1.6 <= t < 4h",
        "8 <= t < 20h",
        "32 <= t < 80h",
        "340 <= t < 850h",
      ].includes(text)
    ) {
      return 3;
    } else if (
      [
        "4 <= t < 6h",
        "20 <= t < 30h",
        "80 <= t < 120h",
        "850 <= t < 1275h",
      ].includes(text)
    ) {
      return 6;
    } else {
      return 10;
    }
  };

  const calculatePotentialRisk = (
    frequencyScoring,
    likelihoodScoring,
    severityScoring
  ) => {
    if (
      frequencyScoring &&
      likelihoodScoring &&
      severityScoring &&
      likelihoodScoring <= 15 &&
      likelihoodScoring > 0 &&
      severityScoring <= 15 &&
      severityScoring > 0
    ) {
      return frequencyScoring * likelihoodScoring * severityScoring;
    } else {
      return "";
    }
  };

  const handelRiskInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Clear error for the field being changed
    setErrorsSub((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    if (name === "time") {
      apiAuth.get(`/LookupData/Lov/30/${value}`).then((resp) => {
        setPotentialFrequencyDetails(resp.data.data);
      });
      setFormValues((prevValues) => ({
        ...prevValues,
        frequencyScoring: "",
        frequencyDetails: "",
        likelihoodScoring: "",
        severityScoring: "",
        potentialRisk: "",
      }));
    }

    if (name === "frequencyDetails") {
      const selectedOption = potentialFrequencyDetails.find(
        (option) => option.value === value
      );
      const frequencyScoring = selectedOption
        ? calculateFrequencyScoring(selectedOption.text)
        : "";
      setFormValues((prevValues) => ({
        ...prevValues,
        frequencyScoring: frequencyScoring,
        likelihoodScoring: "",
        severityScoring: "",
        potentialRisk: "",
      }));
    }

    if (
      name === "frequencyDetails" ||
      name === "likelihoodScoring" ||
      name === "severityScoring"
    ) {
      const likelihoodScoring =
        name === "likelihoodScoring" ? value : formValues.likelihoodScoring;
      const severityScoring =
        name === "severityScoring" ? value : formValues.severityScoring;
      const potentialRisk = calculatePotentialRisk(
        formValues.frequencyScoring,
        likelihoodScoring,
        severityScoring
      );

      setFormValues((prevValues) => ({
        ...prevValues,
        potentialRisk: potentialRisk,
      }));
    }
  };
  const handelResidualRiskInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    // Clear error for the field being changed
    setErrorsSub((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    if (name === "modifiedTime") {
      apiAuth.get(`/LookupData/Lov/30/${value}`).then((resp) => {
        setPotentialFrequencyDetails(resp.data.data);
      });
      setFormValues((prevValues) => ({
        ...prevValues,
        residualFrequencyScoring: "",
        modifiedFrequencyDetails: "",
        residualSeverityScoring: "",
        residualLikelihoodScoring: "",
        residualRisk: "",
      }));
    }

    if (name === "modifiedFrequencyDetails") {
      const selectedOption = potentialFrequencyDetails.find(
        (option) => option.value === value
      );
      const frequencyScoring = selectedOption
        ? calculateFrequencyScoring(selectedOption.text)
        : "";
      const residualFrequencyScoring =
        name === "modifiedFrequencyDetails" ? frequencyScoring : "";
      setFormValues((prevValues) => ({
        ...prevValues,
        residualFrequencyScoring: residualFrequencyScoring,
        residualLikelihoodScoring: "",
        residualSeverityScoring: "",
        residualRisk: "",
      }));
    }

    if (
      name === "modifiedFrequencyDetails" ||
      name === "residualFrequencyScoring" ||
      name === "residualSeverityScoring"
    ) {
      const likelihoodScoring =
        name === "residualLikelihoodScoring"
          ? value
          : formValues.residualLikelihoodScoring;
      const severityScoring =
        name === "residualSeverityScoring"
          ? value
          : formValues.residualSeverityScoring;
      const residualRisk = calculatePotentialRisk(
        formValues.residualFrequencyScoring,
        likelihoodScoring,
        severityScoring
      );
      const { classification, classificationValue } =
        calculateRiskClassification(residualRisk);

      setClassification(classification);
      setFormValues((prevValues) => ({
        ...prevValues,
        residualRisk: residualRisk,
        residualRiskClassification: classificationValue,
      }));
    }
  };

  const likelihoodValues = Array.from({ length: 15 }, (_, i) => i + 1);

  const validateRisk = () => {
    const newErrors = {};

    // List of required fields
    const requiredFields = [
      "hazardousSituation",
      "consequence",
      "time",
      "frequencyDetails",
      "likelihoodScoring",
      "severityScoring",
      "humanControlMeasure",
      "technicalControlMeasure",
      "organisationalControlMeasure",
      "modifiedTime",
      "modifiedFrequencyDetails",
      "residualLikelihoodScoring",
      "residualSeverityScoring",
      "hazardType",
    ];

    // Check each field and set error if empty
    requiredFields.forEach((field) => {
      if (!formValues[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrorsSub(newErrors);

    // If there are any errors, return false; otherwise, return true
    return Object.keys(newErrors).length === 0;
  };

  const handelRiskSubmit = (value) => {
    if (validateRisk()) {
      setIsLoading(true);
      if (value == "Submit") {
        setFormValues((prevValues) => ({
          ...prevValues,
          id: 0,
        }));
      }
      const payload = {
        riskAnalysisSubTaskId: subTaskDetail.id,
        hazardType: formValues.hazardType.value,
        riskAnalysisHazardSituation: [formValues],
      };
      console.log(payload, "payyy");
      let apiPath = "/RiskAnalysis/CreateAnalysis";

      if (value === "Update") {
        apiPath = "/RiskAnalysis/UpdateAnalysis";
      }
      apiAuth
        .post(apiPath, payload)
        .then((resp) => {
          setIsLoading(false);

          setRisk(false);
          getRecords();
        })
        .catch((err) => {
          setIsLoading(true);
        });
      setFormValues({
        hazardType: "",
        hazardousSituation: "",
        consequence: "",
        time: "",
        frequencyDetails: "",
        frequencyScoring: "",
        likelihoodScoring: "",
        severityScoring: "",
        potentialRisk: "",
        humanControlMeasure: "",
        technicalControlMeasure: "",
        organisationalControlMeasure: "",
        modifiedTime: "",
        modifiedFrequencyDetails: "",
        residualFrequencyScoring: "",
        residualLikelihoodScoring: "",
        residualSeverityScoring: "",
        residualRisk: "",
        id: 0,
      });
    }
  };

  const goBack = () => {
    setRisk(false);
    setViewRisk(false);
    setPotentialFrequencyDetails([]);
    setFormValues({
      ...formValues,
      hazardType: "",
      hazardousSituation: "",
      consequence: "",
      time: "",
      frequencyDetails: "",
      frequencyScoring: "",
      likelihoodScoring: "",
      severityScoring: "",
      potentialRisk: "",
      humanControlMeasure: "",
      technicalControlMeasure: "",
      organisationalControlMeasure: "",
      modifiedTime: "",
      modifiedFrequencyDetails: "",
      residualFrequencyScoring: "",
      residualLikelihoodScoring: "",
      residualSeverityScoring: "",
      residualRisk: "",
    });
  };

  return (
    <>
      {isLoading && <FuseLoading />}
      <div className="w-full h-full">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={apiOpenModal}
          onClose={handelCloseAiModal}
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
          <Fade in={apiOpenModal}>
            <Box sx={styleAi}>
              <Box sx={{ flex: 1 }}>
                <div className="flex justify-end mt-5">
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "white" }}
                    onClick={handelCloseAiModal}
                  >
                    <FuseSvgIcon size={25}>heroicons-outline:x</FuseSvgIcon>
                  </Button>
                </div>
                <Box
                  className="flex justify-between"
                  style={{ margin: "30px" }}
                >
                  <table className="task-table mat-table task_table">
                    <thead
                      className="task-table-header"
                      style={{ display: "none" }}
                    >
                      {/* Empty header */}
                    </thead>
                    <tbody className="task-table-body">
                      {contentDetails?.tasklist ? (
                        Object.entries(
                          contentDetails.tasklist.reduce((acc, task) => {
                            // Group tasks by particularName
                            if (!acc[task.particularName]) {
                              acc[task.particularName] = {
                                tasks: [],
                                reviewAddedCount: 0,
                                noReviewAddedCount: 0,
                              };
                            }
                            acc[task.particularName].tasks.push(task);

                            // Update counts based on task properties
                            if (task.reviewd) {
                              acc[task.particularName].reviewAddedCount += 1;
                            } else {
                              acc[task.particularName].noReviewAddedCount += 1;
                            }

                            return acc;
                          }, {})
                        ).map(
                          ([
                            particularName,
                            { tasks, reviewAddedCount, noReviewAddedCount },
                          ]) => {
                            return (
                              <Accordion className="mt-6" key={particularName}>
                                <AccordionSummary
                                  aria-controls="panel1a-content"
                                  id="panel1a-header"
                                >
                                  <Typography
                                    className="d-flex flex-wrap w-100"
                                    style={{ alignItems: "center" }}
                                  >
                                    <span>{particularName} </span>

                                    {AppActivity.canEdit && (
                                      <>
                                        <span style={{ marginLeft: "auto" }}>
                                          <b className="text-green">
                                            Reviewed:
                                          </b>{" "}
                                          {reviewAddedCount} |{" "}
                                          <b className="text-red">Pending:</b>{" "}
                                          {noReviewAddedCount}
                                        </span>
                                        <Button
                                          className="whitespace-nowrap ms-5 ml-24"
                                          variant="contained"
                                          color="secondary"
                                        // style={{ marginTop: "10px" }}
                                        >
                                          Mark as reviewed
                                        </Button>
                                      </>
                                    )}
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {tasks
                                    // Sort tasks: not reviewed tasks first
                                    .sort((a, b) =>
                                      a.reviewd === b.reviewd
                                        ? 0
                                        : a.reviewd
                                          ? 1
                                          : -1
                                    )
                                    .map((imptsk) => (
                                      <div
                                        key={imptsk.id}
                                        className="mt-24 border-b pb-24"
                                      >
                                        <div className="task-table-row mat-row">
                                          <div className="task-table-cell mat-cell">
                                            <div className="task-header p-0 flex items-center">
                                              <div className="task-id flex flex-col">
                                                <span
                                                  className="task-id-text font-semibold text-xl leading-none"
                                                  style={{ fontSize: "20px" }}
                                                >
                                                  Task #{imptsk?.sourceTaskId}
                                                </span>
                                              </div>

                                              {imptsk.requestTypeName !=
                                                "Document" &&
                                                AppActivity.canEdit && (
                                                  <div className="task-button ml-auto">
                                                    <button
                                                      className="task-mark-reviewed-button mat-stroked-button cursor-pointer"
                                                      onClick={() =>
                                                        handelImpactreview(
                                                          imptsk.id
                                                        )
                                                      }
                                                      disabled={
                                                        imptsk?.reviewd ||
                                                        clickedTasks[imptsk.id]
                                                      }
                                                      style={{
                                                        backgroundColor:
                                                          imptsk?.reviewd ||
                                                            clickedTasks[
                                                            imptsk.id
                                                            ]
                                                            ? "rgba(220,252,231)"
                                                            : "",
                                                      }}
                                                    >
                                                      {imptsk?.reviewd ||
                                                        clickedTasks[
                                                        imptsk.id
                                                        ] ? (
                                                        <span className="mat-button-wrapper">
                                                          You have reviewed this
                                                          just now
                                                        </span>
                                                      ) : (
                                                        <span className="mat-button-wrapper">
                                                          Click here to mark as
                                                          reviewed
                                                        </span>
                                                      )}
                                                    </button>
                                                  </div>
                                                )}
                                            </div>
                                            {imptsk.sourceTaskId !==
                                              imptsk.id &&
                                              (!imptsk.showPreviousTasks ||
                                                imptsk.showPreviousTasks ===
                                                null) && (
                                                <span
                                                  className="text-sm text-secondary text-blue-500 font-bold cursor-pointer leading-none mt-1 ms-3"
                                                  onClick={() =>
                                                    toggleDetails(imptsk.id)
                                                  }
                                                >
                                                  {selectedTaskId !== imptsk.id
                                                    ? "Show previous versions"
                                                    : "Hide previous versions"}
                                                </span>
                                              )}

                                            {selectedTaskId === imptsk.id &&
                                              previousTasks[imptsk.id] &&
                                              previousTasks[imptsk.id].map(
                                                (itm) => (
                                                  <div
                                                    className="task-details px-0 mt-0 pt-0 border "
                                                    key={itm.id}
                                                  >
                                                    <div class="mt-5 ms-9 font-semibold">
                                                      V{itm.evaluationVersion}
                                                    </div>
                                                    <div className="task-detail prose prose-sm max-w-5xl mt-0 pt-0">
                                                      <div className="task-detail-item mt-0 pt-0">
                                                        <span className="task-detail-label bg-default d-inline-block mt-10 rounded text-secondary font-semibold">
                                                          Particular Sub Name
                                                        </span>
                                                        <span className="task-detail-value d-inline-block mt-5">
                                                          {
                                                            itm.particularSubName
                                                          }
                                                        </span>
                                                        <span className="task-detail-label ms-5 bg-default d-inline-block mt-2 rounded text-secondary font-semibold">
                                                          What is Task
                                                        </span>
                                                        <span className="task-detail-value d-inline-block mt-2">
                                                          {itm.actionWhat}
                                                        </span>
                                                      </div>

                                                      <div className="task-detail-item ">
                                                        <span className="task-detail-label bg-default d-inline-block mt-2 rounded text-secondary font-semibold">
                                                          How is Task done
                                                        </span>
                                                        <span className="task-detail-value d-inline-block mt-2">
                                                          {itm.actionHow}
                                                        </span>
                                                      </div>
                                                      <div className="task-detail-item ">
                                                        <span className="task-detail-label bg-default d-inline-block mt-2  rounded text-secondary font-semibold">
                                                          Assigned to
                                                        </span>
                                                        <span className="task-detail-value d-inline-block mt-2">
                                                          {itm.assignedStaff}
                                                        </span>
                                                        <span className="task-detail-label bg-default rounded ml-2 d-inline-block mt-2 text-secondary font-semibold">
                                                          Due Date
                                                        </span>
                                                        <span className="task-detail-value d-inline-block mt-2">
                                                          {formatDates(
                                                            itm.dueDate
                                                          )}
                                                        </span>
                                                        <span className="task-detail-label bg-default rounded ml-2 d-inline-block mt-2 text-secondary font-semibold">
                                                          Deadline
                                                        </span>
                                                        <span className="task-detail-value d-inline-block mt-2">
                                                          {itm?.deadlineDisplay}
                                                        </span>
                                                      </div>
                                                    </div>

                                                    {itm
                                                      ?.changeImpactTaskReviews
                                                      ?.length != 0 && (
                                                        <Accordion
                                                          expanded={
                                                            expanded === "panel2"
                                                          }
                                                          onChange={handleExpansionChange(
                                                            "panel2"
                                                          )}
                                                          className="mt-6 m-10"
                                                        >
                                                          <AccordionSummary
                                                            expandIcon={
                                                              <ExpandMoreIcon />
                                                            }
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                          >
                                                            <Typography>
                                                              <span className="text-brown">
                                                                {
                                                                  itm
                                                                    ?.changeImpactTaskReviews
                                                                    ?.length
                                                                }{" "}
                                                                Reviews
                                                              </span>{" "}
                                                            </Typography>
                                                          </AccordionSummary>
                                                          {itm?.changeImpactTaskReviews?.map(
                                                            (rivew) => (
                                                              <AccordionDetails>
                                                                <div className="mat-form-field-wrapper">
                                                                  <div className="mat-form-field-flex">
                                                                    <img
                                                                      src="/assets/images/etc/userpic.png"
                                                                      alt="Card cover image"
                                                                      className="rounded-full mr-4"
                                                                      style={{
                                                                        width:
                                                                          "3rem",
                                                                        height:
                                                                          "3rem",
                                                                      }}
                                                                    />
                                                                    <div>
                                                                      <div className="mat-form-field-infix mt-5">
                                                                        <span className="">
                                                                          {
                                                                            rivew?.createdByStaffName
                                                                          }
                                                                        </span>
                                                                        -{" "}
                                                                        <span className="text-grey">
                                                                          {
                                                                            rivew?.remark
                                                                          }
                                                                        </span>
                                                                      </div>
                                                                      <p
                                                                        className="mat-form-field-infix text-grey"
                                                                        style={{
                                                                          fontSize:
                                                                            "smaller",
                                                                        }}
                                                                      >
                                                                        {rivew?.updatedAt
                                                                          ? new Date(
                                                                            rivew.updatedAt
                                                                          ).toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                              year: "numeric", // e.g., "2024"
                                                                              month:
                                                                                "long", // e.g., "August"
                                                                              day: "numeric", // e.g., "20"
                                                                              hour: "2-digit", // e.g., "12 PM"
                                                                              minute:
                                                                                "2-digit", // e.g., "46"
                                                                              second:
                                                                                "2-digit", // e.g., "23"
                                                                              hour12: true, // Use 12-hour clock
                                                                              timeZoneName:
                                                                                "short", // e.g., "GMT+5"
                                                                            }
                                                                          )
                                                                          : null}
                                                                      </p>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </AccordionDetails>
                                                            )
                                                          )}
                                                        </Accordion>
                                                      )}
                                                  </div>
                                                )
                                              )}
                                            <div className="task-details p-0">
                                              <div className="task-detail prose prose-sm max-w-5xl">
                                                <div className="task-detail-item p-0 mt-0">
                                                  <span className="task-detail-label bg-default rounded  d-inline-block mt-10 text-secondary font-semibold">
                                                    Particular Sub Name
                                                  </span>
                                                  <span className="task-detail-value d-inline-block mt-10">
                                                    {imptsk.particularSubName}
                                                  </span>
                                                  <span className="task-detail-label bg-default rounded ms-5 d-inline-block mt-10 text-secondary font-semibold">
                                                    What is Task
                                                  </span>
                                                  <span className="task-detail-value d-inline-block mt-10">
                                                    {imptsk.actionWhat}
                                                  </span>
                                                </div>

                                                <div className="task-detail-item p-0 mt-0">
                                                  <span className="task-detail-label bg-default rounded  d-inline-block mt-10 text-secondary font-semibold">
                                                    How is Task done
                                                  </span>
                                                  <span className="task-detail-value d-inline-block mt-10">
                                                    {imptsk.actionHow}
                                                  </span>
                                                </div>
                                                <div
                                                  className="task-detail-item p-0 mt-0 flex "
                                                  style={{
                                                    justifyContent:
                                                      "space-between",
                                                  }}
                                                >
                                                  <div>
                                                    <span className="task-detail-label bg-default rounded d-inline-block mt-10 text-secondary font-semibold">
                                                      Assigned to
                                                    </span>
                                                    <span className="task-detail-value d-inline-block mt-10">
                                                      {imptsk.assignedStaff}
                                                    </span>
                                                    <span className="task-detail-label bg-default rounded  d-inline-block mt-10 ml-2 text-secondary font-semibold">
                                                      Due Date
                                                    </span>
                                                    <span className="task-detail-value d-inline-block mt-10">
                                                      {formatDates(
                                                        imptsk.dueDate
                                                      )}
                                                    </span>
                                                    <span className="task-detail-label bg-default rounded  d-inline-block mt-10 ml-2 text-secondary font-semibold">
                                                      Deadline
                                                    </span>
                                                    <span className="task-detail-value d-inline-block mt-10">
                                                      {imptsk?.deadlineDisplay}
                                                    </span>
                                                  </div>
                                                  <div>
                                                    {AppActivity.canEdit && (
                                                      <div
                                                        style={{
                                                          float: "right",
                                                        }}
                                                      >
                                                        <FormGroup>
                                                          <FormControlLabel
                                                            control={
                                                              <Checkbox
                                                                onChange={(e) =>
                                                                  handleCheckboxChange(
                                                                    e.target
                                                                      .checked,
                                                                    {
                                                                      id: imptsk.id,
                                                                      impact:
                                                                        imptsk.particularName +
                                                                        ">" +
                                                                        imptsk.particularSubName,
                                                                      task: imptsk.actionWhat,
                                                                      how: imptsk.actionHow,
                                                                      assignedTo:
                                                                        imptsk.assignedStaff,
                                                                      dueDate:
                                                                        formatDates(
                                                                          imptsk.dueDate
                                                                        ),
                                                                      deadline:
                                                                        imptsk.deadlineDisplay,
                                                                      taskId:
                                                                        imptsk?.id,
                                                                    }
                                                                  )
                                                                }
                                                                id="check289-input"
                                                                inputProps={{
                                                                  "aria-label":
                                                                    "primary checkbox",
                                                                }}
                                                                color="primary"
                                                              />
                                                            }
                                                            label="Need External Consultation"
                                                          />
                                                        </FormGroup>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                              {imptsk?.riskAnalysisList
                                                ?.length !== 0 &&
                                                imptsk.particularid === 78 && (
                                                  <Paper
                                                    style={{
                                                      margin: "10px 0 0 0",
                                                    }}
                                                  >
                                                    <div
                                                      className="flex items-center w-full justify-between"
                                                      style={{
                                                        borderRadius: "20px",
                                                        backgroundColor:
                                                          "rgb(241 248 255)",
                                                      }}
                                                    >
                                                      <h6
                                                        className="text-small font-semibold"
                                                        style={{
                                                          padding: "15px",
                                                        }}
                                                      >
                                                        Risk Details
                                                      </h6>
                                                      <h6
                                                        className="text-1xl font-semibold"
                                                        style={{
                                                          padding: "10px",
                                                        }}
                                                      >
                                                        Human Measures
                                                      </h6>
                                                      <h6
                                                        className="text-1xl font-semibold"
                                                        style={{
                                                          padding: "10px",
                                                        }}
                                                      >
                                                        Technical Measures
                                                      </h6>
                                                      <h6
                                                        className="text-1xl font-semibold"
                                                        style={{
                                                          padding: "10px",
                                                        }}
                                                      >
                                                        Organisational Measures
                                                      </h6>
                                                    </div>

                                                    <div>
                                                      <table className="min-w-full divide-y divide-gray-200">
                                                        <tbody>
                                                          {imptsk?.riskAnalysisList?.map(
                                                            (subs, index) =>
                                                              subs?.riskAnalysisSubTasks?.map(
                                                                (
                                                                  sub,
                                                                  subIndex
                                                                ) => (
                                                                  <div
                                                                    key={
                                                                      subIndex
                                                                    }
                                                                  >

                                                                    {sub
                                                                      ?.riskAnalysisHazardTypes
                                                                      ?.length ==
                                                                      0 ? (
                                                                      <>
                                                                        <div
                                                                          _ngcontent-fyk-c288=""
                                                                          class="flex items-center w-full  border-b justify-between"
                                                                        ></div>
                                                                        <div>
                                                                          <Grid
                                                                            container
                                                                            className="inventory-grid"
                                                                            sx={{
                                                                              paddingY: 2,
                                                                              paddingX:
                                                                              {
                                                                                xs: 2,
                                                                                md: 1,
                                                                              },
                                                                            }}
                                                                          >
                                                                            <Grid
                                                                              item
                                                                              xs={
                                                                                12
                                                                              }
                                                                              md={
                                                                                4
                                                                              }
                                                                            >
                                                                              <h6>
                                                                                {
                                                                                  sub?.subTaskName
                                                                                }
                                                                              </h6>
                                                                            </Grid>
                                                                          </Grid>
                                                                          <Grid
                                                                            container
                                                                            className="inventory-grid"
                                                                            sx={{
                                                                              paddingY: 2,
                                                                              paddingX:
                                                                              {
                                                                                xs: 2,
                                                                                md: 1,
                                                                              },
                                                                            }}
                                                                          >
                                                                            <Grid
                                                                              item
                                                                              xs={
                                                                                12
                                                                              }
                                                                              md={
                                                                                4
                                                                              }
                                                                            >
                                                                              <h6
                                                                                style={{
                                                                                  paddingBottom:
                                                                                    "5px",
                                                                                }}
                                                                                className="text-brown"
                                                                              >
                                                                                <b>
                                                                                  Risk
                                                                                  Analysis
                                                                                  not
                                                                                  done
                                                                                </b>
                                                                              </h6>
                                                                            </Grid>
                                                                          </Grid>
                                                                        </div>
                                                                      </>
                                                                    ) : (
                                                                      sub?.riskAnalysisHazardTypes?.map(
                                                                        (
                                                                          hazardType
                                                                        ) => (
                                                                          <div
                                                                            key={
                                                                              hazardType.id
                                                                            }
                                                                          >
                                                                            {hazardType?.riskAnalysisHazardSituation?.map(
                                                                              (
                                                                                situation
                                                                              ) => (
                                                                                <div
                                                                                  key={
                                                                                    situation.id
                                                                                  }
                                                                                >
                                                                                  <Grid
                                                                                    container
                                                                                    spacing={
                                                                                      2
                                                                                    }
                                                                                    className="inventory-grid"
                                                                                    sx={{
                                                                                      paddingY: 2,
                                                                                      paddingX:
                                                                                      {
                                                                                        xs: 2,
                                                                                        md: 3,
                                                                                      },
                                                                                    }}
                                                                                  >
                                                                                    <Grid
                                                                                      item
                                                                                      xs={
                                                                                        12
                                                                                      }
                                                                                      md={
                                                                                        3
                                                                                      }
                                                                                    >
                                                                                      <Typography
                                                                                        variant="body2"
                                                                                        color="text.primary"
                                                                                        fontWeight="fontWeightRegular"
                                                                                        style={{
                                                                                          backgroundColor:
                                                                                            situation?.residualRiskClassificationDisplay ===
                                                                                              "HighRisk"
                                                                                              ? "red"
                                                                                              : situation?.residualRiskClassificationDisplay ===
                                                                                                "LowRisk"
                                                                                                ? "yellow"
                                                                                                : situation?.residualRiskClassificationDisplay ===
                                                                                                  "AverageRisk"
                                                                                                  ? "orange"
                                                                                                  : situation?.residualRiskClassificationDisplay ===
                                                                                                    "SignificantRisk"
                                                                                                    ? "purple"
                                                                                                    : "green",
                                                                                          width:
                                                                                            "35%",
                                                                                          padding:
                                                                                            "3px",
                                                                                          color:
                                                                                            situation?.residualRiskClassificationDisplay ===
                                                                                              "LowRisk"
                                                                                              ? "#000"
                                                                                              : "white",
                                                                                          borderRadius:
                                                                                            "5px",
                                                                                          textAlign:
                                                                                            "center",
                                                                                          fontSize:
                                                                                            "12px",
                                                                                          fontWeight:
                                                                                            situation?.residualRiskClassificationDisplay ===
                                                                                              "LowRisk"
                                                                                              ? ""
                                                                                              : "bold",
                                                                                        }}
                                                                                      >
                                                                                        {
                                                                                          situation?.residualRiskClassificationDisplay
                                                                                        }
                                                                                      </Typography>
                                                                                    </Grid>
                                                                                    <Grid
                                                                                      item
                                                                                      xs={
                                                                                        12
                                                                                      }
                                                                                      md={
                                                                                        3
                                                                                      }
                                                                                    >
                                                                                      <Typography
                                                                                        variant="body2"
                                                                                        color="text.primary"
                                                                                        fontWeight="fontWeightRegular"
                                                                                        style={{
                                                                                          marginLeft:
                                                                                            "10px",
                                                                                          fontSize:
                                                                                            "12px",
                                                                                        }}
                                                                                      >
                                                                                        {
                                                                                          situation?.humanControlMeasure
                                                                                        }
                                                                                      </Typography>
                                                                                    </Grid>
                                                                                    <Grid
                                                                                      item
                                                                                      xs={
                                                                                        12
                                                                                      }
                                                                                      md={
                                                                                        3
                                                                                      }
                                                                                    >
                                                                                      <Typography
                                                                                        variant="body2"
                                                                                        color="text.primary"
                                                                                        fontWeight="fontWeightRegular"
                                                                                        style={{
                                                                                          marginLeft:
                                                                                            "42px",
                                                                                          fontSize:
                                                                                            "12px",
                                                                                        }}
                                                                                      >
                                                                                        {
                                                                                          situation?.technicalControlMeasure
                                                                                        }
                                                                                      </Typography>
                                                                                    </Grid>
                                                                                    <Grid
                                                                                      item
                                                                                      xs={
                                                                                        12
                                                                                      }
                                                                                      md={
                                                                                        3
                                                                                      }
                                                                                    >
                                                                                      <Typography
                                                                                        variant="body2"
                                                                                        color="text.primary"
                                                                                        fontWeight="fontWeightRegular"
                                                                                        style={{
                                                                                          marginLeft:
                                                                                            "82px",
                                                                                          fontSize:
                                                                                            "12px",
                                                                                        }}
                                                                                      >
                                                                                        {
                                                                                          situation.organisationalControlMeasure
                                                                                        }
                                                                                      </Typography>
                                                                                    </Grid>
                                                                                  </Grid>
                                                                                  <h6
                                                                                    style={{
                                                                                      paddingLeft:
                                                                                        "10px",
                                                                                      paddingBottom:
                                                                                        "5px",
                                                                                    }}
                                                                                  >
                                                                                    {
                                                                                      sub.subTaskName
                                                                                    }
                                                                                  </h6>
                                                                                  <h6
                                                                                    style={{
                                                                                      paddingLeft:
                                                                                        "10px",
                                                                                      paddingBottom:
                                                                                        "5px",
                                                                                    }}
                                                                                  >
                                                                                    -{" "}
                                                                                    {
                                                                                      hazardType.hazardTypeDisplay
                                                                                    }
                                                                                  </h6>
                                                                                  <h6
                                                                                    style={{
                                                                                      paddingLeft:
                                                                                        "10px",
                                                                                      paddingBottom:
                                                                                        "5px",
                                                                                    }}
                                                                                  >
                                                                                    -{" "}
                                                                                    {
                                                                                      situation.hazardousSituation
                                                                                    }
                                                                                  </h6>
                                                                                </div>
                                                                              )
                                                                            )}
                                                                          </div>
                                                                        )
                                                                      )
                                                                    )}
                                                                  </div>
                                                                )
                                                              )
                                                          )}
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                  </Paper>
                                                )}

                                              {imptsk.changeImpactTaskReviews
                                                ?.length > 0 || showReview ? (
                                                <div className="mt-12">
                                                  <Accordion
                                                    expanded={
                                                      expanded == imptsk.id
                                                    }
                                                    onChange={handleExpansionChange(
                                                      imptsk.id
                                                    )}
                                                  >
                                                    <AccordionSummary
                                                      expandIcon={
                                                        <ExpandMoreIcon />
                                                      }
                                                      aria-controls="panel1a-content"
                                                      id="panel1a-header"
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          AppActivity.canEdit
                                                            ? "space-between"
                                                            : "flex-start",
                                                      }}
                                                    >
                                                      {AppActivity.canEdit && (
                                                        <button
                                                          className="custom-add-review-button"
                                                          style={{
                                                            marginRight: 16,
                                                          }}
                                                        >
                                                          Add Review
                                                        </button>
                                                      )}
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          flexGrow: 1, // This makes the div take up remaining space
                                                          justifyContent:
                                                            AppActivity.canEdit
                                                              ? "flex-end"
                                                              : "flex-start",
                                                        }}
                                                      >
                                                        <Typography>
                                                          <span className="text-brown">
                                                            {
                                                              imptsk
                                                                ?.changeImpactTaskReviews
                                                                ?.length
                                                            }{" "}
                                                            Reviews
                                                          </span>{" "}
                                                          {hasAddedComment(
                                                            imptsk.changeImpactTaskReviews
                                                          ) && (
                                                              <span className="text-green">
                                                                (You have added 1
                                                                review)
                                                              </span>
                                                            )}
                                                        </Typography>
                                                      </div>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                      {AppActivity.canEdit &&
                                                        !hasAddedComment(
                                                          imptsk.changeImpactTaskReviews
                                                        ) && (
                                                          <div className="mat-form-field-wrapper">
                                                            <div className="mat-form-field-flex">
                                                              <img
                                                                src="/assets/images/etc/userpic.png"
                                                                alt="Card cover image"
                                                                className="rounded-full mr-4"
                                                                style={{
                                                                  width: "5rem",
                                                                  height:
                                                                    "5rem",
                                                                }}
                                                              />
                                                              <div
                                                                className="mat-form-field-infix"
                                                                style={{
                                                                  position:
                                                                    "relative",
                                                                  width: "100%",
                                                                }}
                                                              >
                                                                <textarea
                                                                  rows="2"
                                                                  className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                                                  placeholder="Write a comment..."
                                                                  id="ImpTaskReview265"
                                                                  data-placeholder="Write a comment..."
                                                                  aria-invalid="false"
                                                                  aria-required="false"
                                                                  style={{
                                                                    height:
                                                                      "36px",
                                                                  }}
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    setHandelCommentRemark(
                                                                      e.target
                                                                        .value
                                                                    )
                                                                  }
                                                                ></textarea>
                                                                <button
                                                                  className="custom-update-button"
                                                                  onClick={() =>
                                                                    handelImpactCommentImp(
                                                                      imptsk.id,
                                                                      1
                                                                    )
                                                                  }
                                                                >
                                                                  <span className="mat-button-wrapper">
                                                                    Save
                                                                  </span>
                                                                  <span className="mat-ripple mat-button-ripple"></span>
                                                                  <span className="mat-button-focus-overlay"></span>
                                                                </button>
                                                                <span className="mat-form-field-label-wrapper"></span>
                                                              </div>
                                                            </div>

                                                            <div className="mat-form-field-subscript-wrapper">
                                                              <div
                                                                className="mat-form-field-hint-wrapper"
                                                                style={{
                                                                  opacity: 1,
                                                                  transform:
                                                                    "translateY(0%)",
                                                                }}
                                                              ></div>
                                                            </div>
                                                          </div>
                                                        )}
                                                      {imptsk.changeImpactTaskReviews?.map(
                                                        (rwx, index) => (
                                                          <div
                                                            className="mat-form-field-wrapper"
                                                            key={index}
                                                          >
                                                            <div className="mat-form-field-flex">
                                                              <img
                                                                src="/assets/images/etc/userpic.png"
                                                                alt="Card cover image"
                                                                className="rounded-full mr-4"
                                                                style={{
                                                                  width: "3rem",
                                                                  height:
                                                                    "3rem",
                                                                }}
                                                              />
                                                              {AppActivity.canEdit &&
                                                                isMyComment(
                                                                  rwx
                                                                ) ? (
                                                                <div
                                                                  className="mat-form-field-infix"
                                                                  style={{
                                                                    position:
                                                                      "relative",
                                                                  }}
                                                                >
                                                                  <textarea
                                                                    ref={
                                                                      textareaRef
                                                                    }
                                                                    rows="2"
                                                                    className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                                                    placeholder="Write a comment..."
                                                                    id="ImpTaskReview265"
                                                                    data-placeholder="Write a comment..."
                                                                    aria-invalid="false"
                                                                    aria-required="false"
                                                                    style={{
                                                                      height:
                                                                        "36px",
                                                                      width:
                                                                        "100%",
                                                                      paddingRight:
                                                                        "100px",
                                                                    }}
                                                                    defaultValue={
                                                                      rwx?.remark
                                                                    }
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      setHandelCommentRemark(
                                                                        e.target
                                                                          .value
                                                                      )
                                                                    }
                                                                  ></textarea>

                                                                  <button
                                                                    className="custom-update-button"
                                                                    onClick={() => {
                                                                      handelImpactCommentImp(
                                                                        imptsk.id,
                                                                        // itm.changeImpactTaskReviews[0]
                                                                        //   .id,
                                                                        2
                                                                      );
                                                                      if (
                                                                        textareaRef.current
                                                                      ) {
                                                                        textareaRef.current.focus();
                                                                      }
                                                                    }}
                                                                  >
                                                                    Update
                                                                  </button>

                                                                  <span className="mat-form-field-label-wrapper"></span>
                                                                </div>
                                                              ) : (
                                                                <div className="mat-form-field-wrapper">
                                                                  <div className="mat-form-field-flex">
                                                                    <div>
                                                                      <div className="mat-form-field-infix mt-5">
                                                                        <span className="">
                                                                          {
                                                                            rwx?.createdByStaffName
                                                                          }
                                                                        </span>
                                                                        -{" "}
                                                                        <span className="text-grey">
                                                                          {
                                                                            rwx?.remark
                                                                          }
                                                                        </span>
                                                                      </div>
                                                                      <p
                                                                        className="mat-form-field-infix text-grey"
                                                                        style={{
                                                                          fontSize:
                                                                            "smaller",
                                                                        }}
                                                                      >
                                                                        {imptsk
                                                                          .changeImpactTaskReviews[0]
                                                                          ?.updatedAt &&
                                                                          new Date(
                                                                            imptsk.changeImpactTaskReviews[0]?.updatedAt
                                                                          ).toLocaleString(
                                                                            "en-US",
                                                                            {
                                                                              month:
                                                                                "long",
                                                                              day: "numeric",
                                                                              year: "numeric",
                                                                              hour: "numeric",
                                                                              minute:
                                                                                "numeric",
                                                                              second:
                                                                                "numeric",
                                                                              hour12: true,
                                                                              timeZoneName:
                                                                                "short",
                                                                            }
                                                                          )}
                                                                      </p>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              )}
                                                            </div>

                                                            <div className="mat-form-field-subscript-wrapper">
                                                              <div
                                                                className="mat-form-field-hint-wrapper"
                                                                style={{
                                                                  opacity: 1,
                                                                  transform:
                                                                    "translateY(0%)",
                                                                }}
                                                              ></div>
                                                            </div>
                                                          </div>
                                                        )
                                                      )}
                                                    </AccordionDetails>
                                                  </Accordion>
                                                </div>
                                              ) : AppActivity.canEdit ? (
                                                <div className="mat-form-field-wrapper mt-24">
                                                  <div className="mat-form-field-flex">
                                                    <img
                                                      src="/assets/images/etc/userpic.png"
                                                      alt="Card cover image"
                                                      className="rounded-full mr-4"
                                                      style={{
                                                        width: "5rem",
                                                        height: "5rem",
                                                      }}
                                                    />
                                                    <div
                                                      className="mat-form-field-infix"
                                                      style={{
                                                        position: "relative",
                                                        width: "100%",
                                                      }}
                                                    >
                                                      <textarea
                                                        rows="2"
                                                        className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize mt-0"
                                                        placeholder="Write a comment..."
                                                        id="ImpTaskReview265"
                                                        data-placeholder="Write a comment..."
                                                        aria-invalid="false"
                                                        aria-required="false"
                                                        style={{
                                                          height: "36px",
                                                        }}
                                                        onChange={(e) =>
                                                          setHandelCommentRemark(
                                                            e.target.value
                                                          )
                                                        }
                                                      ></textarea>
                                                      <button
                                                        className="custom-update-button"
                                                        onClick={() =>
                                                          handelImpactCommentImp(
                                                            imptsk.id,
                                                            1
                                                          )
                                                        }
                                                      >
                                                        <span className="mat-button-wrapper">
                                                          Save
                                                        </span>
                                                        <span className="mat-ripple mat-button-ripple"></span>
                                                        <span className="mat-button-focus-overlay"></span>
                                                      </button>
                                                      <span className="mat-form-field-label-wrapper"></span>
                                                    </div>
                                                  </div>

                                                  {/* <div className="mat-form-field-subscript-wrapper">
                                <div
                                  className="mat-form-field-hint-wrapper"
                                  style={{
                                    opacity: 1,
                                    transform: "translateY(0%)",
                                  }}
                                ></div>
                              </div> */}
                                                </div>
                                              ) : (
                                                <div className="ng-star-inserted">
                                                  <span
                                                    className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                                    style={{
                                                      padding: "10px",
                                                    }}
                                                  >
                                                    No Reviews Added
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </AccordionDetails>
                              </Accordion>
                            );
                          }
                        )
                      ) : (
                        <p>No tasks available</p>
                      )}
                    </tbody>

                    <tfoot
                      className="task-table-footer"
                      style={{
                        display: "none",
                        bottom: 0,
                        zIndex: 10,
                      }}
                    >
                      {/* Empty footer */}
                    </tfoot>
                  </table>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>

        <DocumentModal
          step={1}
          open={taskRespOpen}
          handleModalClose={handleRespModalClose}
          selectedFile={selectedRespFile}
          selectedDocument={selectedResDocument}
          handelDetailDoc={handelRespDetailDoc}
          listDocument={taskRespListDocument}
          openDrawer={openDrawerRes}
          setOpenDrawer={setOpenDrawerRes}
          handelFileDiscriptionChange={handelFileResDiscriptionChange}
          handleSubmitDocument={handleSubmitResponse}
          fileDetails={fileDetailsRes}
          setFileDetails={setFileDetailsRes}
          handleDownload={handleResDownload}
          handleDelete={handleResDelete}
          toggleDrawer={toggleDrawerRes}
          handelFileChange={handelRespFileChange}
          canExecute={AppActivity?.canExecute}
          formatDate={formatDate}
        />
        <DeleteModal
          openDelete={Resdeletes}
          handleCloseDelete={handleResCloseDelete}
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
              onClick={handleResCloseDelete}
            >
              Cancel
            </Button>
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              style={{ padding: "23px", backgroundColor: "red" }}
              type="submit"
              onClick={handleResSubmitDelete}
            >
              Confirm
            </Button>
          </div>
        </DeleteModal>

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
                  color: "white",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h5>Send for external consultation</h5>
                <Button onClick={handlehandledateExtendClose}>
                  <FuseSvgIcon size={25}>heroicons-outline:x</FuseSvgIcon>
                </Button>
              </Box>

              <Box sx={{ overflow: "auto", padding: "5px 30px 0 30px" }}>
                <Grid container spacing={2} className="mt-5">
                  <Grid item xs={12}>
                    <Table
                      className="mat-elevatio demo-table col-span-12 mt-0 w-full table_custome"
                      sx={{ width: "100%" }}
                    >
                      <TableHead
                        sx={{
                          borderBottom: "2px solid silver",
                          fontSize: "medium",
                        }}
                      >
                        <TableRow>
                          <TableCell className="text-left">Impact</TableCell>
                          <TableCell className="text-left">
                            What is the task
                          </TableCell>
                          <TableCell className="text-left">
                            How is the task done
                          </TableCell>
                          <TableCell className="text-left">
                            Task Deadline
                          </TableCell>
                          <TableCell className="text-left">
                            Task Assigned To
                          </TableCell>
                          <TableCell className="text-left">Due Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedTasks?.map((update) => (
                          <TableRow key={update.id}>
                            <TableCell
                              className="text-left"
                            // sx={{ border: "1px solid silver" }}
                            >
                              {update.impact}
                            </TableCell>
                            <TableCell
                              className="text-left"
                            // sx={{ border: "1px solid silver" }}
                            >
                              {update.task}
                            </TableCell>
                            <TableCell
                              className="text-left"
                            // sx={{ border: "1px solid silver" }}
                            >
                              {update.how}
                            </TableCell>
                            <TableCell
                              className="text-left"
                            // sx={{ border: "1px solid silver" }}
                            >
                              {update.deadline}
                            </TableCell>
                            <TableCell
                              className="text-left"
                            // sx={{ border: "1px solid silver" }}
                            >
                              {update.assignedTo}
                            </TableCell>
                            <TableCell
                              className="text-left"
                            // sx={{ border: "1px solid silver" }}
                            >
                              {formatDates(update.dueDate)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div>&nbsp;</div>
                    <Grid item xs={12} className="mt-5">
                      <FormControl fullWidth sx={{ flexGrow: 1 }}>
                        <InputLabel id="staff-label">Select Staff</InputLabel>
                        <Select
                          labelId="staff-label"
                          id="staff-select"
                          multiple
                          value={selectedStaff}
                          onChange={handleStaffChange}
                          renderValue={(selected) => (
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                              {selected.map((value) => (
                                <div key={value}>
                                  <ListItemText
                                    primary={
                                      staff.find(
                                        (staffMember) =>
                                          staffMember.value === value
                                      )?.text
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                        >
                          {staff.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Checkbox
                                checked={
                                  selectedStaff.indexOf(option.value) > -1
                                }
                              />
                              <ListItemText primary={option.text} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      className="mt-5"
                      style={{ marginTop: "10px" }}
                    >
                      <TextField
                        label="Email"
                        multiline
                        rows={1}
                        fullWidth
                        required
                        value={email}
                        onChange={handleEmailChange}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      className="mt-5"
                      style={{ marginTop: "10px" }}
                    >
                      <TextField
                        label="Comments"
                        // className={`${commentExtValidation ? "border border-red-500" : ""}`}
                        className="border-0"
                        multiline
                        rows={1}
                        fullWidth
                        required
                        value={comments}
                        onChange={handleCommentsChange}
                      />
                      <div className="mt-5 text-sm text-red-500">
                        {commentExtValidation}
                      </div>
                    </Grid>
                    <div
                      className="p-30 pt-24 pb-24"
                      style={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <div>
                        <Button
                          disabled={isLoading}
                          variant="contained"
                          style={{ color: "white", backgroundColor: "blue" }}
                          onClick={handleSubmit}
                        >
                          Send Email
                        </Button>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Fade>
        </Modal>
        <ToastContainer
          className="toast-container"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          closeButton={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Initiation
          contentDetailsini={contentDetailsini}
          assetEvaluationId={assetEvaluationId}
          contentDetailsT={contentDetails}
          contentDetailsDocu={contentDetails}
        />
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            // backgroundColor: "white",
            padding: "10px",
            display: showSendPopup ? "flex" : "none",
            justifyContent: "end",
            color: "white",
          }}
        >
          <Button
            className="whitespace-nowrap ms-5"
            variant="contained"
            color="secondary"
            style={{
              padding: "10px",
              borderRadius: "20px",
            }}
            onClick={handledateExtendopen}
          >
            Send selected {selectedTasks?.length} task(s) for external
            consultation
          </Button>
        </div>


        <SwipeableViews style={{ overflow: "hidden" }}>
          <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
            <div className="flex items-center w-full border-b justify-between p-30 pt-14 pb-14">
              <h2 className="text-2xl font-semibold">Change Evaluation Team</h2>
            </div>
            <div className="evaluation-team-container grid p-30 pt-24 pb-24 grid-cols-1 md:grid-cols-3 gap-4">
              {uniqueEvaluationTeam?.map((list, index) => (
                <div
                  className="inventory-grid grid items-center gap-4 py-3 px-2"
                  key={index}
                >
                  <div
                    className="flex items-center"
                    style={{ marginTop: "15px" }}
                  >
                    <img
                      src="/assets/images/etc/userpic.png"
                      alt="Card cover image"
                      className="rounded-full mr-4"
                      style={{ width: "4rem", height: "4rem" }}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold leading-none">
                        {list.staffName}
                      </span>
                      <span className="text-sm text-secondary leading-none pt-5">
                        {list?.roleName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Paper>
        </SwipeableViews>
        <SwipeableViews>
          <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full p-30 pt-12 pb-12 border-b justify-between"
            >
              <h2 className="text-2xl font-semibold">Stake Holders </h2>
              <TextField
                variant="filled"
                fullWidth
                placeholder="Search"
                // style={{ marginBottom: "15px" }}
                //   value={searchTerm}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ marginTop: "0px" }}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 320 }}
              />
            </div>
            {contentDetails?.consultaion?.map((itm) => (
              <div className="p-30 pt-24 pb-24">
                <div className="flex items-center">
                  <img
                    src="/assets/images/etc/userpic.png"
                    alt="Card cover image"
                    className="rounded-full mr-4"
                    style={{ width: "3.5rem", height: "3.5rem" }}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold leading-none">
                      {itm?.staff}
                    </span>
                    <span className="text-sm text-secondary leading-none pt-5">
                      Consulted On {formatDates(itm?.consultedDate)}
                    </span>
                  </div>
                  {itm.requestTypeName != "Document" && AppActivity.canEdit && (
                    <div className="task-button ml-auto">
                      <button
                        className="task-mark-reviewed-button mat-stroked-button cursor-pointer"
                        onClick={() => handelreview(itm.id)}
                        style={{
                          backgroundColor:
                            itm?.reviewd || clickedTasks[itm.id]
                              ? "rgba(220,252,231)"
                              : "",
                        }}
                      >
                        {itm?.reviewd || clickedTasks[itm.id] ? (
                          <span className="mat-button-wrapper">
                            You have reviewed this just now
                          </span>
                        ) : (
                          <span className="mat-button-wrapper">
                            Click here to mark as reviewed
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <div
                  className="flex items-center"
                  style={{ marginTop: "10px" }}
                >
                  <h5> {itm?.remark}</h5>
                </div>
                <div className="mt-5" style={{ marginTop: "20px" }}>
                  <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                    Task Added
                  </span>

                  <span className="task-detail-value">{itm.tasks[0]}</span>
                </div>
                <div>&nbsp;</div>
                {!AppActivity.canEdit && itm.reviews?.length == 0 && (
                  <span className="task-detail-value">No Reviews added</span>
                )}
                {itm.reviews?.length > 0 || showReview ? (
                  <div>
                    <Accordion
                      expanded={expanded == itm.id}
                      onChange={handleExpansionChange(itm.id)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        style={{
                          display: "flex",
                          justifyContent: AppActivity.canEdit
                            ? "space-between"
                            : "flex-start",
                        }}
                      >
                        {AppActivity.canEdit && (
                          <button
                            className="custom-add-review-button"
                            style={{ marginRight: 16 }}
                          >
                            Add Review
                          </button>
                        )}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1, // This makes the div take up remaining space
                            justifyContent: AppActivity.canEdit
                              ? "flex-end"
                              : "flex-start",
                          }}
                        >
                          <Typography>
                            <span
                              className="text-brown"
                              style={{ fontSize: "16px" }}
                            >
                              {itm?.reviews?.length} Review
                            </span>{" "}
                            {hasAddedComment(itm.reviews) && (
                              <span className="text-green">
                                (You have added 1 review)
                              </span>
                            )}
                          </Typography>
                        </div>
                      </AccordionSummary>

                      <AccordionDetails>
                        {AppActivity.canEdit &&
                          !hasAddedComment(itm.reviews) && (
                            <div className="mat-form-field-wrapper">
                              <div className="mat-form-field-flex">
                                <img
                                  src="/assets/images/etc/userpic.png"
                                  alt="Card cover image"
                                  className="rounded-full mr-4"
                                  style={{
                                    width: "5rem",
                                    height: "5rem",
                                  }}
                                />
                                <div
                                  className="mat-form-field-infix"
                                  style={{
                                    position: "relative",
                                    width: "100%",
                                  }}
                                >
                                  <textarea
                                    rows="2"
                                    className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                    placeholder="Write a comment..."
                                    id="ImpTaskReview265"
                                    data-placeholder="Write a comment..."
                                    aria-invalid="false"
                                    aria-required="false"
                                    style={{
                                      height: "36px",
                                      width: "100%",
                                      paddingRight: "100px",
                                      fontSize: "13px",
                                    }}
                                    value={handelCommentRemarks[itm.id] || ""}
                                    onChange={(e) =>
                                      setHandelCommentRemark(
                                        itm.id,
                                        e.target.value
                                      )
                                    }
                                  ></textarea>
                                  <button
                                    className="custom-update-button"
                                    style={
                                      !handelCommentRemarks[itm.id]?.trim()
                                        ? { backgroundColor: "#cdcdcd" }
                                        : {}
                                    }
                                    onClick={() =>
                                      handelCommentImp(itm.id, 1, 1)
                                    }
                                    disabled={
                                      !handelCommentRemarks[itm.id]?.trim()
                                    }
                                  >
                                    Save
                                  </button>
                                  <span className="mat-form-field-label-wrapper"></span>
                                </div>
                              </div>

                              <div className="mat-form-field-subscript-wrapper">
                                <div
                                  className="mat-form-field-hint-wrapper"
                                  style={{
                                    opacity: 1,
                                    transform: "translateY(0%)",
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        {itm?.reviews?.map((rwv, index) => (
                          <div className="mat-form-field-wrapper" key={index}>
                            <div className="mat-form-field-flex">
                              <img
                                src="/assets/images/etc/userpic.png"
                                alt="Card cover image"
                                className="rounded-full mr-4"
                                style={{
                                  width: "3rem",
                                  height: "3rem",
                                }}
                              />

                              {AppActivity.canEdit && isMyComment(rwv) ? (
                                <div
                                  className="mat-form-field-infix"
                                  style={{ position: "relative" }}
                                >
                                  <textarea
                                    ref={textareaRef}
                                    rows="2"
                                    className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                    placeholder="Write a comment..."
                                    id={`ImpTaskReview${index[itm.id]}`}
                                    data-placeholder="Write a comment..."
                                    aria-invalid="false"
                                    aria-required="false"
                                    style={{
                                      height: "36px",
                                      width: "100%",
                                      paddingRight: "100px",
                                      fontSize: "13px",
                                    }}
                                    value={handelCommentRemarks[itm.id] ? index[handelCommentRemarks[itm.id]] : rwv?.remark || ""}
                                    onChange={(e) =>
                                      setHandelCommentRemark(
                                        itm.id,
                                        e.target.value
                                      )
                                    }
                                  ></textarea>

                                  <button
                                    className="custom-update-button"
                                    onClick={() => {
                                      if (itm.reviews?.length > 0) {
                                        const reviewId =
                                          itm.reviews?.length === 1
                                            ? itm.reviews[0].id
                                            : itm.reviews[1].id;
                                        handelCommentImp(itm.id, reviewId, 2);
                                      } else {
                                        // Handle the case where there are no reviews
                                        console.error("No reviews available");
                                      }
                                      if (textareaRef.current) {
                                        textareaRef.current.focus();
                                      }
                                    }}
                                    style={
                                      !handelCommentRemarks[itm.id]?.trim()
                                        ? { backgroundColor: "#cdcdcd" }
                                        : {}
                                    }
                                    disabled={
                                      !handelCommentRemarks[itm.id]?.trim()
                                    }
                                  >
                                    Update
                                  </button>

                                  <span className="mat-form-field-label-wrapper"></span>
                                </div>
                              ) : (
                                <div className="mat-form-field-infix">
                                  <span
                                    className=""
                                    style={{ fontSize: "15px" }}
                                  >
                                    {rwv?.createdByStaffName + "55"}
                                  </span>
                                  &nbsp;&nbsp;
                                  <span
                                    className=" pl-1 text-gray"
                                    style={{ fontSize: "14px" }}
                                  >
                                    {rwv?.remark}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: "x-small",
                                paddingLeft: "35px",
                                fontSize: "13px",
                              }}
                            >
                              {" "}
                              {itm.reviews[0]?.updatedAt &&
                                new Date(
                                  itm.reviews[0]?.updatedAt
                                ).toLocaleString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  second: "numeric",
                                  hour12: true,
                                  timeZoneName: "short",
                                })}
                            </span>
                            <div className="mat-form-field-subscript-wrapper">
                              <div
                                className="mat-form-field-hint-wrapper"
                                style={{
                                  opacity: 1,
                                  transform: "translateY(0%)",
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ) : (
                  AppActivity.canEdit &&
                  !hasAddedComment(itm.reviews) && (
                    <div className="mat-form-field-wrapper">
                      <div className="mat-form-field-flex">
                        <img
                          src="/assets/images/etc/userpic.png"
                          alt="Card cover image"
                          className="rounded-full mr-4"
                          style={{
                            width: "5rem",
                            height: "5rem",
                          }}
                        />
                        <div
                          className="mat-form-field-infix"
                          style={{ position: "relative", width: "100%" }}
                        >
                          <textarea
                            rows="2"
                            className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                            placeholder="Write a comment..."
                            id="ImpTaskReview265"
                            data-placeholder="Write a comment..."
                            aria-invalid="false"
                            aria-required="false"
                            style={{
                              height: "36px",
                              width: "100%",
                              paddingRight: "100px",
                              fontSize: "13px",
                            }}
                            value={handelCommentRemarks[itm.id] || ""}
                            onChange={(e) =>
                              setHandelCommentRemark(itm.id, e.target.value)
                            }
                          ></textarea>
                          <button
                            className="custom-update-button"
                            onClick={() => handelCommentImp(itm.id, 1, 1)}
                            style={
                              !handelCommentRemarks[itm.id]?.trim()
                                ? { backgroundColor: "#cdcdcd" }
                                : {}
                            }
                            disabled={!handelCommentRemarks[itm.id]?.trim()}
                          >
                            Save
                          </button>
                          <span className="mat-form-field-label-wrapper"></span>
                        </div>
                      </div>

                      <div className="mat-form-field-subscript-wrapper">
                        <div
                          className="mat-form-field-hint-wrapper"
                          style={{
                            opacity: 1,
                            transform: "translateY(0%)",
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
          </Paper>
        </SwipeableViews>
        <SwipeableViews>
          {!risk ? (
            <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full p-30 pt-12 pb-12 border-b justify-between"
              >
                <h2 className="text-2xl font-semibold">Evaluation Impacts</h2>
                {/* <Button
                    
                    className="whitespace-nowrap ms-5"
                    variant="contained"
                    color="secondary"
                    
                    onClick={
                      handelOpenAiModal
                    }
                  >
                    Open AI
                  </Button> */}
                <TextField
                  variant="filled"
                  fullWidth
                  placeholder="Search"
                  // style={{ marginBottom: "15px" }}
                  //   value={searchTerm}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ marginTop: "0px" }}
                      >
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 320 }}
                />
              </div>
              <div className="p-30 pt-24 pb-24">
                {showRiskAnalysisChart && (
                  <div id="chart" class="mb-2 mt-2 p-2">
                    <Chart
                      options={{
                        ...riskAnalysisChartOptions,
                        annotations: riskAnalysisChartOptions.annotations || {},
                        dataLabels: riskAnalysisChartOptions.dataLabels || {},
                        grid: riskAnalysisChartOptions.grid || {},
                        stroke: riskAnalysisChartOptions.stroke || {},
                        title: riskAnalysisChartOptions.title || {},
                        xaxis: riskAnalysisChartOptions.xaxis || {},
                      }}
                      series={riskAnalysisChartOptions.series || []}
                      type={riskAnalysisChartOptions.chart.type || "scatter"}
                      height={riskAnalysisChartOptions.chart.height || 350}
                    />
                  </div>
                )}

                <table className="task-table mat-table task_table">
                  <thead
                    className="task-table-header"
                    style={{ display: "none" }}
                  >
                    {/* Empty header */}
                  </thead>
                  <tbody className="task-table-body">
                    {contentDetails?.tasklist ? (
                      contentDetails?.tasklist?.map((imptsk) => (
                        <div key={imptsk.id} className="mt-24 border-b pb-24">
                          <div className="task-table-row mat-row">
                            <div className="task-table-cell mat-cell">
                              <div className="task-header p-0 flex items-center">
                                <div className="task-id flex flex-col">
                                  <span
                                    className="task-id-text font-semibold text-xl leading-none"
                                    style={{ fontSize: "20px" }}
                                  >
                                    Task #{imptsk?.sourceTaskId}
                                  </span>
                                </div>

                                {imptsk.requestTypeName != "Document" &&
                                  AppActivity.canEdit && (
                                    <div className="task-button ml-auto">
                                      <button
                                        className="task-mark-reviewed-button mat-stroked-button cursor-pointer"
                                        onClick={() =>
                                          handelImpactreview(imptsk.id)
                                        }
                                        disabled={
                                          imptsk?.reviewd ||
                                          clickedTasks[imptsk.id]
                                        }
                                        style={{
                                          backgroundColor:
                                            imptsk?.reviewd ||
                                              clickedTasks[imptsk.id]
                                              ? "rgba(220,252,231)"
                                              : "",
                                        }}
                                      >
                                        {imptsk?.reviewd ||
                                          clickedTasks[imptsk.id] ? (
                                          <span className="mat-button-wrapper">
                                            You have reviewed this just now
                                          </span>
                                        ) : (
                                          <span className="mat-button-wrapper">
                                            Click here to mark as reviewed
                                          </span>
                                        )}
                                      </button>
                                    </div>
                                  )}
                              </div>
                              {imptsk.sourceTaskId !== imptsk.id &&
                                (!imptsk.showPreviousTasks ||
                                  imptsk.showPreviousTasks === null) && (
                                  <span
                                    className="text-sm text-secondary text-blue-500 font-bold cursor-pointer leading-none mt-1 ms-3"
                                    onClick={() => toggleDetails(imptsk.id)}
                                  >
                                    {selectedTaskId !== imptsk.id
                                      ? "Show previous versions"
                                      : "Hide previous versions"}
                                  </span>
                                )}

                              {selectedTaskId === imptsk.id &&
                                previousTasks[imptsk.id] &&
                                previousTasks[imptsk.id].map((itm) => (
                                  <div
                                    className="task-details px-0 mt-0 pt-0 border "
                                    key={itm.id}
                                  >
                                    <div class="mt-5 ms-9 font-semibold">
                                      V{itm.evaluationVersion}
                                    </div>
                                    <div className="task-detail prose prose-sm max-w-5xl mt-0 pt-0">
                                      <div className="task-detail-item mt-0 pt-0">
                                        <span className="task-detail-label bg-default d-inline-block mt-10 rounded text-secondary font-semibold">
                                          Impact
                                        </span>
                                        <span className="task-detail-value d-inline-block mt-5">
                                          {itm.particularName +
                                            ">" +
                                            itm.particularSubName}
                                        </span>
                                      </div>
                                      <div className="task-detail-item mt-0">
                                        <span className="task-detail-label bg-default d-inline-block mt-3 rounded text-secondary font-semibold">
                                          What is Task
                                        </span>
                                        <span className="task-detail-value d-inline-block mt-3">
                                          {itm.actionWhat}
                                        </span>
                                      </div>
                                      <div className="task-detail-item mt-0">
                                        <span className="task-detail-label bg-default d-inline-block mt-3 rounded text-secondary font-semibold">
                                          How is Task done
                                        </span>
                                        <span className="task-detail-value d-inline-block mt-3">
                                          {itm.actionHow}
                                        </span>
                                      </div>
                                      <div className="task-detail-item mt-0">
                                        <span className="task-detail-label bg-default d-inline-block  rounded text-secondary font-semibold">
                                          Assigned to
                                        </span>
                                        <span className="task-detail-value d-inline-block mt-3">
                                          {itm.assignedStaff}
                                        </span>
                                        <span className="task-detail-label bg-default rounded ml-2 d-inline-block mt-3 text-secondary font-semibold">
                                          Due Date
                                        </span>
                                        <span className="task-detail-value d-inline-block mt-3">
                                          {formatDates(itm.dueDate)}
                                        </span>
                                        <span className="task-detail-label bg-default rounded ml-2 d-inline-block mt-3 text-secondary font-semibold">
                                          Deadline
                                        </span>
                                        <span className="task-detail-value d-inline-block mt-3">
                                          {itm?.deadlineDisplay}
                                        </span>
                                      </div>
                                    </div>

                                    {itm?.changeImpactTaskReviews?.length !=
                                      0 && (
                                        <Accordion
                                          expanded={expanded === "panel2"}
                                          onChange={handleExpansionChange(
                                            "panel2"
                                          )}
                                          className="mt-6 m-10"
                                        >
                                          <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                          >
                                            <Typography>
                                              <span
                                                className="text-brown"
                                                style={{ fontSize: "16px" }}
                                              >
                                                {
                                                  itm?.changeImpactTaskReviews
                                                    ?.length
                                                }{" "}
                                                Reviews
                                              </span>{" "}
                                            </Typography>
                                          </AccordionSummary>
                                          {itm?.changeImpactTaskReviews?.map(
                                            (rivew) => (
                                              <AccordionDetails>
                                                <div className="mat-form-field-wrapper">
                                                  <div className="mat-form-field-flex">
                                                    <img
                                                      src="/assets/images/etc/userpic.png"
                                                      alt="Card cover image"
                                                      className="rounded-full mr-4"
                                                      style={{
                                                        width: "3rem",
                                                        height: "3rem",
                                                      }}
                                                    />
                                                    <div>
                                                      <div className="mat-form-field-infix mt-5">
                                                        <span
                                                          className=""
                                                          style={{
                                                            fontSize: "15px",
                                                          }}
                                                        >
                                                          {
                                                            rivew?.createdByStaffName
                                                          }
                                                        </span>
                                                        -{" "}
                                                        <span
                                                          className="text-grey"
                                                          style={{
                                                            fontSize: "14px",
                                                          }}
                                                        >
                                                          {rivew?.remark}
                                                        </span>
                                                      </div>
                                                      <p
                                                        className="mat-form-field-infix text-grey"
                                                        style={{
                                                          fontSize: "13px",
                                                        }}
                                                      >
                                                        {rivew?.updatedAt
                                                          ? new Date(
                                                            rivew.updatedAt
                                                          ).toLocaleString(
                                                            "en-US",
                                                            {
                                                              year: "numeric", // e.g., "2024"
                                                              month: "long", // e.g., "August"
                                                              day: "numeric", // e.g., "20"
                                                              hour: "2-digit", // e.g., "12 PM"
                                                              minute: "2-digit", // e.g., "46"
                                                              second: "2-digit", // e.g., "23"
                                                              hour12: true, // Use 12-hour clock
                                                              timeZoneName:
                                                                "short", // e.g., "GMT+5"
                                                            }
                                                          )
                                                          : null}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </AccordionDetails>
                                            )
                                          )}
                                        </Accordion>
                                      )}
                                  </div>
                                ))}
                              <div className="task-details p-0">
                                <div className="task-detail prose prose-sm max-w-5xl">
                                  <div className="task-detail-item p-0 mt-0">
                                    <span className="task-detail-label bg-default rounded  d-inline-block mt-10 text-secondary font-semibold">
                                      Impact
                                    </span>
                                    <span className="task-detail-value d-inline-block mt-10">
                                      {imptsk.particularName +
                                        ">" +
                                        imptsk.particularSubName}
                                    </span>
                                  </div>
                                  <div className="task-detail-item p-0 mt-0">
                                    <span className="task-detail-label bg-default rounded  d-inline-block mt-10 text-secondary font-semibold">
                                      What is Task
                                    </span>
                                    <span className="task-detail-value d-inline-block mt-10">
                                      {imptsk.actionWhat}
                                    </span>
                                  </div>
                                  <div className="task-detail-item p-0 mt-0">
                                    <span className="task-detail-label bg-default rounded  d-inline-block mt-10 text-secondary font-semibold">
                                      How is Task done
                                    </span>
                                    <span className="task-detail-value d-inline-block mt-10">
                                      {imptsk.actionHow}
                                    </span>
                                  </div>
                                  <div
                                    className="task-detail-item p-0 mt-0 flex "
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div>
                                      <span className="task-detail-label bg-default rounded d-inline-block mt-10 text-secondary font-semibold">
                                        Assigned to
                                      </span>
                                      <span className="task-detail-value d-inline-block mt-10">
                                        {imptsk.assignedStaff}
                                      </span>
                                      <span className="task-detail-label bg-default rounded  d-inline-block mt-10 ml-2 text-secondary font-semibold">
                                        Due Date
                                      </span>
                                      <span className="task-detail-value d-inline-block mt-10">
                                        {formatDates(imptsk.dueDate)}
                                      </span>
                                      <span className="task-detail-label bg-default rounded  d-inline-block mt-10 ml-2 text-secondary font-semibold">
                                        Deadline
                                      </span>
                                      <span className="task-detail-value d-inline-block mt-10">
                                        {imptsk?.deadlineDisplay}
                                      </span>
                                    </div>
                                    <div>
                                      {AppActivity.canEdit && (
                                        <div style={{ float: "right" }}>
                                          <FormGroup>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  onChange={(e) =>
                                                    handleCheckboxChange(
                                                      e.target.checked,
                                                      {
                                                        id: imptsk.id,
                                                        impact:
                                                          imptsk.particularName +
                                                          ">" +
                                                          imptsk.particularSubName,
                                                        task: imptsk.actionWhat,
                                                        how: imptsk.actionHow,
                                                        assignedTo:
                                                          imptsk.assignedStaff,
                                                        dueDate: formatDates(
                                                          imptsk.dueDate
                                                        ),
                                                        deadline:
                                                          imptsk.deadlineDisplay,
                                                        taskId: imptsk?.id,
                                                      }
                                                    )
                                                  }
                                                  id="check289-input"
                                                  inputProps={{
                                                    "aria-label":
                                                      "primary checkbox",
                                                  }}
                                                  color="primary"
                                                />
                                              }
                                              label="Need External Consultation"
                                            />
                                          </FormGroup>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {imptsk?.riskAnalysisList?.length !== 0 &&
                                  imptsk?.particularid === 78 && (
                                    <RiskAnalysisTableView
                                      Paper={Paper}
                                      matchingRisks={imptsk?.riskAnalysisList}
                                      currentActivityForm={currentActivityForm}
                                      handelViewDetails={handelViewDetails}
                                    />
                                  )}

                                {imptsk.changeImpactTaskReviews?.length > 0 ||
                                  showReview ? (
                                  <div className="mt-12">
                                    <Accordion
                                      expanded={expanded == imptsk.id}
                                      onChange={handleExpansionChange(
                                        imptsk.id
                                      )}
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        style={{
                                          display: "flex",
                                          justifyContent: AppActivity.canEdit
                                            ? "space-between"
                                            : "flex-start",
                                        }}
                                      >
                                        {AppActivity.canEdit && (
                                          <button
                                            className="custom-add-review-button"
                                            style={{ marginRight: 16 }}
                                          >
                                            Add Review
                                          </button>
                                        )}
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexGrow: 1, // This makes the div take up remaining space
                                            justifyContent: AppActivity.canEdit
                                              ? "flex-end"
                                              : "flex-start",
                                          }}
                                        >
                                          <Typography>
                                            <span
                                              className="text-brown"
                                              style={{ fontSize: "16px" }}
                                            >
                                              {
                                                imptsk?.changeImpactTaskReviews
                                                  ?.length
                                              }{" "}
                                              Reviews
                                            </span>{" "}
                                            {hasAddedComment(
                                              imptsk.changeImpactTaskReviews
                                            ) && (
                                                <span className="text-green">
                                                  (You have added 1 review)
                                                </span>
                                              )}
                                          </Typography>
                                        </div>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        {AppActivity.canEdit &&
                                          !hasAddedComment(
                                            imptsk.changeImpactTaskReviews
                                          ) && (
                                            <div className="mat-form-field-wrapper">
                                              <div className="mat-form-field-flex">
                                                <img
                                                  src="/assets/images/etc/userpic.png"
                                                  alt="Card cover image"
                                                  className="rounded-full mr-4"
                                                  style={{
                                                    width: "5rem",
                                                    height: "5rem",
                                                  }}
                                                />
                                                <div
                                                  className="mat-form-field-infix"
                                                  style={{
                                                    position: "relative",
                                                    width: "100%",
                                                  }}
                                                >
                                                  <textarea
                                                    rows="2"
                                                    className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                                    placeholder="Write a comment..."
                                                    id="ImpTaskReview265"
                                                    data-placeholder="Write a comment..."
                                                    aria-invalid="false"
                                                    aria-required="false"
                                                    style={{
                                                      height: "36px",
                                                      fontSize: "13px",
                                                    }}
                                                    value={
                                                      handelCommentRemarks[
                                                      imptsk.id
                                                      ] || ""
                                                    }
                                                    onChange={(e) =>
                                                      setHandelCommentRemark(
                                                        imptsk.id,
                                                        e.target.value
                                                      )
                                                    }
                                                  ></textarea>
                                                  <button
                                                    className="custom-update-button"
                                                    style={
                                                      !handelCommentRemarks[
                                                        imptsk.id
                                                      ]?.trim()
                                                        ? {
                                                          backgroundColor:
                                                            "#cdcdcd",
                                                        }
                                                        : {}
                                                    }
                                                    onClick={() =>
                                                      handelImpactCommentImp(
                                                        imptsk.id,
                                                        1
                                                      )
                                                    }
                                                    disabled={
                                                      !handelCommentRemarks[
                                                        imptsk.id
                                                      ]?.trim()
                                                    }
                                                  >
                                                    <span className="mat-button-wrapper">
                                                      Save
                                                    </span>
                                                    <span className="mat-ripple mat-button-ripple"></span>
                                                    <span className="mat-button-focus-overlay"></span>
                                                  </button>
                                                  <span className="mat-form-field-label-wrapper"></span>
                                                </div>
                                              </div>

                                              <div className="mat-form-field-subscript-wrapper">
                                                <div
                                                  className="mat-form-field-hint-wrapper"
                                                  style={{
                                                    opacity: 1,
                                                    transform: "translateY(0%)",
                                                  }}
                                                ></div>
                                              </div>
                                            </div>
                                          )}
                                        {imptsk.changeImpactTaskReviews?.map(
                                          (rwx, index) => (
                                            <div
                                              className="mat-form-field-wrapper"
                                              key={index}
                                            >
                                              <div className="mat-form-field-flex">
                                                <img
                                                  src="/assets/images/etc/userpic.png"
                                                  alt="Card cover image"
                                                  className="rounded-full mr-4"
                                                  style={{
                                                    width: "3rem",
                                                    height: "3rem",
                                                  }}
                                                />
                                                {AppActivity.canEdit &&
                                                  isMyComment(rwx) ? (
                                                  <div
                                                    className="mat-form-field-infix"
                                                    style={{
                                                      position: "relative",
                                                    }}
                                                  >
                                                    <textarea
                                                      ref={textareaRef}
                                                      rows="2"
                                                      className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                                      placeholder="Write a comment..."
                                                      id={`ImpTaskReview${index[imptsk.id]}`}
                                                      data-placeholder="Write a comment..."
                                                      aria-invalid="false"
                                                      aria-required="false"
                                                      style={{
                                                        height: "36px",
                                                        width: "100%",
                                                        paddingRight: "100px",
                                                        fontSize: "13px",
                                                      }}
                                                      value={handelCommentRemarks[imptsk.id] ? index[handelCommentRemarks[imptsk.id]] : rwx?.remark || ""}
                                                      onChange={(e) =>
                                                        setHandelCommentRemark(
                                                          imptsk.id,
                                                          e.target.value
                                                        )
                                                      }
                                                    ></textarea>

                                                    <button
                                                      className="custom-update-button"
                                                      onClick={() => {
                                                        handelImpactCommentImp(
                                                          imptsk.id,
                                                          // itm.changeImpactTaskReviews[0]
                                                          //   .id,
                                                          2
                                                        );
                                                        if (
                                                          textareaRef.current
                                                        ) {
                                                          textareaRef.current.focus();
                                                        }
                                                      }}
                                                      style={
                                                        !handelCommentRemarks[
                                                          imptsk.id
                                                        ]?.trim()
                                                          ? {
                                                            backgroundColor:
                                                              "#cdcdcd",
                                                          }
                                                          : {}
                                                      }
                                                      disabled={
                                                        !handelCommentRemarks[
                                                          imptsk.id
                                                        ]?.trim()
                                                      }
                                                    >
                                                      Update
                                                    </button>
                                                    <span className="mat-form-field-label-wrapper"></span>
                                                  </div>
                                                ) : (
                                                  <div className="mat-form-field-wrapper">
                                                    <div className="mat-form-field-flex">
                                                      <div>
                                                        <div className="mat-form-field-infix mt-5">
                                                          <span
                                                            className=""
                                                            style={{
                                                              fontSize: "15px",
                                                            }}
                                                          >
                                                            {
                                                              rwx?.createdByStaffName
                                                            }
                                                          </span>
                                                          -{" "}
                                                          <span
                                                            className="text-grey"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            {rwx?.remark}
                                                          </span>
                                                        </div>
                                                        <p
                                                          className="mat-form-field-infix text-black"
                                                          style={{
                                                            fontSize: "13px",
                                                          }}
                                                        >
                                                          {imptsk
                                                            .changeImpactTaskReviews[0]
                                                            ?.updatedAt &&
                                                            new Date(
                                                              imptsk.changeImpactTaskReviews[0]?.updatedAt
                                                            ).toLocaleString(
                                                              "en-US",
                                                              {
                                                                month: "long",
                                                                day: "numeric",
                                                                year: "numeric",
                                                                hour: "numeric",
                                                                minute:
                                                                  "numeric",
                                                                second:
                                                                  "numeric",
                                                                hour12: true,
                                                                timeZoneName:
                                                                  "short",
                                                              }
                                                            )}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              {AppActivity.canEdit &&
                                                isMyComment(rwx) && (
                                                  <p
                                                    className="mat-form-field-infix text-black"
                                                    style={{
                                                      fontSize: "13px",
                                                      paddingLeft: "40px",
                                                    }}
                                                  >
                                                    {imptsk
                                                      .changeImpactTaskReviews[0]
                                                      ?.updatedAt &&
                                                      new Date(
                                                        imptsk.changeImpactTaskReviews[0]?.updatedAt
                                                      ).toLocaleString(
                                                        "en-US",

                                                        {
                                                          month: "long",

                                                          day: "numeric",

                                                          year: "numeric",

                                                          hour: "numeric",

                                                          minute: "numeric",

                                                          second: "numeric",

                                                          hour12: true,

                                                          timeZoneName: "short",
                                                        }
                                                      )}
                                                  </p>
                                                )}

                                              <div className="mat-form-field-subscript-wrapper">
                                                <div
                                                  className="mat-form-field-hint-wrapper"
                                                  style={{
                                                    opacity: 1,
                                                    transform: "translateY(0%)",
                                                  }}
                                                ></div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </AccordionDetails>
                                    </Accordion>
                                  </div>
                                ) : AppActivity.canEdit ? (
                                  <div className="mat-form-field-wrapper mt-24">
                                    <div className="mat-form-field-flex">
                                      <img
                                        src="/assets/images/etc/userpic.png"
                                        alt="Card cover image"
                                        className="rounded-full mr-4"
                                        style={{
                                          width: "5rem",
                                          height: "5rem",
                                        }}
                                      />
                                      <div
                                        className="mat-form-field-infix"
                                        style={{
                                          position: "relative",
                                          width: "100%",
                                        }}
                                      >
                                        <textarea
                                          rows="2"
                                          className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize mt-0"
                                          placeholder="Write a comment..."
                                          id="ImpTaskReview265"
                                          data-placeholder="Write a comment..."
                                          aria-invalid="false"
                                          aria-required="false"
                                          style={{
                                            height: "36px",
                                            fontSize: "13px",
                                          }}
                                          value={
                                            handelCommentRemarks[imptsk.id] ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            setHandelCommentRemark(
                                              imptsk.id,
                                              e.target.value
                                            )
                                          }
                                        ></textarea>
                                        <button
                                          className="custom-update-button"
                                          style={
                                            !handelCommentRemarks[
                                              imptsk.id
                                            ]?.trim()
                                              ? { backgroundColor: "#cdcdcd" }
                                              : {}
                                          }
                                          onClick={() =>
                                            handelImpactCommentImp(imptsk.id, 1)
                                          }
                                          disabled={
                                            !handelCommentRemarks[
                                              imptsk.id
                                            ]?.trim()
                                          }
                                        >
                                          <span className="mat-button-wrapper">
                                            Save
                                          </span>
                                          <span className="mat-ripple mat-button-ripple"></span>
                                          <span className="mat-button-focus-overlay"></span>
                                        </button>
                                        <span className="mat-form-field-label-wrapper"></span>
                                      </div>
                                    </div>

                                    {/* <div className="mat-form-field-subscript-wrapper">
                              <div
                                className="mat-form-field-hint-wrapper"
                                style={{
                                  opacity: 1,
                                  transform: "translateY(0%)",
                                }}
                              ></div>
                            </div> */}
                                  </div>
                                ) : (
                                  <div className="ng-star-inserted">
                                    <span
                                      className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                      style={{
                                        padding: "10px",
                                      }}
                                    >
                                      No Reviews Added
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No tasks available</p>
                    )}
                  </tbody>

                  <tfoot
                    className="task-table-footer"
                    style={{
                      display: "none",
                      bottom: 0,
                      zIndex: 10,
                    }}
                  >
                    {/* Empty footer */}
                  </tfoot>
                </table>
                {/* <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full  border-b justify-between"
              ></div> */}
              </div>
            </Paper>
          ) : (
            <RiskAnalysis
              goBack={goBack}
              viewrisk={viewrisk}
              subTaskDetail={subTaskDetail}
              handleChangeImpact={handleChangeImpact}
              TaskhazardRiskView={""}
              TaskhazardRiskApi={TaskhazardRiskApi}
              TaskhazardRiskViewName={TaskhazardRiskViewName}
              generalGuidePdf={generalGuidePdf}
              handleGeneralGuideClick={handleGeneralGuideClick}
              formValues={formValues}
              hazaid={""}
              subTaskhazardDetail={subTaskhazardDetail}
              handleInputChangeHazard={handleInputChangeHazard}
              errorsSub={errorsSub}
              handelRiskInputChange={handelRiskInputChange}
              potentialTimeDetails={potentialTimeDetails}
              potentialFrequencyDetails={potentialFrequencyDetails}
              likelihoodValues={likelihoodValues}
              handelResidualRiskInputChange={handelResidualRiskInputChange}
              Classifications={Classifications}
              editRiskAnalysDetail={editRiskAnalysDetail}
              handelRiskSubmit={handelRiskSubmit}
              showEditRemove={false}
            />
          )}
        </SwipeableViews>
        <SwipeableViews>
          <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full p-30 pt-12 pb-12 border-b justify-between"
            >
              <h2 className="text-2xl font-semibold">
                External Consultations for Tasks
              </h2>
              <TextField
                variant="filled"
                fullWidth
                placeholder="Search"
                // style={{ marginBottom: "15px" }}
                //   value={searchTerm}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ marginTop: "0px" }}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 320 }}
              />
            </div>
            <div className="p-30 pt-24 pb-24">
              {contentDetails?.externalconsultations?.map((imptsk) => (
                <>
                  <table className="task-table mat-table">
                    <thead
                      className="task-table-header"
                      style={{ display: "none" }}
                    >
                      {/* Empty header */}
                    </thead>
                    <tbody className="task-table-body">
                      <tr className="task-table-row mat-row">
                        <td className="task-table-cell mat-cell">
                          <div className="task-header flex items-center">
                            <div className="task-id flex flex-col">
                              <span
                                className="task-id-text font-semibold text-xl leading-none"
                                style={{ fontSize: "20px" }}
                              >
                                Task #{imptsk?.taskIDs}
                              </span>

                              <span
                                className="task-id-text font-semibold leading-none ps-3"
                                style={{ font: "menu" }}
                              >
                                Initiated by {imptsk?.createdBy} on{" "}
                                {formatDatess(imptsk?.externalconsultationDate)}
                              </span>
                            </div>
                            <div className="task-button ml-auto">
                              <button
                                className="task-mark-reviewed-button mat-stroked-button"
                                onClick={(e) => TaskDocuHandle(imptsk.id)}
                              >
                                <span className="mat-button-wrapper">
                                  {imptsk?.documents == 0
                                    ? "No Responses"
                                    : `${imptsk?.documents} Responses`}
                                </span>
                              </button>
                            </div>
                          </div>
                          <div className="task-details px-6 mt-2">
                            <div className="task-detail prose prose-sm max-w-5xl">
                              <div className="task-detail-item mt-3">
                                <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                  Staff Email Ids
                                </span>
                                <span className="task-detail-value">
                                  {imptsk.staffEmailIDs}
                                </span>
                              </div>
                              <div className="task-detail-item mt-5">
                                <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                  External Email Ids
                                </span>
                                <span className="task-detail-value">
                                  {imptsk.externalEmailIDs}
                                </span>
                              </div>
                              <div className="task-detail-item mt-5">
                                <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                  Comments
                                </span>
                                <span className="task-detail-value">
                                  {imptsk.remark}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot
                      className="task-table-footer"
                      style={{
                        display: "none",
                        bottom: 0,
                        zIndex: 10,
                      }}
                    >
                      {/* Empty footer */}
                    </tfoot>
                  </table>
                  <div
                    _ngcontent-fyk-c288=""
                    class="flex items-center w-full border-b m-7 justify-between"
                  ></div>
                </>
              ))}
              {contentDetails?.externalconsultations?.length == 0 && (
                <span className="mt-5">No external consultations found.</span>
              )}
            </div>
          </Paper>
        </SwipeableViews>
        <SwipeableViews>
          <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full p-30 pt-14 pb-14 border-b justify-between"
            >
              <h2 className="text-2xl font-semibold">Approval</h2>
            </div>
            <div className="p-30 pt-24 pb-24 border-b ">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Consultation Comment</TableCell>
                        </TableRow>
                      </TableHead>
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full  border-b justify-between"
                      ></div>
                      {AppActivity.canEdit && (
                        <TableBody>
                          {remarkRequest.map(
                            (remark, index) =>
                              remark.evaluationTypeString === "Consultaion" && (
                                <TableRow key={index}>
                                  <TableCell>
                                    <TextField
                                      id={`tasks-comment-${index}`}
                                      label="Write your consultation comments..."
                                      multiline
                                      rows={1}
                                      fullWidth
                                      sx={{
                                        "& .MuiInputBase-root": {
                                          height: "auto",
                                        },
                                        "& .MuiInputBase-inputMultiline": {
                                          height: "100px", // Set desired height here
                                        },
                                      }}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment
                                            position="end"
                                            style={{ height: "90px" }}
                                          >
                                            <Button
                                              variant="contained"
                                              color="secondary"
                                              style={{
                                                float: "right",

                                                marginBottom: "3px",
                                              }}
                                              // Add functionality to update the comment here if needed
                                              onClick={() =>
                                                handleUpdateClick(
                                                  index,
                                                  remark.id
                                                )
                                              }
                                            >
                                              Update
                                            </Button>
                                          </InputAdornment>
                                        ),
                                      }}
                                      value={remark.remark}
                                      onChange={(event) =>
                                        handleRemarkChange(index, event)
                                      }
                                    />
                                    <h6 className="ps-4 pt-6 text-grey">
                                      {remark.createdBy +
                                        "-" +
                                        formatDates(remark.createdAt)}
                                    </h6>
                                  </TableCell>
                                </TableRow>
                              )
                          )}
                          <TableRow>
                            <TableCell>
                              <TextField
                                id="tasks-comment-new"
                                label="Write your Consultation comments..."
                                multiline
                                rows={1}
                                fullWidth
                                value={newRemark}
                                onChange={(event) =>
                                  handleInputChange(event, "Consultaion")
                                }
                                sx={{
                                  "& .MuiInputBase-root": {
                                    height: "auto",
                                  },
                                  "& .MuiInputBase-inputMultiline": {
                                    height: "100px", // Set desired height here
                                  },
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position="end"
                                      style={{ height: "90px" }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{
                                          float: "right",

                                          marginBottom: "3px",
                                        }}
                                        onClick={() =>
                                          handleSaveClick("Consultaion")
                                        }
                                      >
                                        Save
                                      </Button>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {errorMessage && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errorMessage}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                      {!AppActivity.canEdit && (
                        <TableBody>
                          {remarkRequest.map(
                            (remark, index) =>
                              remark.evaluationTypeString === "Consultaion" && (
                                <TableRow key={index}>
                                  <TableCell>
                                    <div className="flex">
                                      <img
                                        src="/assets/images/etc/userpic.png"
                                        alt="Card cover image"
                                        className="rounded-full mr-4"
                                        style={{
                                          width: "4rem",
                                          height: "4rem",
                                        }}
                                      />
                                      <div className="ps-4">
                                        <h6 className="pt-2 text-black">
                                          <b>{remark.createdBy}</b> -{" "}
                                          {remark?.remark}
                                        </h6>
                                        <h6
                                          className="pt-1 text-grey"
                                          style={{ display: "block" }}
                                        >
                                          {formatDates(remark.createdAt)}
                                        </h6>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                          )}

                          {remarkRequest?.length == 0 && (
                            <TableRow>
                              <TableCell>
                                <div className="flex">
                                  <h5 className="ps-4 pt-2 text-black text-center">
                                    <b>No Comments</b>
                                  </h5>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tasks Comment</TableCell>
                        </TableRow>
                      </TableHead>
                      <div className="flex items-center w-full border-b justify-between"></div>
                      {AppActivity.canEdit && (
                        <TableBody>
                          {remarkRequest.map(
                            (remark, index) =>
                              remark.evaluationTypeString === "ImpactTask" && (
                                <TableRow key={index}>
                                  <TableCell>
                                    <TextField
                                      id={`impact-task-comment-${index}`}
                                      label="Write your task comments..."
                                      multiline
                                      rows={1}
                                      fullWidth
                                      value={remark.remark}
                                      onChange={(event) =>
                                        handleRemarkChange(index, event)
                                      }
                                      sx={{
                                        "& .MuiInputBase-root": {
                                          height: "auto",
                                        },
                                        "& .MuiInputBase-inputMultiline": {
                                          height: "100px",
                                        },
                                      }}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment
                                            position="end"
                                            style={{ height: "90px" }}
                                          >
                                            <Button
                                              variant="contained"
                                              color="secondary"
                                              style={{
                                                float: "right",

                                                marginBottom: "3px",
                                              }}
                                              onClick={() =>
                                                handleUpdateClick(
                                                  index,
                                                  remark.id
                                                )
                                              }
                                            >
                                              Update
                                            </Button>
                                          </InputAdornment>
                                        ),
                                      }}
                                    />
                                    <h6 className="ps-4 pt-6 text-grey">
                                      {remark.createdBy +
                                        "-" +
                                        formatDates(remark.createdAt)}
                                    </h6>
                                  </TableCell>
                                </TableRow>
                              )
                          )}
                          <TableRow>
                            <TableCell>
                              <TextField
                                id="tasks-comment"
                                label="Write your task comments..."
                                multiline
                                rows={1}
                                fullWidth
                                value={newImpactTaskRemark}
                                onChange={(event) =>
                                  handleInputChange(event, "ImpactTask")
                                }
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position="end"
                                      style={{ height: "90px" }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{
                                          float: "right",
                                          marginBottom: "3px",
                                        }}
                                        onClick={() =>
                                          handleSaveClick("ImpactTask")
                                        }
                                      >
                                        Save
                                      </Button>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {errorMessageTask && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errorMessageTask}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                      {!AppActivity.canEdit && (
                        <TableBody>
                          {remarkRequest.map(
                            (remark, index) =>
                              remark.evaluationTypeString === "ImpactTask" && (
                                <TableRow key={index}>
                                  <TableCell>
                                    <div className="flex">
                                      <img
                                        src="/assets/images/etc/userpic.png"
                                        alt="Card cover image"
                                        className="rounded-full mr-4"
                                        style={{
                                          width: "4rem",
                                          height: "4rem",
                                        }}
                                      />
                                      <div className="ps-4">
                                        <h6 className="pt-2 text-black">
                                          <b>{remark.createdBy}</b>{" "}
                                          {remark?.remark}
                                        </h6>
                                        <h6
                                          className="pt-1 text-grey"
                                          style={{ display: "block" }}
                                        >
                                          {formatDates(remark.createdAt)}
                                        </h6>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                          )}
                          {remarkRequest?.length == 0 && (
                            <TableRow>
                              <TableCell>
                                <div className="flex">
                                  <h5 className="ps-4 pt-2 text-black text-center">
                                    <b>No Comments</b>
                                  </h5>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </div>

            <div className="flex items-center w-full p-30 pt-24 pb-24 justify-between">
              <div className="flex justify-start">
                <StyledBadge
                  badgeContent={
                    listDocument.length != 0
                      ? listDocument.length
                      : CountApprove
                  }
                >
                  <Button
                    className="whitespace-nowrap"
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
                        heroicons-solid:upload
                      </FuseSvgIcon>
                    }
                    onClick={handleOpen1}
                  >
                    Document
                  </Button>
                </StyledBadge>
              </div>

              {AppActivity?.canExecute && (
                <div className="flex justify-end">
                  {AppActions.map((btn) => (
                    <Button
                      key={btn.uid}
                      className="whitespace-nowrap ms-5"
                      variant="contained"
                      color="secondary"
                      // style={{ marginTop: "10px" }}

                      onClick={(e) => {
                        // console.log(btn, "btn");
                        SubmitApprovelCreate(e, btn.uid, btn.name, btn.type);
                        // alert(1);
                      }}
                    >
                      {btn.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </Paper>
        </SwipeableViews>

        <DocumentModal
          open={open1}
          step={1}
          handleModalClose={handleModalClose}
          selectedFile={selectedFile}
          selectedDocument={selectedDocument}
          listDocument={listDocument}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          fileDetails={fileDetails}
          setFileDetails={setFileDetails}
          toggleDrawer={toggleDrawer}
          handelDetailDoc={handelDetailDoc}
          handelFileChange={handelFileChange}
          handelFileDiscriptionChange={handelFileDiscriptionChange}
          handleSubmitDocument={handleSubmitAsset}
          handleDownload={handleDownload}
          canExecute={AppActivity?.canExecute}
          formatDate={formatDate}
          handleDelete={handleDelete}
        />


      </div>
    </>
  );
};

export default EvaluationApproval;
