import FusePageSimple from "@fuse/core/FusePageSimple";
import { useTheme } from "@mui/material/styles";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Step,
  StepContent,
  StepLabel,
} from "@mui/material";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import FuseLoading from "@fuse/core/FuseLoading";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiAuth } from "src/utils/http";
import CourseProgress from "../../../moc/CourseProgress";
// import Error404Page from "../../../../404/Error404Page";
// import {
//   useGetAcademyCourseQuery,
//   useUpdateAcademyCourseMutation,
// } from "../AcademyApi";
import { Evalution } from "../../../../../../../api/Api";
import { useCallback } from "react";
import axios from "axios";

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

  // const { data: course, isLoading } = useGetAcademyCourseQuery(
  //   { courseId },
  //   {
  //     skip: !courseId,
  //   }
  // );
  // const [updateCourse] = useUpdateAcademyCourseMutation();
  // useEffect(() => {
  //   /**
  //    * If the course is opened for the first time
  //    * Change ActiveStep to 1
  //    */
  //   if (course && course?.progress?.currentStep === 0) {
  //     updateCourse({ courseId, data: { progress: { currentStep: 1 } } });
  //   }
  // }, [course]);
  useEffect(() => {
    getRecords();
  }, []);
  // const currentStep = course?.progress?.currentStep || 0;

  // function updateCurrentStep(index) {
  //   if (course && (index > course.totalSteps || index < 0)) {
  //     return;
  //   }

  //   updateCourse({ courseId, data: { progress: { currentStep: index } } });
  // }

  // const fetchdataSetting = useCallback(async () => {
  //   try {
  //     const banners = await Evalution();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchdataSetting();
  //   document.body.style.position = "";
  // }, []);

  function getRecords() {
    apiAuth.get(`/Activity/RequestLifecycle/${evaluationId}`).then((resp) => {
      setContent(resp.data.data.phases);
    });
  }

  // function handleNext() {
  //   updateCurrentStep(currentStep + 1);
  // }

  // function handleBack() {
  //   updateCurrentStep(currentStep - 1);
  // }

  // function handleStepChange(e, uid) {
  //   e.preventDefault();
  //   console.log("====================================", uid);

  //   apiAuth
  //     .get(`/ChangeRequest/Get?id=d73b2f52-522f-4860-b886-a640e6b6371e`)
  //     .then((resp) => {
  //       setContentDetails(resp.data?.data);
  //     });
  // }

  function handleStepChange(e, phaseName, uid, code, version, refVersion) {
    e.preventDefault();
    console.log("Clicked Phase:", phaseName, "UID:", uid);

    switch (phaseName) {
      case "Initiation":
        axios.get(`/ChangeRequest/Get?id=${evaluationId}`).then((resp) => {
          setContentDetails(resp.data?.data);
        });
        break;
      case "Evaluation":
        axios
          .get(`/ChangeEvaluation/Get/${evaluationId}/null/1`)
          .then((resp) => {
            const evaluationIds = resp.data.data.id;
            axios
              .get(
                `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${evaluationIds}`
              )
              .then((resp) => {
                setContentDetails(resp.data?.data);
              });
          });
        break;
      case "Approval":
        axios
          .get(
            `/SummaryDetails/List?id=${evaluationId}&&code=${code}&&version=${version}&&refVersion=${refVersion}`
          )
          .then((resp) => {
            setContentDetails(resp.data?.data);
            axios.get(`/ApprovalManager/Remark/${uid}`).then((resp) => {
              setContentDetails(resp.data?.data);
            });
          });
        break;
      case "Implementation":
        axios.get(`/Implementation/Details?id=${uid}`).then((resp) => {
          setContentDetails(resp.data?.data);
        });
        break;
      default:
        console.log("No matching phase found");
        return;
    }
  }

  useEffect(() => {
    handleStepChange();
  }, [input]);

  // const activeStep = currentStep !== 0 ? currentStep : 1;

  // if (isLoading) {
  //   return <FuseLoading />;
  // }

  // if (!course) {
  //   return <Error404Page />;
  // }

  return (
    <FusePageSimple
      content={
        <div className="w-full">
          {/* <Hidden lgDown>
            <CourseProgress className="sticky top-0 z-10" course={course} />
          </Hidden>

          <Hidden lgUp>
            <Paper
              className="flex sticky top-0 z-10 items-center w-full px-16 py-8 border-b-1 shadow-0"
              square
            >
              <IconButton to="/moc/evaluation/courses" component={Link}>
                <FuseSvgIcon>
                  {theme.direction === "ltr"
                    ? "heroicons-outline:arrow-sm-left"
                    : "heroicons-outline:arrow-sm-right"}
                </FuseSvgIcon>
              </IconButton>

              <Typography className="text-13 font-medium tracking-tight mx-10">
                {course.title}
              </Typography>
            </Paper>
          </Hidden> */}

          <SwipeableViews
            // index={activeStep - 1}
            enableMouseEvents
            // onChangeIndex={handleStepChange}
          >
            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:pb-64">
              <Paper className="w-full  mx-auto sm:my-8 lg:mt-16 p-24 sm:p-40 sm:py-48 rounded-16 shadow overflow-hidden">
                <div
                  _ngcontent-fyk-c288=""
                  class="flex items-center w-full  border-b justify-between"
                >
                  <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                    MOC Document Request
                  </h2>
                </div>
                <div _ngcontent-fyk-c288="" class="px-6 mb-6 ng-star-inserted">
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
                  <div
                    _ngcontent-fyk-c288=""
                    class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
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
                  <div
                    _ngcontent-fyk-c288=""
                    class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
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
                  </div>
                  <div _ngcontent-fyk-c288="" class="grid grid-cols-1w-full">
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
                    <div _ngcontent-fyk-c288="" class="grid grid-cols-1w-full">
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
                    <div
                      _ngcontent-fyk-c288=""
                      class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
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
                    </div>
                    <div _ngcontent-fyk-c288="" class="grid grid-cols-1w-full">
                      <div _ngcontent-fyk-c288="">
                        <div
                          _ngcontent-fyk-c288=""
                          class="mt-3 leading-6 text-secondary ng-star-inserted"
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
                    </div>
                    <div _ngcontent-fyk-c288="" class="grid grid-cols-1w-full">
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
                    <div _ngcontent-fyk-c288="" class="grid grid-cols-1w-full">
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
                </div>
              </Paper>
            </div>
          </SwipeableViews>

          {/* <Hidden lgDown>
            <div className="flex justify-center w-full sticky bottom-0 p-16 pb-32 z-10">
              <ButtonGroup
                variant="contained"
                aria-label=""
                className="rounded-full"
                color="secondary"
              >
                <Button
                  className="min-h-56 rounded-full"
                  size="large"
                  startIcon={
                    <FuseSvgIcon>
                      heroicons-outline:arrow-narrow-left
                    </FuseSvgIcon>
                  }
                  onClick={handleBack}
                >
                  Prev
                </Button>
                <Button
                  className="pointer-events-none min-h-56"
                  size="large"
                >{`${activeStep}/${course.totalSteps}`}</Button>
                <Button
                  className="min-h-56 rounded-full"
                  size="large"
                  endIcon={
                    <FuseSvgIcon>
                      heroicons-outline:arrow-narrow-right
                    </FuseSvgIcon>
                  }
                  onClick={handleNext}
                >
                  Next
                </Button>
              </ButtonGroup>
            </div>
          </Hidden>

          <Hidden lgUp>
            <Box
              sx={{ backgroundColor: "background.paper" }}
              className="flex sticky bottom-0 z-10 items-center w-full p-16 border-t-1"
            >
              <IconButton
                onClick={() => setLeftSidebarOpen(true)}
                aria-label="open left sidebar"
                size="large"
              >
                <FuseSvgIcon>heroicons-outline:view-list</FuseSvgIcon>
              </IconButton>

              <Typography className="mx-8">{`${activeStep}/${course.totalSteps}`}</Typography>

              <CourseProgress className="flex flex-1 mx-8" course={course} />

              <IconButton onClick={handleBack}>
                <FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>
              </IconButton>

              <IconButton onClick={handleNext}>
                <FuseSvgIcon>heroicons-outline:arrow-narrow-right</FuseSvgIcon>
              </IconButton>
            </Box>
          </Hidden> */}
        </div>
      }
      leftSidebarWidth={300}
      leftSidebarOpen={leftSidebarOpen}
      leftSidebarContent={
        <>
          {content.map((resp, respIndex) => (
            <Accordion key={respIndex} style={{ margin: "0px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                style={{ minHeight: "60px" }}
              >
                {resp.name}
              </AccordionSummary>
              <AccordionDetails>
                <Stepper
                  // classes={{ root: "p-32" }}
                  // activeStep={activeStep - 1}
                  orientation="vertical"
                >
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
                          step.refVersion
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
                        {step.name}
                      </StepLabel>
                      <StepContent>{step.status}</StepContent>
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
