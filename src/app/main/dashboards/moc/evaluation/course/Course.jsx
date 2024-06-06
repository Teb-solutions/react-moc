import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTheme } from "@mui/material/styles";

import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { parseISO, format } from "date-fns";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Step,
  StepContent,
  StepLabel,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

import Box from "@mui/material/Box";
import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiAuth } from "src/utils/http";
import CourseProgress from "../../../moc/CourseProgress";
import MocHeader from "../../MocHeader";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/**
 * The Course page.
 */
function Course() {
  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const theme = useTheme();
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const routeParams = useParams();
  const { evaluationId } = routeParams;
  const [content, setContent] = useState([]);
  const [contentDetails, setContentDetails] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(-1);
  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(-1);
  const [actName, setActName] = useState("");
  const [reqNo, setReqNo] = useState("");
  const [canEdits, setCanEdits] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [ChangeEvaluationDetail, setChangeEvaluationDetail] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [CheckLists, setCheckLists] = useState([]);

  const [ApprovalManager, setApprovalManager] = useState({});

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [currentPhase, setCurrentPhase] = useState("");

  useEffect(() => {
    let lastIndex = -1;
    for (let i = content.length - 1; i >= 0; i--) {
      if (content[i].activities.length > 0) {
        lastIndex = i;
        break;
      }
    }
    setActiveAccordionIndex(lastIndex);
    setExpandedAccordionIndex(lastIndex);
    if (lastIndex !== -1 && content[lastIndex].activities.length > 0) {
      const lastActivity = content[lastIndex].activities[0];
      handleStepChange(
        null,
        content[lastIndex].name,
        lastActivity.uid,
        lastActivity.code,
        lastActivity.version,
        lastActivity.refVersion,
        lastActivity.name,
        lastActivity.canEdit
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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1500px",
    maxWidth: "80vw",
    height: "65%",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
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

  function getRecords() {
    apiAuth.get(`/Activity/RequestLifecycle/${evaluationId}`).then((resp) => {
      setContent(resp.data.data.phases);
    });
  }

  function handleStepChange(
    e,
    phaseName,
    uid,
    code,
    version,
    refVersion,
    activityname,
    canedit
  ) {
    setActName(activityname);
    setCurrentPhase(phaseName);
    setCanEdits(canedit);

    switch (phaseName) {
      case "Initiation":
        apiAuth.get(`/ChangeRequest/Get?id=${evaluationId}`).then((resp) => {
          setReqNo(resp.data.data.requestNo);

          setContentDetails(resp.data?.data);
        });
        break;
      case "Evaluation":
        apiAuth
          .get(`/ChangeEvaluation/Get/${evaluationId}/null/1`)
          .then((resp) => {
            const evaluationIds = resp.data.data.id;
            setContentDetails(resp.data?.data);

            apiAuth
              .get(
                `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${evaluationIds}`
              )
              .then((resp) => {
                setChangeEvaluationDetail(resp.data?.data[0]);
              });
          });
        break;
      case "Approval":
        apiAuth
          .get(
            `/SummaryDetails/List?id=${evaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
          )
          .then((resp) => {
            setReqNo(resp.data.data.requestNo);

            setContentDetails(resp.data?.data);
            apiAuth.get(`/ApprovalManager/Remark/${uid}`).then((resp) => {
              setApprovalManager(resp.data?.data);
            });
          });
        break;
      case "Implementation":
        apiAuth.get(`/ChangeRequest/Get?id=${evaluationId}`).then((resp) => {
          setReqNo(resp.data.data.requestNo);
          setContentDetails(resp.data?.data);
          apiAuth.get(`/Staff/LOV`).then((resp) => {
            apiAuth
              .get(`DocMoc/GetImplementation/${evaluationId}`)
              .then((resp) => {
                setTaskLists(resp.data.data.taskList);
                setCheckLists(resp.data.data.checkList);
              });
          });
        });
        break;
      default:
        console.log("No matching phase found");
        return;
    }
  }

  console.log(contentDetails);

  useEffect(() => {
    handleStepChange();
  }, []);

  return (
    <FusePageSimple
      header={<MocHeader activity={actName} reqno={reqNo} />}
      content={
        <div className="w-full">
          <SwipeableViews>
            <>
              <div className="flex justify-center p-16 pb-64 sm:p-24 ">
                {currentPhase === "Initiation" && (
                  <Paper className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden">
                    <div>
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full  border-b justify-between"
                      >
                        <h2
                          _ngcontent-fyk-c288=""
                          class="text-2xl font-semibold"
                        >
                          MOC Document Request
                        </h2>
                      </div>
                      <div
                        _ngcontent-fyk-c288=""
                        class="px-6 mb-6 ng-star-inserted"
                      >
                        <div>&nbsp;</div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="">
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
                          <div _ngcontent-fyk-c288="">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Date
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {formatDate(contentDetails?.requestDate)}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Site In Charge
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.siteInChargeName}
                            </div>
                          </div>
                        </div>
                        <div>&nbsp;</div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Site
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.siteName}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Division
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.divisionName}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Function
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.functionName}
                            </div>
                          </div>
                        </div>
                        <div>&nbsp;</div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="">
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
                              {contentDetails?.typeString}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="">
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
                          <div _ngcontent-fyk-c288="">
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
                              {contentDetails?.projectDescription}
                            </div>
                          </div>
                        </div>
                        <div>&nbsp;</div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="">
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
                              {contentDetails?.documentType}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="">
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
                              {contentDetails?.reasonForNewDocument}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Doc Controller
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.docControllerName}
                            </div>
                          </div>
                        </div>
                        <div>&nbsp;</div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="">
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
                                href={contentDetails?.documentUrl}
                              >
                                {contentDetails?.documentUrl}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>&nbsp;</div>

                      <div className="flex items-center justify-between w-full mt-8 px-6 py-3 border-t">
                        <div>
                          <button className="ml-1 sm:inline-flex cursor-pointer mat-button mat-stroked-button mat-button-base">
                            <span className="mat-button-wrapper">
                              <h1 className="mat-icon notranslate icon-size-4 mat-icon-no-color mr-3 justify-center" />
                              <Button
                                className="whitespace-nowrap mt-5"
                                style={{
                                  border: "1px solid",
                                  backgroundColor: "#0000",
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
                                onClick={handleOpen}
                              >
                                Document
                              </Button>

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
                                      <Typography
                                        id="transition-modal-title"
                                        variant="h6"
                                        component="h2"
                                        style={{
                                          fontSize: "4rem",
                                          fontWeight: "800px !important",
                                        }}
                                      >
                                        File Manager
                                      </Typography>
                                      <Typography
                                        id="transition-modal-description"
                                        sx={{ mt: 2 }}
                                      >
                                        0 Fiels
                                      </Typography>
                                    </Box>
                                    <Box>
                                      <Typography
                                        id="transition-modal-title"
                                        variant="h6"
                                        className="p-6 md:p-8 md:py-6 min-h-[435px] bg-[] max-h-120 space-y-8 overflow-y-auto"
                                        component="h2"
                                        style={{
                                          backgroundColor: "#e3eeff80",
                                        }}
                                      >
                                        File Manager
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Fade>
                              </Modal>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Paper>
                )}
                {currentPhase === "Evaluation" && (
                  <>
                    <Paper
                      className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden"
                      style={{ marginRight: "15px", width: "100%" }}
                    >
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full  border-b justify-between"
                      >
                        <h2
                          _ngcontent-fyk-c288=""
                          class="text-2xl font-semibold"
                        >
                          Evaluation
                        </h2>
                      </div>
                      <div>&nbsp;</div>
                      <div className="mt-2 mb-4 p-6 py-2">
                        <b>Stakeholders</b>
                      </div>
                      <Accordion style={{ margin: "0px" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                          style={{ minHeight: "60px" }}
                        >
                          <div
                            className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                            style={{ width: "40%" }}
                          >
                            <div className="flex items-center">
                              <img
                                src="/assets/images/etc/userpic.png"
                                alt="Card cover image"
                                className="rounded-full mr-4"
                                style={{ width: "4rem", height: "4rem" }}
                              />
                              <div className="flex flex-col">
                                <span className="font-semibold leading-none">
                                  {ChangeEvaluationDetail.staff}
                                </span>
                                <span className="text-sm text-secondary leading-none pt-5">
                                  Consulted on{" "}
                                  {formatDate(
                                    ChangeEvaluationDetail?.consultedDate
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                            <div className="flex items-center">
                              <div
                                className="py-0.5 px-3 rounded-full text-sm"
                                style={{
                                  backgroundColor: "rgba(134,239,172)",
                                  padding: "5px",
                                }}
                              >
                                Comments Added
                              </div>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stepper orientation="vertical">
                            <Step>
                              <div className="mat-expansion-panel-body ng-tns-c137-15">
                                <div className="mt-2 ng-tns-c137-15">
                                  <div className="prose prose-sm max-w-5xl">
                                    <div className="ng-star-inserted">
                                      <span
                                        className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                        style={{
                                          backgroundColor: "rgba(241,245,249)",
                                          padding: "10px",
                                        }}
                                      >
                                        Comments
                                      </span>
                                      <span>complete</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Step>
                          </Stepper>
                        </AccordionDetails>
                      </Accordion>
                      <div className="mt-5 mb-4 p-6 py-2">
                        <h5>No stakeholders added</h5>
                      </div>
                      <div
                        className=" mb-4 p-6 py-2"
                        style={{ marginTop: "2.5rem" }}
                      >
                        <div className="flex row">
                          <div className="ng-star-inserted">
                            <div>Consolidated Document Url</div>
                            <div className="font-semibold">
                              <a
                                href="https://consolidatedurl.com"
                                rel="noopener noreferrer"
                              >
                                {contentDetails?.remarks}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Paper>
                    {canEdits && (
                      <Paper
                        className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden"
                        style={{ width: "45%" }}
                      >
                        <div
                          _ngcontent-fyk-c288=""
                          class="flex items-center w-full  border-b justify-between"
                        >
                          <h2 _ngcontent-fyk-c288="" class="">
                            Help
                          </h2>
                        </div>
                        <div className="prose">
                          <ul className="text-sm">
                            <li>
                              After stakeholders are added, a task is assigned
                              to each stakeholder to review the document.
                              Stakeholders can view the document by going to MOC
                              details from Tasks page which contains the
                              document share point link and they need to add
                              their comments in the document uploaded in share
                              point.
                            </li>
                            <li>
                              Once they have reviewed the document, each
                              stakeholder has to go to Tasks page and submit the
                              task as an acknowledgement.
                            </li>
                            <li>
                              Here information of each stakeholder having
                              reviewed the document is available.
                            </li>
                            <li>
                              Document author will call internal (Plant/office)
                              stakeholders and conduct session to review the
                              document uploaded in share point and confirm
                              review of document.
                            </li>
                            <li>
                              Document author will create clean version of the
                              document incorporating all modifications /
                              suggestions into same location in share point.
                            </li>
                            <li>
                              Document author has to update the new consolidated
                              document url here.
                            </li>
                            <li>
                              Document author can then submit for approval.
                            </li>
                          </ul>
                        </div>
                      </Paper>
                    )}
                  </>
                )}
                {currentPhase === "Approval" && (
                  <Paper className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden">
                    <div>
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full  border-b justify-between"
                      >
                        <h2
                          _ngcontent-fyk-c288=""
                          class="text-2xl font-semibold"
                        >
                          Summary Details
                        </h2>
                      </div>
                      <div
                        _ngcontent-fyk-c288=""
                        class="px-6 mb-6 ng-star-inserted"
                      >
                        <div>&nbsp;</div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="">
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
                          <div _ngcontent-fyk-c288="">
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
                          <div _ngcontent-fyk-c288="">
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
                              {contentDetails?.requestDate}
                            </div>
                          </div>
                        </div>
                        <div>&nbsp;</div>

                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="">
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
                          <div _ngcontent-fyk-c288="">
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
                          <div _ngcontent-fyk-c288="">
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
                              {contentDetails?.projectDescription}
                            </div>
                          </div>
                        </div>
                        <div>&nbsp;</div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="">
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
                          <div _ngcontent-fyk-c288="">
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
                              {contentDetails?.reasonForNewDocument}
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="">
                            <div
                              _ngcontent-fyk-c288=""
                              class="mt-3 leading-6 text-secondary"
                            >
                              Doc Controller
                            </div>
                            <div
                              _ngcontent-fyk-c288=""
                              class="text-lg leading-6 font-medium"
                            >
                              {" "}
                              {contentDetails?.docControllerName}
                            </div>
                          </div>
                        </div>
                        <div>&nbsp;</div>
                        <div
                          _ngcontent-fyk-c288=""
                          class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
                        >
                          <div _ngcontent-fyk-c288="">
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
                                href={contentDetails?.consolidatedDocumentUrl}
                              >
                                {contentDetails?.consolidatedDocumentUrl}
                              </a>
                            </div>
                          </div>
                          <div _ngcontent-fyk-c288="">
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
                                href={contentDetails?.documentUrl}
                              >
                                {contentDetails?.documentUrl}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>&nbsp;</div>
                    </div>
                  </Paper>
                )}
                {currentPhase === "Implementation" && (
                  <>
                    <Paper
                      className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden"
                      style={{ marginRight: "15px", width: "100%" }}
                    >
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full  border-b justify-between"
                      >
                        <h2
                          _ngcontent-fyk-c288=""
                          class="text-2xl font-semibold"
                        >
                          Implementation
                        </h2>

                        <Button
                          className="whitespace-nowrap mt-5 mb-5"
                          style={{
                            border: "1px solid",
                            backgroundColor: "#0000",
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
                          onClick={handleOpen}
                        >
                          Training Attendence Sheet
                        </Button>

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
                                <Typography
                                  id="transition-modal-title"
                                  variant="h6"
                                  component="h2"
                                  style={{
                                    fontSize: "4rem",
                                    fontWeight: "800px !important",
                                  }}
                                >
                                  File Manager
                                </Typography>
                                <Typography
                                  id="transition-modal-description"
                                  sx={{ mt: 2 }}
                                >
                                  0 Fiels
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  id="transition-modal-title"
                                  variant="h6"
                                  className="p-6 md:p-8 md:py-6 min-h-[435px] bg-[] max-h-120 space-y-8 overflow-y-auto"
                                  component="h2"
                                  style={{
                                    backgroundColor: "#e3eeff80",
                                  }}
                                >
                                  File Manager
                                </Typography>
                              </Box>
                            </Box>
                          </Fade>
                        </Modal>
                      </div>

                      <Box sx={{ width: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                          >
                            <Tab label="Item One" {...a11yProps(0)} />
                            <Tab label="Item Two" {...a11yProps(1)} />
                          </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                          <div
                            _ngcontent-fyk-c288=""
                            class="flex items-center w-full  border-b justify-between"
                          >
                            <div className="flex items-center">
                              <h2
                                _ngcontent-fyk-c288=""
                                class="text-2xl font-semibold"
                                style={{ marginRight: "15px" }}
                              >
                                {taskLists.length} Tasks
                              </h2>
                              <Button
                                className="whitespace-nowrap mt-5 mb-5"
                                style={{
                                  border: "1px solid",
                                  backgroundColor: "#0000",
                                  color: "black",
                                  borderColor: "rgba(203,213,225)",
                                }}
                                variant="contained"
                                color="warning"
                                onClick={handleOpen}
                              >
                                Audits Lists
                              </Button>
                            </div>

                            <TextField
                              variant="filled"
                              fullWidth
                              placeholder="Search tasks"
                              style={{ marginBottom: "15px" }}
                              value={searchTerm}
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
                          {taskLists.map((task) => (
                            <Accordion key={task.id} style={{ margin: "0px" }}>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${task.id}-content`}
                                id={`panel${task.id}-header`}
                                style={{ minHeight: "60px" }}
                              >
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    Task #{task.id}
                                  </div>
                                </div>

                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  style={{ width: "17%" }}
                                >
                                  <div
                                    className="flex items-center"
                                    style={{ color: "rgba(22,163,74)" }}
                                  >
                                    Approved
                                  </div>
                                </div>
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    No Risks
                                  </div>
                                </div>
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    {task.assignedStaff}
                                  </div>
                                </div>

                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    {formatDate(task.dueDate)}
                                  </div>
                                </div>
                                <div
                                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                  style={{ width: "17%" }}
                                >
                                  <div className="flex items-center">
                                    <Button
                                      className="whitespace-nowrap mt-5 mb-5"
                                      style={{
                                        border: "1px solid",
                                        backgroundColor: "#0000",
                                        color: "black",
                                        borderColor: "rgba(203,213,225)",
                                      }}
                                      variant="contained"
                                      color="warning"
                                      onClick={handleOpen}
                                    >
                                      Audits
                                    </Button>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Stepper orientation="vertical">
                                  <Step>
                                    <div className="mat-expansion-panel-body">
                                      <div className="mt-2">
                                        <div className="prose prose-sm max-w-5xl">
                                          <div>
                                            <span
                                              className="inline-flex bg-default rounded mr-5 text-secondary font-semibold"
                                              style={{
                                                backgroundColor:
                                                  "rgba(241,245,249)",
                                                padding: "10px",
                                              }}
                                            >
                                              Comments
                                            </span>
                                            <span>{task.actionComments}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Step>
                                </Stepper>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                          <div className="flex flex-col px-4 py-3 w-full border rounded">
                            <ul>
                              {CheckLists.map((item) => (
                                <li key={item.id} className="pb-5">
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={item.isChecked}
                                      style={{ margin: "5px" }}
                                      onChange={() => {
                                        // Handle checkbox change if necessary
                                      }}
                                    />
                                    {item.item}{" "}
                                    {/* Assuming each item has a name property */}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CustomTabPanel>
                      </Box>
                    </Paper>
                  </>
                )}
              </div>
              <div className="flex justify-center p-16  pb-64 sm:p-24 ">
                {currentPhase === "Approval" && (
                  <>
                    <Paper
                      className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden"
                      style={{ marginRight: "15px", width: "100%" }}
                    >
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full  border-b justify-between"
                      >
                        <h2
                          _ngcontent-fyk-c288=""
                          class="text-2xl font-semibold"
                        >
                          Stake Holders
                        </h2>
                        <TextField
                          variant="filled"
                          fullWidth
                          placeholder="Search"
                          style={{ marginBottom: "15px" }}
                          value={searchTerm}
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
                      <div>&nbsp;</div>

                      <div
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        style={{ width: "40%" }}
                      >
                        <div className="flex items-center">
                          <img
                            src="/assets/images/etc/userpic.png"
                            alt="Card cover image"
                            className="rounded-full mr-4"
                            style={{ width: "4rem", height: "4rem" }}
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold leading-none">
                              {contentDetails.initiatorName}
                            </span>
                            <span className="text-sm text-secondary leading-none pt-5">
                              Consulted on{" "}
                              {formatDate(contentDetails?.requestDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Paper>
                  </>
                )}
              </div>
              <div className="flex justify-center p-16 pb-64 sm:p-24 ">
                {currentPhase === "Approval" && (
                  <>
                    <Paper
                      className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden"
                      style={{ marginRight: "15px", width: "100%" }}
                    >
                      <div
                        _ngcontent-fyk-c288=""
                        class="flex items-center w-full  border-b justify-between"
                      >
                        <h2
                          _ngcontent-fyk-c288=""
                          class="text-2xl font-semibold"
                        >
                          Approval
                        </h2>
                      </div>
                      <div>&nbsp;</div>

                      <div
                        className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                        style={{ width: "40%" }}
                      >
                        <span className="font-semibold leading-none">
                          Approver Comment: {ApprovalManager.remark}
                        </span>
                      </div>
                    </Paper>
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
                          cursor: "pointer!important",
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
                          step.canEdit
                        )
                      }
                      expanded
                    >
                      <StepLabel
                        className="font-medium"
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
                        {step.name} v{step.version}
                      </StepLabel>
                      <StepContent>
                        <CourseProgress
                          course={step.isComplete === true ? 100 : 0}
                        />
                      </StepContent>
                      <StepContent
                        style={{ fontSize: "10px" }}
                        className="pt-4"
                      >
                        By{" "}
                        <b>
                          {step.targetUsers && step.targetUsers.length > 0
                            ? step.targetUsers[0]
                            : ""}
                        </b>
                      </StepContent>
                      <StepContent style={{ fontSize: "10px" }}>
                        Started at <b>{formatDate(step.actualStartDate)}</b>
                      </StepContent>
                      <StepContent style={{ fontSize: "10px" }}>
                        {step.actualEndDate === null ? (
                          ""
                        ) : (
                          <>
                            {step.status} at{" "}
                            <b>{formatDate(step.actualEndDate)}</b>
                          </>
                        )}
                      </StepContent>
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
