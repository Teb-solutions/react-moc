import React, { useEffect, useRef, useState, useCallback } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Button from "@mui/material/Button";
import SwipeableViews from "react-swipeable-views";
import { parseISO, format } from "date-fns";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Step,
  Badge,
  StepContent,
  StepLabel,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiAuth } from "src/utils/http";
import CourseProgress from "../../homepage/CourseProgress";
import MocHeader from "../../MocHeader";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import DocPhasesEnum from "../docPhaseEnum";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FuseLoading from "@fuse/core/FuseLoading";
import CustomStepIcon from "../../homepage/CustomStepIcon";
import Initiation from "../initiation_components/Initiation";
import Evaluation from "../evaluation_components/Evaluation";
import Approval from "../approval_components/Approval";
import Implementation from "../implementation_components/Implementation";
import { useParams } from "react-router";
import ImplementationApproval from "../implementation_components/ImplementationApproval";

function Course() {
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const routeParams = useParams();
  const { evaluationId } = routeParams;
  const [content, setContent] = useState([]);
  const [contentDetails, setContentDetails] = useState({});
  const [contentDetailsIni, setContentDetailsIni] = useState({});
  const [changeEvaluationId, setChangeEvaluationId] = useState();
  const [listDocument, setListDocument] = useState([]);
  const [listDocument1, setListDocument1] = useState([]);
  const handleResize = useCallback(() => {
    if (window.innerWidth <= 768) {
      // Adjust this width as needed
      setLeftSidebarOpen(false);
    } else {
      setLeftSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    // Set initial state
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const [open, setOpen] = useState(false);
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

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(-1);
  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(-1);
  const [actName, setActName] = useState("");
  const [reqNo, setReqNo] = useState("");
  const [canEdits, setCanEdits] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [ChangeEvaluationDetail, setChangeEvaluationDetail] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [riskLists, setRiskLists] = useState([]);
  const [CheckLists, setCheckLists] = useState([]);
  const [evalActions, setEvalActions] = useState([]);
  const [evalActivity, setEvalActivity] = useState({});
  const [appActions, setAppActions] = useState([]);
  const [appActivity, setAppActivity] = useState({});
  const [impActions, setImpActions] = useState([]);
  const [impActivity, setImpActivity] = useState({});
  const [closeActions, setCloseActions] = useState([]);
  const [closeActivity, setCloseActivity] = useState({});
  const [docStaff, setDocStaff] = useState([]);
  const [currentActivityForm, setCurrentActivityForm] = useState({});
  const [handelCommentRemark, setHandelCommentRemark] = useState("");
  const [ApprovalManager, setApprovalManager] = useState({});
  const [expanded, setExpanded] = useState(false);
  const handleExpansionChange = () => {
    setExpanded(!expanded);
  };
  const [valueRemark, setValueRemark] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviewed, setReviewed] = useState({});
  const [openMoc, setOpenMoc] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("");
  const [currentPhaseName, setCurrentPhaseName] = useState("");
  const [lastActCode, setlastActCode] = useState("");

  const [handelUrlChange, setHandelUrlChange] = useState({
    urlRemarks: "",
  });

  useEffect(() => {
    let lastIndex = -1;
    let lastActivity = null;

    // Find the last non-empty activity array
    for (let i = content.length - 1; i >= 0; i--) {
      if (content[i].activities.length > 0) {
        lastIndex = i;
        break;
      }
    }

    if (lastIndex !== -1) {
      const activities = content[lastIndex].activities;

      // Find the last activity that has canView as true
      for (let j = activities.length - 1; j >= 0; j--) {
        if (activities[j].canView === true) {
          lastActivity = activities[j];
          break;
        }
      }

      // If no such activity is found, search through all activities in all arrays
      if (!lastActivity) {
        for (let i = content.length - 1; i >= 0; i--) {
          for (let j = content[i].activities.length - 1; j >= 0; j--) {
            if (content[i].activities[j].canView === true) {
              lastIndex = i;
              lastActivity = content[i].activities[j];
              break;
            }
          }
          if (lastActivity) break;
        }
      }
      setlastActCode(lastActivity);
      // If still no such activity is found, fall back to the last activity in the lastIndex
      if (!lastActivity) {
        lastActivity = activities[activities.length - 1];
      }

      setActiveAccordionIndex(lastIndex);
      setExpandedAccordionIndex(lastIndex);
      handleStepChange(
        null,
        content[lastIndex].name,
        lastActivity.uid,
        lastActivity.code,
        lastActivity.version,
        lastActivity.refVersion,
        lastActivity.name,
        lastActivity.canEdit,
        lastActivity.canView
      );
    }
  }, [content]);

  const handleAccordionChange = (index, phaseName) => {
    if (expandedAccordionIndex === index) {
      setExpandedAccordionIndex(-1); // Collapse if already expanded
    } else {
      setExpandedAccordionIndex(index);
      // Expand if collapsed or different accordion
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

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

  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  function getRecords() {
    apiAuth.get(`/Activity/RequestLifecycle/${evaluationId}`).then((resp) => {
      setIsLoading(false);
      setContent(resp.data.data.phases);
      setValueRemark("");
    });
  }

  const handleStepChange = (
    e,
    phaseName,
    uid,
    code,
    version,
    refVersion,
    activityname,
    canedit,
    canView
  ) => {
    if (!canView) {
      console.log("This activity cannot be viewed.");
      return;
    }
    setActName(activityname);
    setCanEdits(canedit);

    const matchingPhase = content.find((phase) =>
      phase.activities.some((activity) => activity.uid === uid)
    );

    if (matchingPhase) {
      const matchingActivity = matchingPhase.activities.find(
        (activity) => activity.uid === uid
      );
      setCurrentActivityForm(matchingActivity);

      if (matchingActivity) {
        let actualPhaseName;

        switch (matchingActivity.form) {
          case DocPhasesEnum.INITIATION:
            actualPhaseName = "Initiation";
            break;
          case DocPhasesEnum.EVALUATION:
            actualPhaseName = "Evaluation";
            break;
          case DocPhasesEnum.APPROVAL:
            actualPhaseName = "Approval";
            break;
          case DocPhasesEnum.IMPLEMENTATION:
            actualPhaseName = "Implementation";
            break;
          case DocPhasesEnum.DOCIMPLCLOSURE:
            actualPhaseName = "docimplclosure";
            break;
          default:
            actualPhaseName = "docimplclosure";
        }

        setCurrentPhase(actualPhaseName);
        setCurrentPhaseName(phaseName);

        switch (actualPhaseName) {
          case "Initiation":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            break;
          case "Evaluation":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/ChangeEvaluation/Get/${evaluationId}/${matchingActivity?.formUID ? matchingActivity?.formUID : null}/${matchingActivity.version}`
              )
              .then((resp) => {
                const evaluationIds = resp.data.data.id;
                setContentDetails(resp.data?.data);
                setChangeEvaluationId(resp.data?.data.id);
                setHandelUrlChange({
                  urlRemarks: resp.data?.data.remarks,
                });

                apiAuth
                  .get(
                    `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${evaluationIds}`
                  )
                  .then((resp) => {
                    setChangeEvaluationDetail(resp.data?.data);
                    apiAuth
                      .get(`/Activity/ActivityDetails/${uid}`)
                      .then((resp) => {
                        setEvalActions(resp.data.data.actions);
                        setEvalActivity(resp.data.data.activity);
                      });
                  });
              });
            break;
          case "Approval":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${evaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);

                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setAppActions(resp.data.data.actions);
                  setAppActivity(resp.data.data.activity);
                  apiAuth
                    .get(
                      `/ApprovalManager/Remark/${resp.data.data.activity.uid}`
                    )
                    .then((resp) => {
                      setApprovalManager(resp.data?.data);
                    });
                });
              });
            break;
          case "Implementation":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);
                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setImpActions(resp.data.data.actions);
                  setImpActivity(resp.data.data.activity);
                });
                apiAuth.get(`/Staff/LOV`).then((resp) => {
                  setDocStaff(resp.data.data);
                  apiAuth
                    .get(`DocMoc/GetImplementation/${evaluationId}`)
                    .then((resp) => {
                      setTaskLists(resp.data.data.taskList);
                      setRiskLists(resp.data.data.riskAnalysisList);

                      setCheckLists(resp.data.data.checkList);
                      apiAuth
                        .get(
                          `/DocumentManager/DocList/${evaluationId}/DocImplTrSheet?changeRequestToken=${evaluationId}`
                        )
                        .then((response) => {
                          setListDocument(response?.data?.data);
                        });
                    });
                });
              });
            break;
          case "docimplclosure":
            apiAuth
              .get(`/ChangeRequest/Get?id=${evaluationId}`)
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetailsIni(resp.data?.data);
              });
            apiAuth
              .get(`DocMoc/GetImplementation/${evaluationId}`)
              .then((resp) => {
                setTaskLists(resp.data.data.taskList);
                setRiskLists(resp.data.data.riskAnalysisList);

                setCheckLists(resp.data.data.checkList);
              });
            apiAuth
              .get(
                `/SummaryDetails/List?id=${evaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
              )
              .then((resp) => {
                setReqNo(resp.data.data.requestNo);
                setContentDetails(resp.data?.data);
                apiAuth.get(`/Activity/ActivityDetails/${uid}`).then((resp) => {
                  setCloseActions(resp.data.data.actions);
                  setCloseActivity(resp.data.data.activity);
                });
              });
            apiAuth.get(`/Staff/LOV`).then((resp) => {
              setDocStaff(resp.data.data);
            });
            break;
          default:
            console.log("No matching phase found");
            return;
        }
      }
    }
  };

  const hasAddedComment = (comments) => {
    return comments.some((comment) => comment.isCreatedByMe);
  };

  const handleCheckboxChange = (id) => {
    console.log(id, "CheckLists");
    setCheckLists((prevCheckLists) =>
      prevCheckLists.map((item) =>
        item.item === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  console.log(CheckLists, "CheckLists");

  const saveChanges = () => {
    apiAuth
      .post(`/DocMoc/UpdateImplementationChecklist/${evaluationId}`, CheckLists)
      .then((response) => {
        toast?.success("Checklist successfully updated");
        setOpen(false);
        console.log(response);
      });
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

  const handelCloseMoc = (uid) => {
    const allItemsChecked = CheckLists.every((item) => item.isChecked);

    if (!allItemsChecked) {
      toast?.error(
        "Please complete all checklist items before closing the MOC."
      );
      return;
    }
    setIsLoading(true);
    apiAuth
      .post(`/DocMoc/ImplementationSubmit/${evaluationId}/22`, {
        actionUID: uid,
        activityUID: closeActivity.uid,

        formUID: closeActivity.formUID,
      })
      .then((resp) => {
        if (resp.data.statusCode == 400) {
          setIsLoading(false);

          toast?.error(resp.data.message);
        } else {
          toast?.success("MOC Successfully Closed");
          setTimeout(() => {
            getRecords();
            setIsLoading(false);
          }, 2000);
        }
      });
  };

  useEffect(() => {
    handleStepChange();
  }, []);

  if (isLoading) {
    return <FuseLoading />;
  }

  const handelOpenSide = () => {
    setLeftSidebarOpen(true);
  };

  return (
    <FusePageSimple
      header={
        <MocHeader
          activity={actName}
          reqno={reqNo}
          sidemenu={true}
          setLeftSidebarOpen={setLeftSidebarOpen}
          leftSidebarOpen={leftSidebarOpen}
        />
      }
      content={
        <div className="w-full">
          <ToastContainer className="toast-container" />

          <SwipeableViews>
            <>
              <div className=" p-16 pb-64 sm:p-24 ">
                <Initiation
                  contentDetailsIni={contentDetailsIni}
                  listDocument1={listDocument1}
                  currentActivityForm={currentActivityForm}
                  evaluationId={evaluationId}
                  setListDocument1={setListDocument1}
                />

                {currentPhase === "Evaluation" && (
                  <Evaluation
                    canEdits={canEdits}
                    evalActions={evalActions}
                    contentDetails={contentDetails}
                    evaluationId={evaluationId}
                    changeEvaluationId={changeEvaluationId}
                    setChangeEvaluationDetail={setChangeEvaluationDetail}
                    setIsLoading={setIsLoading}
                    ChangeEvaluationDetail={ChangeEvaluationDetail}
                    evalActivity={evalActivity}
                    setContent={setContent}
                  />
                )}
                {currentPhase === "Approval" &&
                  currentPhaseName == "Approval" && (
                    <Approval
                      contentDetails={contentDetails}
                      appActivity={appActivity}
                      currentActivityForm={currentActivityForm}
                      appActions={appActions}
                      ApprovalManager={ApprovalManager}
                      evaluationId={evaluationId}
                      changeEvaluationId={changeEvaluationId}
                      setIsLoading={setIsLoading}
                      getRecords={getRecords}
                      currentPhaseName={currentPhaseName}
                    />
                  )}

                {currentPhase === "Implementation" && (
                  <Implementation
                    currentActivityForm={currentActivityForm}
                    evaluationId={evaluationId}
                    setIsLoading={setIsLoading}
                    getRecords={getRecords}
                    listDocument1={listDocument1}
                    setListDocument={setListDocument}
                    setListDocument1={setListDocument1}
                    listDocument={listDocument}
                    taskLists={taskLists}
                    impActivity={impActivity}
                    riskLists={riskLists}
                    impActions={impActions}
                    docStaffs={docStaff}
                  />
                )}
                {currentPhase === "docimplclosure" && (
                  <Paper className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden">
                    <div
                      _ngcontent-fyk-c288=""
                      class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
                    >
                      <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                        Closure by Doc Controller
                      </h2>
                    </div>
                    <Paper className="w-full box_reset">
                      <div
                        _ngcontent-fyk-c288=""
                        class="p-30 pt-24 pb-24  mb-0 ng-star-inserted"
                      >
                        <div
                          _ngcontent-fyk-c288=""
                          class="flex items-center w-full mb-10 justify-between"
                        >
                          <h2
                            _ngcontent-fyk-c288=""
                            class="text-xl font-semibold"
                          >
                            Summary Details
                          </h2>
                        </div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Request No{" "}
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.requestNo}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Initiator
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.initiatorName}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Initiated On
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {new Date(
                                contentDetails?.requestDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </div>

                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Type{" "}
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.requestTypeName}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Document Name
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.projectName}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Document Type
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.documentType}New
                            </div>
                          </div>
                        </div>

                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Document Description
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetailsIni?.projectDescription}
                            </div>
                          </div>
                        </div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Reason for New Document
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetailsIni?.reasonForNewDocument}
                            </div>
                          </div>
                        </div>

                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Document Url
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              <a
                                _ngcontent-fyk-c288=""
                                target="_blank"
                                class="text-blue-500 hover:text-blue-800"
                                style={{ background: "none", color: "blue" }}
                                href={contentDetails?.documentUrl}
                              >
                                {contentDetails?.documentUrl}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="" className="my-6">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Consolidated Document Url
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              <a
                                _ngcontent-fyk-c288=""
                                target="_blank"
                                class="text-blue-500 hover:text-blue-800"
                                style={{ background: "none", color: "blue" }}
                                href={contentDetails?.documentUrl}
                              >
                                {contentDetails?.consolidatedDocumentUrl}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Paper>

                    <div className="flex flex-col px-4 py-3  border rounded m-24">
                      <ul>
                        {CheckLists.map((item) => (
                          <li key={item.id} className="pb-5">
                            <label>
                              <input
                                type="checkbox"
                                checked={item.isChecked}
                                style={{
                                  margin: "5px",
                                  color:
                                    currentActivityForm.canEdit == false
                                      ? "grey"
                                      : "black",
                                }}
                                disabled={!currentActivityForm.canEdit}
                                onChange={() => {
                                  handleCheckboxChange(item.item);
                                }}
                              />
                              <span
                                style={{
                                  margin: "5px",
                                  color:
                                    currentActivityForm.canEdit == false
                                      ? "grey"
                                      : "black",
                                }}
                              >
                                {item.item}
                              </span>{" "}
                            </label>
                          </li>
                        ))}
                        {!currentActivityForm.isComplete &&
                          currentActivityForm.status === "Pending" && (
                            <Button
                              className="whitespace-nowrap ms-5 "
                              variant="contained"
                              color="secondary"
                              style={{
                                marginTop: "10px",
                                width: "150px",
                                marginBottom: "5px",
                              }}
                              onClick={saveChanges}
                            >
                              Save
                            </Button>
                          )}
                      </ul>
                    </div>

                    {currentActivityForm.canEdit && (
                      <>
                        <div
                          _ngcontent-fyk-c288=""
                          class="flex items-center w-full  border-b justify-between"
                        ></div>
                        <div className="flex justify-end p-30 pt-24 pb-24">
                          {closeActions.map((btn) => (
                            <Button
                              className="whitespace-nowrap"
                              variant="contained"
                              color="secondary"
                              onClick={(e) => handelCloseMoc(btn.uid)}
                            >
                              {btn.name}
                            </Button>
                          ))}
                        </div>
                      </>
                    )}
                  </Paper>
                )}

                {currentPhase === "Approval" &&
                  currentPhaseName == "Implementation" && (
                    <>
                      <ImplementationApproval
                        contentDetails={contentDetails}
                        currentActivityForm={currentActivityForm}
                        getRecords={getRecords}
                        evaluationId={evaluationId}
                        lastActCode={lastActCode}
                        setContentDetails={setContentDetails}
                      />
                      <Approval
                        contentDetails={contentDetails}
                        appActivity={appActivity}
                        currentActivityForm={currentActivityForm}
                        appActions={appActions}
                        ApprovalManager={ApprovalManager}
                        evaluationId={evaluationId}
                        changeEvaluationId={changeEvaluationId}
                        setIsLoading={setIsLoading}
                        getRecords={getRecords}
                        currentPhaseName={currentPhaseName}
                      />
                    </>
                  )}
              </div>
            </>
          </SwipeableViews>
        </div>
      }
      leftSidebarWidth={300}
      leftSidebarOpen={leftSidebarOpen}
      leftSidebarContent={
        <>
          <div className="desktop_hide text-end p-30 pt-24 pb-24">
            <FuseSvgIcon
              className="text-48 cursor-pointer "
              size={24}
              style={{ display: "inline-block;" }}
              color="action"
              onClick={handelOpenSide}
            >
              heroicons-outline:menu
            </FuseSvgIcon>
          </div>
          {content.map((resp, respIndex) => (
            <Accordion
              key={respIndex}
              style={{ margin: "0px" }}
              expanded={respIndex === expandedAccordionIndex}
              onChange={() => handleAccordionChange(respIndex)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                style={{ minHeight: "60px" }}
              >
                {resp.name}
              </AccordionSummary>
              <AccordionDetails>
                <Stepper orientation="vertical">
                  {resp.activities.map((step, index) => (
                    <Step
                      key={index}
                      sx={{
                        "& .MuiStepLabel-root, & .MuiStepContent-root": {
                          cursor: step.canView
                            ? "pointer!important"
                            : "default!important",
                        },
                        "& .MuiStepContent-root": {
                          color: "text.secondary",
                          fontSize: 13,
                        },
                      }}
                      onClick={(e) =>
                        handleStepChange(
                          e,
                          resp.name,
                          step.uid,
                          step.code,
                          step.version,
                          step.refVersion,
                          step.name,
                          step.canEdit,
                          step.canView
                        )
                      }
                      expanded
                    >
                      <StepLabel
                        className="font-medium"
                        StepIconComponent={(props) => (
                          <CustomStepIcon
                            {...props}
                            index={index}
                            canView={step.canView}
                            isComplete={step.isComplete}
                            status={step.status}
                          />
                        )}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            color: "background.default",
                            "& .MuiStepIcon-text": {
                              fill: (_theme) => _theme.palette.text.secondary,
                            },
                            "&.Mui-completed": {
                              color: "secondary.main",
                              "& .MuiStepIcon-text ": {
                                fill: (_theme) =>
                                  _theme.palette.secondary.contrastText,
                              },
                            },
                            "&.Mui-active": {
                              color: "secondary.main",
                              "& .MuiStepIcon-text ": {
                                fill: (_theme) =>
                                  _theme.palette.secondary.contrastText,
                              },
                            },
                          },
                        }}
                      >
                        <span
                          style={
                            currentActivityForm.uid == step.uid
                              ? { color: "rgb(79, 70, 229)" }
                              : {}
                          }
                        >
                          {step.name} v{step.version}
                        </span>
                      </StepLabel>
                      <StepContent>
                        <CourseProgress
                          course={step.isComplete === true ? 100 : 0}
                        />
                      </StepContent>
                      {step.code == "MOC_COMPLETED" ? (
                        <StepContent style={{ fontSize: "10px" }}>
                          Ended at <b>{formatDates(step.actualEndDate)}</b>
                        </StepContent>
                      ) : (
                        <>
                          <StepContent
                            style={
                              currentActivityForm.uid == step.uid
                                ? {
                                    color: "rgb(79, 70, 229)",
                                    fontSize: "10px",
                                  }
                                : { fontSize: "10px" }
                            }
                            className="pt-4"
                          >
                            By{" "}
                            <b>
                              {step.targetUsers && step.targetUsers.length > 0
                                ? step.targetUsers[0]
                                : ""}
                            </b>
                          </StepContent>
                          <StepContent
                            style={
                              currentActivityForm.uid == step.uid
                                ? {
                                    color: "rgb(79, 70, 229)",
                                    fontSize: "10px",
                                  }
                                : { fontSize: "10px" }
                            }
                          >
                            Started at{" "}
                            <b>
                              {formatDates(step.actualStartDate, "yyyy-MM-dd")}
                            </b>
                          </StepContent>
                          <StepContent
                            style={
                              currentActivityForm.uid == step.uid
                                ? {
                                    color: "rgb(79, 70, 229)",
                                    fontSize: "10px",
                                  }
                                : { fontSize: "10px" }
                            }
                          >
                            {step.actualEndDate === null ? (
                              ""
                            ) : (
                              <>
                                {step.status} at{" "}
                                <b>
                                  {formatDates(
                                    step?.actualEndDate,
                                    "yyyy-MM-dd"
                                  )}
                                </b>
                              </>
                            )}
                          </StepContent>
                          {!step?.isComplete && (
                            <StepContent
                              style={
                                currentActivityForm.uid == step.uid
                                  ? { color: "blue", fontSize: "10px" }
                                  : { fontSize: "10px" }
                              }
                            >
                              <b> Pending</b>
                            </StepContent>
                          )}
                        </>
                      )}
                    </Step>
                  ))}
                </Stepper>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      }
      scroll="content"
      ref={pageLayout}
    />
  );
}

export default Course;
