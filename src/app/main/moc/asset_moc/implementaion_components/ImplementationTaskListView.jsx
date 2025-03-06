import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Badge
} from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiAuth } from "src/utils/http.js";
import DocumentModal from "../../common_modal/documentModal";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon.jsx";
import { withStyles } from "@mui/styles";
const StyledBadge = withStyles((theme) => ({
    badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);
export const ImplementationTaskListView = ({
  implementationTask,
  currentActivityForm,
  AppActivity,
  showReview,
  clickedTasks,
  setHandelCommentRemarks,
    handelCommentRemark,
    assetEvaluationId,
}) => {
    
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

  return (
    <>
      {implementationTask?.map((imptsk) => (
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
                          disabled={imptsk?.reviewd || clickedTasks[imptsk.id]}
                          style={
                            imptsk?.reviewd || clickedTasks[imptsk.id]
                              ? {
                                  backgroundColor: "rgb(181 253 210 / 50%)",
                                }
                              : {}
                          }
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
                    {/* <div
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

                          </div> */}
                    <ImpTaskData assetEvaluationId={assetEvaluationId} imptsk={imptsk}  />

                    {imptsk.implementationReviews.length > 0 || showReview ? (
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
                                                backgroundColor: "#cdcdcd",
                                                float: "right",
                                              }
                                            : { float: "right" }
                                        }
                                        onClick={() =>
                                          handelCommentImp(
                                            imptsk.id,
                                            imptsk.implementationReviews[0].id,
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
                            {imptsk.implementationReviews?.map((rwx, index) => (
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
                                  {AppActivity.canEdit && isMyComment(rwx) ? (
                                    <div
                                      className="mat-form-field-infix"
                                      style={{ position: "relative" }}
                                    >
                                      <textarea
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
                                        value={
                                          handelCommentRemark[imptsk.id]
                                            ? index[
                                                handelCommentRemark[imptsk.id]
                                              ]
                                            : rwx?.remark || ""
                                        }
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
                                                backgroundColor: "#cdcdcd",
                                              }
                                            : {}
                                        }
                                        onClick={() =>
                                          handelCommentImp(
                                            imptsk.id,
                                            imptsk.implementationReviews[0].id,
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

                                {AppActivity.canEdit && isMyComment(rwx) && (
                                  <p
                                    className="mat-form-field-infix text-black"
                                    style={{
                                      fontSize: "13px",
                                      paddingLeft: "40px",
                                    }}
                                  >
                                    {new Date(rwx?.updatedAt).toLocaleString(
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
    </>
  );
};

const ImpTaskData = ({imptsk, assetEvaluationId} ) => {
  const [assigneeExpanded, setAssigneeExpanded] = useState(false);

  const [impComments, setImpComments] = useState([]);
  const [documentCounts, setDocumentCounts] = useState({});
  const handelComments = (taskid) => {
    apiAuth
      .get(`ChangeImpact/ListTaskCommentst?id=${taskid}`)
      .then((resp) => {
        const comments = resp.data.data;

        setImpComments(comments);

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
        console.error("Error fetching task comments:", error);
      });
  };

  const handleAssigneeExpansion = (panel) => (event, isExpanded) => {
    setAssigneeExpanded(isExpanded ? panel : false);

    handelComments(panel);
  };
  const [openDrawer, setOpenDrawer] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(false);
  const [documenDowToken, setDocumenDowToken] = useState("");
  
  const ListDoc = (docu_id, id) => {
    apiAuth
      .get(`/DocumentManager/DocList/${docu_id}/Task?changeRequestToken=${id}`)
      .then((Resp) => {
        setListDocument(Resp?.data?.data);
      });
  };
  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
    setFileDetails(false);
    setErrors({})

  };
  const handleOpen = (id) => {
    setOpen(true);
    ListDoc(id, assetEvaluationId);
  };
  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
  return (

    <Accordion
      className="mt-4"
      expanded={assigneeExpanded === imptsk.id}
      onChange={handleAssigneeExpansion(imptsk.id)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Typography>Task Approve History</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <DocumentModal
        open={open}
        handleModalClose={handleModalClose}
        selectedDocument={selectedDocument}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
        selectedFile={selectedFile}
        listDocument={listDocument}
        step={1}
        handelFileDiscriptionChange={handelFileDiscriptionChange}
        handelDetailDoc={handelDetailDoc}

        formatDate={formatDate}
        documenDowToken={documenDowToken}
      />
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
                style={{
                  position: "relative",
                  justifyContent: "end",
                }}
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
                    {imptsk?.assignedStaff}{" "}
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
                        ? `Started on ${dayjs(msg.startedDate).format(
                            "MMM DD, YYYY"
                          )}`
                        : msg.workInProgressDate &&
                            !msg.completedDate &&
                            !msg.dueDate
                          ? `Work in Progress since ${dayjs(msg.workInProgressDate).format(
                              "MMM DD, YYYY"
                            )}`
                          : msg.dueDate && !msg.completedDate
                            ? `Due on ${dayjs(msg.dueDate).format(
                                "MMM DD, YYYY"
                              )}`
                            : msg.completedDate
                              ? `Completed on ${dayjs(msg.completedDate).format(
                                  "MMM DD, YYYY"
                                )}`
                              : "Unknown"}
                    </small>
                  </div>
                </div>
                {documentCounts[msg.id] ? (
                  documentCounts[msg.id] != 0 && (
                    <button
                      className="icon-button"
                      onClick={() => handleOpen(msg.id)}
                      style={{
                        top: "-19px",
                        right: "10px",
                      }}
                    >
                      <StyledBadge badgeContent={documentCounts[msg.id]}>
                        <button
                          className="icon-button"
                          onClick={() => handleOpen(msg.id)}
                          style={{
                            top: "-0px",
                          }}
                        >
                          <FuseSvgIcon size={20}>
                            heroicons-solid:document
                          </FuseSvgIcon>
                        </button>
                      </StyledBadge>
                    </button>
                  )
                ) : (
                  <></>
                )}
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
                    {imptsk.assignedByStaff}{" "}
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
                        {msg.approvalStatus === 3
                          ? "Approved on"
                          : "Rejected on"}{" "}
                        {new Date(msg.approvalStatusDate).toLocaleString(
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
        
      </AccordionDetails>
    </Accordion>
  );
};
