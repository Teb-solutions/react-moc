import { useEffect } from "react";
// import MainComponent from "../common_components/mainContent.jsx/index.js";
import {
  Backdrop,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Fade,
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  OutlinedInput,
  Paper,
  Badge,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SwipeableViews from "react-swipeable-views";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { parseISO, format } from "date-fns";
import { apiAuth } from "src/utils/http.js";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon.jsx";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Initiation from "../../common_components/Initiation";
import { withStyles } from "@mui/styles";
import DocumentModal from "../../common_modal/documentModal";

const ImplementationApprovalSite = ({
  contentDetails,
  currentActivityForm,
  assetEvaluationId,
  lastActCode,
  AppActions,
  AppActivity,
  ApprovalManager,
  setContent,
  setContentDetails,
  contentDetailsini,
  CountApprove,
}) => {
  const StyledBadge = withStyles((theme) => ({
    badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);
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
  const [expanded, setExpanded] = useState(false);
  const [reviewed, setReviewed] = useState({});
  const [valueRemark, setValueRemark] = useState("");
  const [showReview, setshowReview] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [deletes, setDeletes] = useState(false);
  const [handelCommentRemark, setHandelCommentRemark] = useState("");
  const [docId, setDocId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [docToken, setDocToken] = useState("");
  const handleExpansionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeRemark = (event) => {
    setValueRemark(event.target.value);
    if (event.target.value.trim() !== "") {
      setErrorMessage(""); // Clear error message on input change
    }
  };

  function getRecords() {
    apiAuth
      .get(
        `/SummaryDetails/List?id=${assetEvaluationId}&&code=${lastActCode.code}&&version=${lastActCode.version}&&refVersion=${lastActCode.refVersion}`
      )
      .then((resp) => {
        setContentDetails(resp.data.data);
      });
  }

  const hasAddedComment = (comments) => {
    return comments.some((comment) => comment.isCreatedByMe);
  };

  const isMyComment = (comment) => {
    return comment.isCreatedByMe;
  };

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
  const [clickedTasks, setClickedTasks] = useState({});
  const handelImpactreview = (id) => {
    apiAuth
      .put(`/SummaryDetails/ImpReviewStatus/${assetEvaluationId}`, {
        isActive: true,
        task: [id],
        activityCode: lastActCode.code,
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

  const setHandelCommentRemarks = (id, value) => {
    setHandelCommentRemark((prevRemarks) => ({
      ...prevRemarks,
      [id]: value,
    }));
  };

  const handelCommentImp = (id, value) => {
    const remark = handelCommentRemark[id];
    if (value == 1) {
      apiAuth
        .put(`/Task/ImpAddReview/${id}/${lastActCode.code}`, {
          remark: remark,
        })
        .then((resp) => {
          // setshowReview(true);
          getRecords();
          toast?.success("Review successfully added");

          setHandelCommentRemark("");
        });
    } else {
      apiAuth
        .put(`/Task/ImpAddReview/${id}/${lastActCode.code}`, {
          remark: remark,
        })
        .then((resp) => {
          // setshowReview(true);
          toast?.success("Review successfully Updated");
          getRecords();

          setHandelCommentRemark("");
        });
    }
  };

  const SubmitApprovelCreate = (e, uid, name, type) => {
    if (valueRemark.trim() === "") {
      setErrorMessage("Comments are required.");
      return;
    }
    setErrorMessage("");
    apiAuth
      .post(`/ApprovalManager/Create/${assetEvaluationId}`, {
        actionUID: uid,
        actionUid: uid,
        formUID: AppActivity.formUID,
        actionName: name,
        actionType: type,
        activityCode: AppActivity.code,
        activityId: AppActivity.uid,
        consultaioncomment: "",
        formType: AppActivity.form,
        remark: valueRemark,
        taskscomment: "",
        version: AppActivity.version,
      })
      .then((resp) => {
        if (resp.data.statusCode != 400) {
          apiAuth
            .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
            .then((resp) => {
              setContent(resp.data.data.phases);
            });
          setValueRemark("");
        } else {
          toast?.error(resp.data.message);
        }
      })
      .catch((error) => { });
  };
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");

  const [selectedFile, setSelectedFile] = useState({
    name: "",

    descritpion: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });


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
  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
    setFileDetails(false);
  };
  const ListDoc = (id, activeid) => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${id}/Approval?changeRequestToken=${activeid}`
      )
      .then((response) => {
        setListDocument(response?.data?.data);
      });
  };
  const handleOpen = (id) => {
    setOpen(true);
    ListDoc(id, assetEvaluationId);
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
      documentType: " Approval",
      documentId: AppActivity.uid,
      changeRequestToken: assetEvaluationId,
    });
  };
  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };

  const handleSubmitAsset = (e) => {
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
              `/DocumentManager/DocList/${AppActivity.uid}/Approval?changeRequestToken=${assetEvaluationId}`
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
          setOpen(false);
          setOpenDrawer(false);
          setSelectedFile({
            ...selectedFile,
            name: "",
            description: "",
          });
        }
      })
      .catch((error) => {
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
        setFileDetails(false);
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
          `/DocumentManager/DocList/${docId}/Approval?changeRequestToken=${assetEvaluationId}`
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

  return (
    <div className="w-full">
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
      <Initiation
        contentDetailsini={contentDetailsini}
        contentDetailsT={contentDetails}
        assetEvaluationId={assetEvaluationId}
        contentDetailsDocu={contentDetails}
      />
      {/* <MainComponent
        contentDetails={contentDetails}
        assetEvaluationId={assetEvaluationId}
      /> */}
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full border-b p-30 pt-24 pb-24 justify-between"
          >
            <h2 className="text-2xl font-semibold">Implementation Tasks</h2>
            <TextField
              variant="filled"
              fullWidth
              placeholder="Search"
              style={{ marginBottom: "0" }}
              //   value={searchTerm}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ marginTop: "0px" }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 320 }}
            />
          </div>
          <div className="p-30 pt-24 pb-24">
            {contentDetails?.implementationTask?.map((imptsk) => (
              <>
                <table className="task-table mat-table">
                  <thead
                    className="task-table-header"
                    style={{ display: "none" }}
                  ></thead>
                  <tbody className="task-table-body">
                    <tr className="task-table-row mat-row">
                      <td className="task-table-cell mat-cell">
                        <div className="task-header flex items-center p-0">
                          <div className="task-id flex flex-col">
                            <span
                              className="task-id-text font-semibold text-xl leading-none"
                              style={{ fontSize: "20px" }}
                            >
                              Task #{imptsk?.sourceTaskId}
                            </span>
                          </div>
                          {currentActivityForm.canEdit && (
                            <div className="task-button ml-auto">
                              <button
                                className="task-mark-reviewed-button mat-stroked-button cursor-pointer"
                                onClick={() => handelImpactreview(imptsk.id)}
                                disabled={
                                  imptsk?.reviewd || clickedTasks[imptsk.id]
                                }
                                style={{
                                  backgroundColor:
                                    clickedTasks[imptsk.id] && "#7FFFD4",
                                }}
                              >
                                {imptsk?.reviewd || clickedTasks[imptsk.id] ? (
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
                        <div className="task-details p-0 mb-10 pb-10 mt-10">
                          <div className="task-detail prose prose-sm max-w-5xl">
                            <div className="task-detail-item mt-10 p-0">
                              <span className="task-detail-label bg-default rounded d-inline-block text-secondary font-semibold">
                                What is Task
                              </span>
                              <span className="task-detail-value d-inline-block">
                                {imptsk.actionWhat}
                              </span>
                            </div>
                            <div className="task-detail-item mt-10 p-0">
                              <span className="task-detail-label bg-default rounded d-inline-block text-secondary font-semibold">
                                How is Task done
                              </span>
                              <span className="task-detail-value d-inline-block">
                                {imptsk.actionHow}
                              </span>
                            </div>
                            <div className="task-detail-item mt-10 p-0">
                              <span className="task-detail-label bg-default rounded d-inline-block text-secondary font-semibold">
                                Assigned to
                              </span>
                              <span className="task-detail-value">
                                {imptsk.assignedStaff}
                              </span>
                              <span className="task-detail-label bg-default rounded d-inline-block ml-2 text-secondary font-semibold">
                                Due Date
                              </span>
                              <span className="task-detail-value">
                                {new Date(imptsk.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                              <span className="task-detail-label bg-default rounded d-inline-block ml-2 text-secondary font-semibold">
                                Deadline
                              </span>
                              <span className="task-detail-value">
                                {imptsk?.deadlineDisplay}
                              </span>
                            </div>
                          </div>
                          <div
                            className="inventory-grid grid items-center gap-4 mt-10 ms-5 py-3 "
                            style={{ width: "40%" }}
                          >
                            <div className="flex items-center mt-5">
                              <img
                                src="/assets/images/etc/userpic.png"
                                alt="Card cover image"
                                className="rounded-full mr-4"
                                style={{
                                  width: "3rem",
                                  height: "3rem",
                                }}
                              />
                              <div className="flex flex-col">
                                <span
                                  className="font-semibold leading-none"
                                  style={{
                                    fontSize: "smaller",
                                    fontWeight: "400",
                                  }}
                                >
                                  <b>{imptsk.assignedStaff}</b>{" "}
                                  {imptsk?.actionComments}
                                </span>

                                <span className="text-sm text-secondary leading-none pt-5">
                                  Completed on{" "}
                                  {new Date(
                                    imptsk?.completedAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {imptsk.implementationReviews.length > 0 ||
                            showReview ? (
                            <div>
                              <Accordion
                                className=" mt-10 pt-10"
                                expanded={expanded == imptsk.id}
                                onChange={handleExpansionChange(imptsk.id)}
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
                                    alignItems: "center",
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
                                        {imptsk?.implementationReviews?.length}{" "}
                                        Reviews
                                      </span>{" "}
                                      {hasAddedComment(
                                        imptsk.implementationReviews
                                      ) && (
                                          <span className="text-green">
                                            (You have added 1 review)
                                          </span>
                                        )}
                                    </Typography>
                                  </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {currentActivityForm.canEdit &&
                                    !hasAddedComment(
                                      imptsk.implementationReviews
                                    ) && (
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
                                              // defaultValue={imptsk?.remark}

                                              onChange={(e) =>
                                                setHandelCommentRemarks(
                                                  imptsk.id,
                                                  e.target.value
                                                )
                                              }
                                            ></textarea>

                                            <button
                                              className="custom-update-button"
                                              style={
                                                !handelCommentRemark[
                                                  imptsk.id
                                                ]?.trim()
                                                  ? {
                                                    backgroundColor:
                                                      "#cdcdcd",
                                                    float: "right",
                                                  }
                                                  : { float: "right" }
                                              }
                                              onClick={() =>
                                                handelCommentImp(
                                                  imptsk.id,
                                                  imptsk
                                                    .implementationReviews[0]
                                                    .id,
                                                  1
                                                )
                                              }
                                              disabled={
                                                !handelCommentRemark[
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
                                      </div>
                                    )}
                                  {imptsk.implementationReviews?.map((rwx) => (
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
                                        {AppActivity.canEdit &&
                                          isMyComment(rwx) ? (
                                          <div
                                            className="mat-form-field-infix"
                                            style={{ position: "relative" }}
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
                                              defaultValue={rwx?.remark}
                                              onChange={(e) =>
                                                setHandelCommentRemarks(
                                                  imptsk.id,
                                                  e.target.value
                                                )
                                              }
                                            ></textarea>

                                            <button
                                              className="custom-update-button"
                                              style={
                                                !handelCommentRemark[
                                                  imptsk.id
                                                ]?.trim()
                                                  ? {
                                                    backgroundColor:
                                                      "#cdcdcd",
                                                  }
                                                  : {}
                                              }
                                              onClick={() =>
                                                handelCommentImp(
                                                  imptsk.id,
                                                  imptsk
                                                    .implementationReviews[0]
                                                    .id,
                                                  2
                                                )
                                              }
                                              disabled={
                                                !handelCommentRemark[
                                                  imptsk.id
                                                ]?.trim()
                                              }
                                            >
                                              Update
                                            </button>

                                            <span className="mat-form-field-label-wrapper"></span>
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="mat-form-field-infix mt-12">
                                              <span
                                                className="mr-3"
                                                style={{ fontSize: "15px" }}
                                              >
                                                {rwx?.createdByStaffName}
                                              </span>

                                              <span
                                                className="text-grey ml-3"
                                                style={{ fontSize: "14px" }}
                                              >
                                                {rwx?.remark}
                                              </span>
                                            </div>
                                            <p
                                              className="mat-form-field-infix text-grey"
                                              style={{ fontSize: "13px" }}
                                            >
                                              {new Date(
                                                rwx?.updatedAt
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
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                      {/* <span
                                  style={{
                                    fontSize: "x-small",
                                    paddingLeft: "60px",
                                  }}
                                >
                                  {" "}
                                  {imptsk.implementationReviews[0]
                                    ?.updatedAt &&
                                    new Date(
                                      imptsk.implementationReviews[0]?.updatedAt
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
                                </span> */}
                                      {AppActivity.canEdit &&
                                        isMyComment(rwx) && (
                                          <p
                                            className="mat-form-field-infix text-black"
                                            style={{
                                              fontSize: "13px",
                                              paddingLeft: "40px",
                                            }}
                                          >
                                            {new Date(
                                              rwx?.updatedAt
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
                                  ))}
                                </AccordionDetails>
                              </Accordion>
                            </div>
                          ) : (
                            AppActivity.canEdit && (
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
                                      onChange={(e) =>
                                        setHandelCommentRemarks(
                                          imptsk.id,
                                          e.target.value
                                        )
                                      }
                                    ></textarea>
                                    <button
                                      className="custom-update-button"
                                      style={
                                        !handelCommentRemark[imptsk.id]?.trim()
                                          ? { backgroundColor: "#cdcdcd" }
                                          : {}
                                      }
                                      onClick={() =>
                                        handelCommentImp(imptsk.id, 1, 1)
                                      }
                                      disabled={
                                        !handelCommentRemark[imptsk.id]?.trim()
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
                            )
                          )}
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
                  ></tfoot>
                </table>
                {/* <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full  border-b justify-between"
              ></div> */}
              </>
            ))}
          </div>
        </Paper>
      </SwipeableViews>
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
          <div className="flex items-center w-full border-b p-30 pt-24 pb-24 justify-between">
            <h2 className="text-2xl font-semibold">Approval</h2>
          </div>
          <div>
            {AppActivity.isComplete && AppActivity.status !== "Pending" ? (
              <div className="p-30 pt-24 pb-24">
                <div
                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                  style={{ width: "40%" }}
                >
                  <span className="leading-none">
                    <b>Approver Comment:</b> {ApprovalManager?.remark}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="inventory-grid grid items-center gap-4 "
                style={{ width: "100%" }}
              >
                <div className="p-30 pt-24 pb-24 w-full border-b">
                  {currentActivityForm.canEdit && (
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                        <FormLabel
                          htmlFor="reasonForNewDocument"
                          className="font-semibold leading-none"
                        >
                          Comment *
                        </FormLabel>
                        <OutlinedInput
                          id="reasonForNewDocument"
                          name="reasonForNewDocument"
                          onChange={handleChangeRemark}
                          label="Reason For Change*"
                          className="mt-5"
                          value={valueRemark}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              backgroundColor: "#f0f0f0",
                              "& fieldset": {
                                borderColor: "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor: "#999",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#333",
                              },
                            },
                          }}
                        />
                        {errorMessage && (
                          <div className="text-red-500 text-sm mt-1">
                            {errorMessage}
                          </div>
                        )}
                      </FormControl>
                    </Box>
                  )}
                  {/* <div className="flex items-center w-full border-b justify-between"></div> */}
                </div>
                <div className="p-30 pt-24 pb-24">
                  {currentActivityForm.canExecute && (
                    <div className="flex justify-end">
                      <StyledBadge
                        badgeContent={
                          listDocument.length
                            ? listDocument.length
                            : CountApprove
                        }
                      >
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
                          onClick={() => handleOpen(AppActivity.uid)}
                        >
                          <FuseSvgIcon
                            className="text-48"
                            size={24}
                            color="action"
                          >
                            heroicons-outline:upload
                          </FuseSvgIcon>
                          Document
                        </Button>
                      </StyledBadge>
                      {AppActions.map((btn) => (
                        <Button
                          key={btn.uid}
                          className="whitespace-nowrap ms-5"
                          variant="contained"
                          color="secondary"
                          onClick={(e) =>
                            SubmitApprovelCreate(e, btn.uid, btn.name, btn.type)
                          }
                        >
                          {btn.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Paper>
      </SwipeableViews>
      <DocumentModal step={1} open={open} handleModalClose={handleModalClose} selectedFile={selectedFile} selectedDocument={selectedDocument} handleDelete={handleDelete} handelDetailDoc={handelDetailDoc} handleDownload={handleDownload} handleSubmitDocument={handleSubmitAsset} listDocument={listDocument} CountApprove={CountApprove} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} fileDetails={fileDetails} setFileDetails={setFileDetails} handelFileChange={handelFileChange} canExecute={AppActivity?.canExecute} toggleDrawer={toggleDrawer} handelFileDiscriptionChange={handelFileDiscriptionChange} formatDate={formatDate} />



      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={deletes}
        onClose={handleCloseDelete}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={deletes}>
          <Box sx={style2}>
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
                    Do you want to delete ?
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
                onClick={handleCloseDelete}
              >
                Cancel
              </Button>
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                style={{
                  padding: "23px",
                  backgroundColor: "red",
                }}
                type="submit"
                onClick={handleSubmitDelete}
              >
                Confirm
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ImplementationApprovalSite;
