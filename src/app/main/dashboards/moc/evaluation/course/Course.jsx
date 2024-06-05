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

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiAuth } from "src/utils/http";
import CourseProgress from "../../../moc/CourseProgress";
import MocHeader from "../../MocHeader";

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
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(-1);
  const [expandedAccordionIndex, setExpandedAccordionIndex] = useState(-1);
  const [actName, setActName] = useState("");
  const [reqNo, setReqNo] = useState("");
  const [currentPhase, setCurrentPhase] = useState("Initiation");

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
        lastActivity.name
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
      return format(date, "MMMM dd, yyyy, h:mm:ss a");
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
    activityname
  ) {
    setActName(activityname);
    setCurrentPhase(phaseName);

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
            apiAuth
              .get(
                `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${evaluationIds}`
              )
              .then((resp) => {
                setContentDetails(resp.data?.data);
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
              setContentDetails(resp.data?.data);
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
              .then((resp) => {});
          });
        });
        break;
      default:
        console.log("No matching phase found");
        return;
    }
  }

  useEffect(() => {
    handleStepChange();
  }, []);

  return (
    <FusePageSimple
      header={<MocHeader activity={actName} reqno={reqNo} />}
      content={
        <div className="w-full">
          <SwipeableViews enableMouseEvents>
            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:pb-64">
              {currentPhase === "Initiation" && (
                <Paper className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden">
                  <div>
                    <div
                      _ngcontent-fyk-c288=""
                      class="flex items-center w-full  border-b justify-between"
                    >
                      <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
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
                            {contentDetails?.requestDate}
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
                      <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                        Evaluation
                      </h2>
                    </div>
                  </Paper>
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
                          After stakeholders are added, a task is assigned to
                          each stakeholder to review the document. Stakeholders
                          can view the document by going to MOC details from
                          Tasks page which contains the document share point
                          link and they need to add their comments in the
                          document uploaded in share point.
                        </li>
                        <li>
                          Once they have reviewed the document, each stakeholder
                          has to go to Tasks page and submit the task as an
                          acknowledgement.
                        </li>
                        <li>
                          Here information of each stakeholder having reviewed
                          the document is available.
                        </li>
                        <li>
                          Document author will call internal (Plant/office)
                          stakeholders and conduct session to review the
                          document uploaded in share point and confirm review of
                          document.
                        </li>
                        <li>
                          Document author will create clean version of the
                          document incorporating all modifications / suggestions
                          into same location in share point.
                        </li>
                        <li>
                          Document author has to update the new consolidated
                          document url here.
                        </li>
                        <li>Document author can then submit for approval.</li>
                      </ul>
                    </div>
                  </Paper>
                </>
              )}
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
                      <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                        Approval
                      </h2>
                    </div>
                  </Paper>
                </>
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
                      <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                        Implementation
                      </h2>
                    </div>
                  </Paper>
                </>
              )}
            </div>
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
                          step.name
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
