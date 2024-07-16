import React from "react";
import MainComponent from "./mainContent.jsx";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SwipeableViews from "react-swipeable-views";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { apiAuth } from "src/utils/http.js";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon.jsx";
import { useEffect } from "react";

const ImplementationApprovalSite = ({
  contentDetails,
  currentActivityForm,
  assetEvaluationId,
  lastActCode,
  AppActions,
  AppActivity,
  ApprovalManager,
  setContent,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [reviewed, setReviewed] = useState({});
  const [valueRemark, setValueRemark] = useState("");

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
      .then((resp) => {});
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
          getRecords();

          setHandelCommentRemark("");
        });
    } else {
      apiAuth
        .put(`/Task/ImpAddReview/${id}/${lastActCode.code}`, {
          remark: handelCommentRemark,
        })
        .then((resp) => {
          getRecords();

          setHandelCommentRemark("");
        });
    }
  };

  const SubmitApprovelCreate = (e, uid, name, type) => {
    const payload = {
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
    };
    console.log(payload, "payys");
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
        setValueRemark("");
      });
    apiAuth
      .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
      .then((resp) => {
        debugger;

        setContent(resp.data.data.phases);
      });
  };
  return (
    <div className="w-full">
      <MainComponent contentDetails={contentDetails} />
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          >
            <h2 className="text-2xl font-semibold">Implementation Tasks</h2>
            <TextField
              variant="filled"
              fullWidth
              placeholder="Search"
              style={{ marginBottom: "15px" }}
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
                      <div className="task-header flex items-center">
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
                              className="task-mark-reviewed-button mat-stroked-button"
                              onClick={() => handelImpactreview(imptsk.id)}
                            >
                              {imptsk?.reviewd || clickedTasks[imptsk.id] ? (
                                <span
                                  className="mat-button-wrapper"
                                  style={{
                                    backgroundColor: "rgba(220,252,231)",
                                  }}
                                >
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
                      <div className="task-details px-6 mt-2">
                        <div className="task-detail prose prose-sm max-w-5xl">
                          <div className="task-detail-item mt-3">
                            <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                              What is Task
                            </span>
                            <span className="task-detail-value">
                              {imptsk.actionWhat}
                            </span>
                          </div>
                          <div className="task-detail-item mt-3">
                            <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                              How is Task done
                            </span>
                            <span className="task-detail-value">
                              {imptsk.actionHow}
                            </span>
                          </div>
                          <div className="task-detail-item mt-5">
                            <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                              Assigned to
                            </span>
                            <span className="task-detail-value">
                              {imptsk.assignedStaff}
                            </span>
                            <span className="task-detail-label bg-default rounded  ml-2 text-secondary font-semibold">
                              Due Date
                            </span>
                            <span className="task-detail-value">
                              {formatDatess(imptsk.dueDate)}
                            </span>
                            <span className="task-detail-label bg-default rounded  ml-2 text-secondary font-semibold">
                              Deadline
                            </span>
                            <span className="task-detail-value">
                              {imptsk?.deadlineDisplay}
                            </span>
                          </div>
                        </div>
                        <div
                          className="inventory-grid grid items-center gap-4 mt-5 ms-5 py-3 px-2 md:px-2"
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
                                Completed on {formatDatess(imptsk?.completedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>&nbsp;</div>

                        {imptsk.implementationReviews.length > 0 ? (
                          <div>
                            <Accordion
                              expanded={expanded == imptsk.id}
                              onChange={handleExpansionChange(imptsk.id)}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
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

                                        <div className="mat-form-field-infix">
                                          <textarea
                                            rows="2"
                                            className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                            placeholder="Write a comment..."
                                            id="ImpTaskReview265"
                                            data-placeholder="Write a comment..."
                                            aria-invalid="false"
                                            aria-required="false"
                                            style={{ height: "36px" }}
                                            value={imptsk?.remark}
                                            onChange={(e) =>
                                              setHandelCommentRemark(
                                                e.target.value
                                              )
                                            }
                                          ></textarea>

                                          <button
                                            className="mat-focus-indicator mat-raised-button mat-button-base"
                                            style={{ float: "right" }}
                                            onClick={() =>
                                              handelCommentImp(
                                                imptsk.id,
                                                imptsk.implementationReviews[0]
                                                  .id,
                                                2
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
                                        <div className="mat-form-field-infix">
                                          <textarea
                                            rows="2"
                                            className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                            placeholder="Write a comment..."
                                            id="ImpTaskReview265"
                                            data-placeholder="Write a comment..."
                                            aria-invalid="false"
                                            aria-required="false"
                                            style={{ height: "36px" }}
                                            value={rwx?.remark}
                                            onChange={(e) =>
                                              setHandelCommentRemark(
                                                e.target.value
                                              )
                                            }
                                          ></textarea>

                                          <button
                                            className="mat-focus-indicator mat-raised-button mat-button-base"
                                            style={{ float: "right" }}
                                            onClick={() =>
                                              handelCommentImp(
                                                imptsk.id,
                                                imptsk.implementationReviews[0]
                                                  .id,
                                                2
                                              )
                                            }
                                          >
                                            <span className="mat-button-wrapper">
                                              Update
                                            </span>
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
                                <div className="mat-form-field-infix">
                                  <textarea
                                    rows="2"
                                    className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                    placeholder="Write a comment..."
                                    id="ImpTaskReview265"
                                    data-placeholder="Write a comment..."
                                    aria-invalid="false"
                                    aria-required="false"
                                    style={{ height: "36px" }}
                                    onChange={(e) =>
                                      setHandelCommentRemark(e.target.value)
                                    }
                                  ></textarea>
                                  <button
                                    className="mat-focus-indicator mat-raised-button mat-button-base"
                                    style={{ float: "right" }}
                                    onClick={() =>
                                      handelCommentImp(imptsk.id, 1)
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
              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full  border-b justify-between"
              ></div>
            </>
          ))}
        </Paper>
      </SwipeableViews>
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div className="flex items-center w-full border-b justify-between">
            <h2 className="text-2xl font-semibold">Approval</h2>
          </div>
          <div>&nbsp;</div>
          {AppActivity.isComplete && AppActivity.status !== "Pending" ? (
            <div
              className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
              style={{ width: "40%" }}
            >
              <span className="font-semibold leading-none">
                Approver Comment: {ApprovalManager?.remark}
              </span>
            </div>
          ) : (
            <div
              className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
              style={{ width: "100%" }}
            >
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
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div className="flex items-center w-full border-b justify-between"></div>
              {currentActivityForm.canExecute && (
                <div className="flex justify-end">
                  <Button
                    className="whitespace-nowrap mt-12"
                    style={{
                      border: "1px solid",
                      backgroundColor: "#0000",
                      color: "black",
                      borderColor: "rgba(203,213,225)",
                    }}
                    variant="contained"
                    color="warning"
                  >
                    <FuseSvgIcon className="text-48" size={24} color="action">
                      heroicons-outline:upload
                    </FuseSvgIcon>
                    Document
                  </Button>
                  {AppActions.map((btn) => (
                    <Button
                      key={btn.uid}
                      className="whitespace-nowrap ms-5"
                      variant="contained"
                      color="secondary"
                      style={{ marginTop: "10px" }}
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
          )}
        </Paper>
      </SwipeableViews>
    </div>
  );
};

export default ImplementationApprovalSite;
