import Paper from "@mui/material/Paper";

import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiAuth } from "src/utils/http";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { parseISO, format } from "date-fns";

import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

const ImplementationApproval = ({
  contentDetails,
  currentActivityForm,
  getRecords,
  evaluationId,
  lastActCode,
  setContentDetails,
}) => {
  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
  const listDocu = () => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${evaluationId}/DocImplTrSheet?changeRequestToken=${evaluationId}`
      )
      .then((response) => {
        setListDocument1(response?.data?.data);
      });
  };
  useEffect(() => {
    listDocu();
  }, []);

  const [handelCommentRemark, setHandelCommentRemark] = useState("");
  const [expanded, setExpanded] = useState(false);
  const handleExpansionChange = () => {
    setExpanded(!expanded);
  };

  const [reviewed, setReviewed] = useState({});

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

  const hasAddedComment = (comments) => {
    return comments.some((comment) => comment.isCreatedByMe);
  };

  const handelreview = (id) => {
    apiAuth
      .put(`/SummaryDetails/ImpReviewStatus/${evaluationId}`, {
        Task: [id],
        ActivityCode: lastActCode.code,
      })
      .then((response) => {
        setReviewed((prevReviewed) => ({
          ...prevReviewed,
          [id]: true,
        }));
        console.log(response);
      });
  };

  const handelCommentImp = async (id, value) => {
    await apiAuth
      .put(`/Task/ImpAddReview/${id}/IMPL_APPROVAL_VP_DIV`, {
        remark: handelCommentRemark,
      })
      .then(async (resp) => {
        if (value == 1) {
          toast?.success("Review successfully added");
          await apiAuth
            .get(
              `/SummaryDetails/List?id=${evaluationId}&&code=${lastActCode.code}&&version=${lastActCode.version}&&refVersion=${lastActCode.refVersion}`
            )
            .then((resp) => {
              setContentDetails(resp.data?.data);
            });
        } else {
          toast?.success("Review successfully Updated");
          await apiAuth
            .get(
              `/SummaryDetails/List?id=${evaluationId}&&code=${lastActCode.code}&&version=${lastActCode.version}&&refVersion=${lastActCode.refVersion}`
            )
            .then((resp) => {
              setContentDetails(resp.data?.data);
            });
        }
        setHandelCommentRemark("");
        getRecords();
      });
  };

  return (
    <Paper
      className="w-full  mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden"
      style={{ width: "100%" }}
    >
      <div
        _ngcontent-fyk-c288=""
        class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
      >
        <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
          Implementation Tasks
        </h2>
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
          <table className="task-table mat-table mt-10">
            <thead className="task-table-header" style={{ display: "none" }}>
              {/* Empty header */}
            </thead>
            <tbody className="task-table-body">
              <tr className="task-table-row mat-row">
                <td className="task-table-cell mat-cell">
                  <div className="task-header flex items-center p-0">
                    <div className="task-id flex flex-col">
                      <span className="task-id-text font-semibold text-xl leading-none">
                        Task #{imptsk?.id}
                      </span>
                    </div>

                    {currentActivityForm.canEdit && (
                      <div className="task-button ml-auto">
                        <button
                          className="task-mark-reviewed-button mat-stroked-button cursor-pointer"
                          onClick={() => handelreview(imptsk.id)}
                          disabled={
                            imptsk?.reviewd ||
                            imptsk.implementationReviewStatus.length
                          }
                          style={
                            reviewed[imptsk.id] ||
                            imptsk.implementationReviewStatus.length
                              ? {
                                  backgroundColor: "rgb(181 253 210 / 50%)",
                                }
                              : {}
                          }
                        >
                          {reviewed[imptsk.id] ||
                          imptsk.implementationReviewStatus.length ? (
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
                  <div className="task-details p-0 mt-10">
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
                        <span className="task-detail-label bg-default rounded  d-inline-block d-inline-block text-secondary font-semibold">
                          How is Task done
                        </span>
                        <span className="task-detail-value d-inline-block">
                          {imptsk.actionHow}
                        </span>
                      </div>
                      <div className="task-detail-item mt-10 p-0">
                        <span className="task-detail-label bg-default rounded  d-inline-block text-secondary font-semibold">
                          Assigned to
                        </span>
                        <span className="task-detail-value d-inline-block">
                          {imptsk.assignedStaff}
                        </span>
                        <span className="task-detail-label bg-default rounded  ml-2 text-secondary font-semibold">
                          Due Date
                        </span>
                        <span className="task-detail-value">
                          {formatDate(imptsk.dueDate)}
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
                      className="inventory-grid grid items-center gap-4 mt-10"
                      style={{ width: "40%" }}
                    >
                      <div className="flex items-center mt-10 pb-24">
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
                            Completed on {formatDates(imptsk?.completedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {currentActivityForm.canEdit &&
                    !imptsk.implementationReviews.length ? (
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
                                height: "40px",
                                width: "100%",
                                paddingRight: "100px",
                                fontSize: "13px",
                              }}
                              onChange={(e) =>
                                setHandelCommentRemark(e.target.value)
                              }
                            ></textarea>
                            <button
                              className="custom-update-button"
                              style={{ float: "right" }}
                              onClick={() => handelCommentImp(imptsk.id, 1)}
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
                    ) : (
                      <div className="mt-10">
                        <Accordion
                          expanded={expanded}
                          onChange={handleExpansionChange}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            style={{
                              display: "flex",
                              justifyContent: currentActivityForm.canEdit
                                ? "space-between"
                                : "flex-start",
                            }}
                          >
                            {currentActivityForm.canEdit && (
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
                                justifyContent: currentActivityForm.canEdit
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
                                  imptsk?.implementationReviews
                                ) && <span className="text-green"></span>}
                              </Typography>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails>
                            {currentActivityForm.canEdit ? (
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
                                    }}
                                  >
                                    <textarea
                                      rows="2"
                                      className="mat-input-element mat-form-field-autofill-control cdk-textarea-autosize mat-autosize"
                                      placeholder="Write a comment..."
                                      id="ImpTaskReview"
                                      data-placeholder="Write a comment..."
                                      aria-invalid="false"
                                      aria-required="false"
                                      style={{
                                        height: "36px",
                                        fontSize: "13px",
                                      }}
                                      defaultValue={
                                        imptsk?.implementationReviews[0]?.remark
                                      }
                                      onChange={(e) =>
                                        setHandelCommentRemark(e.target.value)
                                      }
                                    ></textarea>

                                    <button
                                      className="custom-update-button"
                                      style={{ float: "right" }}
                                      onClick={() =>
                                        handelCommentImp(imptsk.id, 2)
                                      }
                                    >
                                      Update
                                      <span className="mat-ripple mat-button-ripple"></span>
                                      <span className="mat-button-focus-overlay"></span>
                                    </button>

                                    <span className="mat-form-field-label-wrapper"></span>
                                  </div>
                                </div>
                                <span
                                  style={{
                                    fontSize: "13px",
                                    paddingLeft: "40px",
                                  }}
                                >
                                  {" "}
                                  {imptsk.implementationReviews[0]?.updatedAt &&
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
                            ) : (
                              imptsk.implementationReviews.map((details) => (
                                <div>
                                  <div className="mat-form-field-infix mt-12">
                                    <span
                                      className="mr-3"
                                      style={{ fontSize: "15px" }}
                                    >
                                      {imptsk?.assignedStaff}
                                    </span>

                                    <span
                                      className="text-grey ml-3"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {details?.remark}
                                    </span>
                                  </div>
                                  <p
                                    className="mat-form-field-infix text-grey"
                                    style={{ fontSize: "13px" }}
                                  >
                                    {new Date(
                                      details?.updatedAt
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
                              ))
                            )}
                          </AccordionDetails>
                        </Accordion>
                      </div>
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
            >
              {/* Empty footer */}
            </tfoot>
          </table>
        ))}
      </div>
    </Paper>
  );
};

export default ImplementationApproval;
