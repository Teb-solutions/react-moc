import { useEffect } from "react";
import MainComponent from "./mainContent.jsx";
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
import { apiAuth } from "src/utils/http.js";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon.jsx";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import Initiation from "./Initiation.jsx";
import { withStyles } from "@mui/styles";

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
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
      backgroundColor: "#2c3e50", // Adjust background color to match the image
      color: "white",
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
  const [expanded, setExpanded] = useState(false);
  const [reviewed, setReviewed] = useState({});
  const [valueRemark, setValueRemark] = useState("");
  const [showReview, setshowReview] = useState(false);
  const [listDocument, setListDocument] = useState([]);

  const [handelCommentRemark, setHandelCommentRemark] = useState("");

  const handleExpansionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeRemark = (event) => {
    setValueRemark(event.target.value);
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

  const handelCommentImp = (id, value) => {
    if (value == 1) {
      apiAuth
        .put(`/Task/ImpAddReview/${id}/${lastActCode.code}`, {
          remark: handelCommentRemark,
        })
        .then((resp) => {
          setshowReview(true);
          toast?.success("Review successfully added");
          getRecords();

          setHandelCommentRemark("");
        });
    } else {
      apiAuth
        .put(`/Task/ImpAddReview/${id}/${lastActCode.code}`, {
          remark: handelCommentRemark,
        })
        .then((resp) => {
          setshowReview(true);
          toast?.success("Review successfully Updated");
          getRecords();

          setHandelCommentRemark("");
        });
    }
  };

  const SubmitApprovelCreate = (e, uid, name, type) => {
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
      .catch((error) => {});
  };
  const [open, setOpen] = useState(false);
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

  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
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

    setSelectedFile({
      ...selectedFile,
      name: e.target.files[0].name,

      type: e.target.files[0].type,
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
        apiAuth
          .get(
            `/DocumentManager/DocList/${AppActivity.uid}/Approval?changeRequestToken=${assetEvaluationId}`
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
  return (
    <div className="w-full">
      <ToastContainer className="toast-container" />
      <Initiation
        contentDetailsini={contentDetailsini}
        assetEvaluationId={assetEvaluationId}
      />
      <MainComponent
        contentDetails={contentDetails}
        assetEvaluationId={assetEvaluationId}
      />
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
                              Task #{imptsk?.id}
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
                                {formatDatess(imptsk.dueDate)}
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
                                  {formatDatess(imptsk?.completedAt)}
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
                                      <span className="text-brown">
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
                                              style={{ height: "36px" }}
                                              defaultValue={imptsk?.remark}
                                              onChange={(e) =>
                                                setHandelCommentRemark(
                                                  e.target.value
                                                )
                                              }
                                            ></textarea>

                                            <button
                                              className="custom-update-button"
                                              style={{ float: "right" }}
                                              onClick={() =>
                                                handelCommentImp(
                                                  imptsk.id,
                                                  imptsk
                                                    .implementationReviews[0]
                                                    .id,
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
                                              }}
                                              defaultValue={rwx?.remark}
                                              onChange={(e) =>
                                                setHandelCommentRemark(
                                                  e.target.value
                                                )
                                              }
                                            ></textarea>

                                            <button
                                              className="custom-update-button"
                                              onClick={() =>
                                                handelCommentImp(
                                                  imptsk.id,
                                                  imptsk
                                                    .implementationReviews[0]
                                                    .id,
                                                  2
                                                )
                                              }
                                            >
                                              Update
                                            </button>

                                            <span className="mat-form-field-label-wrapper"></span>
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="mat-form-field-infix mt-12">
                                              <span className="">
                                                {rwx?.createdByStaffName}
                                              </span>
                                              -{" "}
                                              <span className="text-grey">
                                                {rwx?.remark}
                                              </span>
                                            </div>
                                            <p
                                              className="mat-form-field-infix text-grey"
                                              style={{ fontSize: "smaller" }}
                                            >
                                              {formatDatess(rwx?.updatedAt)}
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
                                      }}
                                      onChange={(e) =>
                                        setHandelCommentRemark(e.target.value)
                                      }
                                    ></textarea>
                                    <button
                                      className="custom-update-button"
                                      onClick={() =>
                                        handelCommentImp(imptsk.id, 1, 1)
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
                  <span className="font-semibold leading-none">
                    Approver Comment: {ApprovalManager?.remark}
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
                          Comment
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
                    {listDocument.length ? listDocument.length : CountApprove}{" "}
                    Files
                  </Typography>
                </Typography>
                {AppActivity?.canExecute && (
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
                    <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
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
                      value={selectedFile?.description}
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
                    <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
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
                      <h6>{selectedDocument?.name}</h6>
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
                      value={new Date(
                        selectedDocument.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
                      disabled
                      value={
                        selectedDocument?.descritpion === null
                          ? ""
                          : selectedDocument?.descritpion
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
    </div>
  );
};

export default ImplementationApprovalSite;
