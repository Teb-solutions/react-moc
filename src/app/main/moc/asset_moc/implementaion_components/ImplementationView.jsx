import {
  Badge,
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { withStyles } from "@mui/styles";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { set } from "lodash";

const ImplementationView = (props) => {
  const {
    steps,
    ImpDetails,
    setActiveStep,
    activeStep,
    handleOpenImplemntationTask,
    handleAccordionChange,
    handleReset,
    isComplete,
    status,
    canEdit,
    handleBack,
    handleNext,
    ChangeDeadlineLabel,
    expanded,
    formatDate,
    impComments,
    handelComments,
    setComments,
    comments,
    handelOpenAuditComment,
    documentCounts,
    handelOpenAudit,
    handleOpen,
    errorMessage,
    isButtonDisabled,
    handledateExtendopen,
    handelApproveImpl,
    setErrorMessage,
    handelRejectImpl,
  } = props;
  const StyledBadge = withStyles((theme) => ({
    Badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);
  return (
    <>
      <Box className="p-30 pt-24 pb-24" sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps?.map((step, index) => {
            const tasksForStep = ImpDetails.filter(
              (detail) =>
                ChangeDeadlineLabel.get(detail.deadline) === step?.label
            );

            return (
              <Step key={step?.label}>
                <StepLabel
                  onClick={() => setActiveStep(index)}
                  StepIconProps={{
                    sx: {
                      "&.MuiStepIcon-root": { color: "blue" },
                      "&.MuiStepIcon-active": { color: "blue" },
                      "&.MuiStepIcon-completed": { color: "blue" },
                    },
                  }}
                  sx={{
                    backgroundColor:
                      activeStep === index ? "#f0f0f0" : "#f9f9f9",
                    padding: "15px",
                    borderRadius: "10px",
                    marginTop: "0",
                    cursor: "pointer",
                  }}
                >
                  {step?.label}
                </StepLabel>
                <StepContent>
                  <div
                    _ngcontent-fyk-c288=""
                    class="flex flex-wrap items-center w-full justify-between pt-10 pb-10"
                  >
                    <div className="flex flex-wrap items-center">
                      <h2
                        _ngcontent-fyk-c288=""
                        class="text-lg font-semibold"
                        style={{ marginRight: "15px" }}
                      >
                        {tasksForStep.length} Tasks
                      </h2>
                      {!isComplete && status === "Pending" && canEdit && (
                        <Button
                          className="whitespace-nowrap "
                          style={{
                            border: "1px solid",
                            backgroundColor: "#0000",
                            color: "black",
                            borderColor: "rgba(203,213,225)",
                          }}
                          variant="contained"
                          color="warning"
                          onClick={handleOpenImplemntationTask}
                        >
                          Add New Task
                        </Button>
                      )}
                      {/* <Button
                            className="whitespace-nowrap mt-5 mb-5 ms-5"
                            style={{
                              border: "1px solid",
                              backgroundColor: "#0000",
                              color: "black",
                              borderColor: "rgba(203,213,225)",
                            }}
                            variant="contained"
                            color="warning"
                            // onClick={handleOpen}
                          >
                            Audits Lists
                          </Button> */}
                    </div>

                    <TextField
                      variant="filled"
                      fullWidth
                      placeholder="Search"
                      className="mt-10 md:mt-0"
                      style={{
                        backgroundColor: "white",
                      }}
                      //   value={searchTerm}
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
                  {ImpDetails.map((detail) => {
                    const deadlineLabel = ChangeDeadlineLabel.get(
                      detail.deadline
                    );

                    if (deadlineLabel === step?.label) {
                      return (
                        <Accordion
                          key={detail.id}
                          expanded={expanded === detail?.id}
                          sx={{
                            mt: 2,
                            minHeight: "70px",
                            transition: "height 0.3s",
                            "&.Mui-expanded": {
                              minHeight: "100px",
                            },
                            "@media (max-width: 600px)": {
                              mt: 4,
                            },
                          }}
                          onChange={handleAccordionChange(detail.id)}
                        >
                          <AccordionSummary
                            className="justify-content-Accordian_title"
                            style={{ minHeight: "60px" }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index + 1}-content`}
                            id={`panel${index + 1}-header`}
                            onClick={(e) => handelComments(e, detail.id)}
                          >
                            <div className="d-flex flex-wrap justify-between w-100 pr-10">
                              <div
                                className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              // style={{ width: "17%" }}
                              >
                                <div className="flex items-center">
                                  <b>Task #{detail.sourceTaskId}</b>
                                </div>
                              </div>

                              <div
                                className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              // style={{ width: "17%" }}
                              >
                                <div className="flex items-center" style={{}}>
                                  {detail.isCompleted &&
                                    detail.taskStatus === 3 ? (
                                    <span className="text-green">Approved</span>
                                  ) : detail.isCompleted &&
                                    detail.taskStatus !== 3 ? (
                                    <span className="text-red">
                                      Awaiting Approval
                                    </span>
                                  ) : (
                                    <span className="text-black">
                                      <b>Not Completed</b>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div
                                className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              // style={{ width: "17%" }}
                              >
                                <div className="flex items-center">
                                  No Risks
                                </div>
                              </div>
                              <div
                                className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              // style={{ width: "17%" }}
                              >
                                <div className="flex items-center">
                                  {detail.assignedStaff}
                                </div>
                              </div>

                              <div
                                className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              // style={{ width: "17%" }}
                              >
                                <div className="flex items-center">
                                  {formatDate(detail.dueDate)}
                                </div>
                              </div>
                              <div
                                className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                              // style={{ width: "17%" }}
                              >
                                <div className="flex items-center">
                                  <StyledBadge
                                    badgeContent={detail?.audits?.length}
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
                                      onClick={(e) => {
                                        handelOpenAudit(detail.audits, "");
                                        e.stopPropagation();
                                      }}
                                    >
                                      Audits
                                    </Button>
                                  </StyledBadge>
                                  {canEdit && (

                                    <Button
                                      className="whitespace-nowrap ms-5"
                                      style={{
                                        border: "1px solid",
                                        backgroundColor: "#0000",
                                        color: "black",
                                        borderColor: "rgba(203,213,225)",
                                      }}
                                      variant="contained"
                                      color="warning"
                                      onClick={(e) => {
                                        handelOpenAuditComment(detail.id);
                                        e.stopPropagation();
                                      }}
                                    >
                                      <FuseSvgIcon
                                        className="text-48"
                                        size={24}
                                        color="action"
                                      >
                                        heroicons-outline:document-text
                                      </FuseSvgIcon>
                                    </Button>
                                  )}
                                  {/* )} */}
                                  {detail?.taskDateUpdates.length !== 0 &&
                                    canEdit &&
                                    (!detail.taskDateUpdates[
                                      detail.taskDateUpdates.length - 1
                                    ]?.approvedComments ? (
                                      <Button
                                        className="whitespace-nowrap ms-5"
                                        style={{
                                          border: "1px solid",
                                          backgroundColor: "#0000",
                                          color: "black",
                                          borderColor: "rgba(203,213,225)",
                                        }}
                                        variant="contained"
                                        color="warning"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handledateExtendopen(
                                            e,
                                            detail,
                                            "true"
                                          );
                                        }}
                                      >
                                        <FuseSvgIcon
                                          className="text-48"
                                          size={24}
                                          color="red"
                                        >
                                          heroicons-outline:calendar
                                        </FuseSvgIcon>
                                      </Button>
                                    ) : (
                                      <Button
                                        className="whitespace-nowrap ms-5"
                                        style={{
                                          border: "1px solid",
                                          backgroundColor: "#0000",
                                          color: "black",
                                          borderColor: "rgba(203,213,225)",
                                        }}
                                        variant="contained"
                                        color="warning"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handledateExtendopen(
                                            e,
                                            detail,
                                            "false"
                                          );
                                        }}
                                      >
                                        <FuseSvgIcon
                                          className="text-48"
                                          size={24}
                                          color="action"
                                        >
                                          heroicons-outline:calendar
                                        </FuseSvgIcon>
                                      </Button>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Stepper orientation="vertical">
                              <Step>
                                <div style={{ alignItems: "flex-start" }}>
                                  <div className="flex flex-col items-start mb-08">
                                    <div
                                      className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                      style={{
                                        padding: "10px",
                                        backgroundColor: "#dbeafe",
                                      }}
                                    >
                                      <b>{detail?.assignedByStaff}</b>
                                      <p>
                                        What is the task : {detail?.actionWhat}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-start mb-08">
                                    <div
                                      className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                      style={{
                                        padding: "10px",
                                        backgroundColor: "#dbeafe",
                                      }}
                                    >
                                      <p>
                                        How is Task done : {detail?.actionHow}
                                      </p>
                                    </div>
                                  </div>
                                  {detail?.particularName &&
                                    detail?.particularSubName && (
                                      <div className="flex flex-col items-start mb-08">
                                        <div
                                          className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                          style={{
                                            padding: "10px",
                                            backgroundColor: "#dbeafe",
                                          }}
                                        >
                                          <p>
                                            Impact :{" "}
                                            {`${detail?.particularName} > ${detail?.particularSubName}`}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  <div className="flex flex-col items-start mb-08">
                                    <div
                                      className="relative max-w-3/4 px-3 py-2 rounded-lg bg-blue-100 text-gray-700"
                                      style={{
                                        padding: "10px",
                                        backgroundColor: "#dbeafe",
                                      }}
                                    >
                                      <p>
                                        Due Date : {formatDate(detail.dueDate)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center my-3">
                                    <div className="flex-auto border-b"></div>
                                    <div
                                      className="flex-0 mt-10 "
                                      style={{ fontSize: "xx-small" }}
                                    >
                                      <b>{detail?.assignedByStaff}</b> has
                                      assigned task to{" "}
                                      <b>{detail?.assignedStaff}</b> on{" "}
                                      {formatDate(detail.assignedAt)}
                                    </div>
                                    <div className="flex-auto border-b"></div>
                                  </div>

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
                                              {detail.assignedStaff}{" "}
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
                                                  ? `Started on ${formatDate(msg.startedDate)}`
                                                  : msg.workInProgressDate &&
                                                    !msg.completedDate &&
                                                    !msg.dueDate
                                                    ? `Work in Progress since ${formatDate(msg.workInProgressDate)}`
                                                    : msg.dueDate &&
                                                      !msg.completedDate
                                                      ? `Due on ${formatDate(msg.dueDate)}`
                                                      : msg.completedDate
                                                        ? `Completed on ${formatDate(msg.completedDate)}`
                                                        : "Unknown"}
                                              </small>
                                            </div>
                                          </div>
                                          {documentCounts[msg.id] ? (
                                            documentCounts[msg.id] != 0 && (
                                              <button
                                                className="icon-button"
                                                onClick={() =>
                                                  handleOpen(msg.id)
                                                }
                                                style={{
                                                  top: "-19px",
                                                  right: "10px",
                                                }}
                                              >
                                                <StyledBadge
                                                  badgeContent={
                                                    documentCounts[msg.id]
                                                  }
                                                >
                                                  <button
                                                    className="icon-button"
                                                    onClick={() =>
                                                      handleOpen(msg.id)
                                                    }
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
                                              {detail.assignedByStaff}{" "}
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
                                                  {new Date(
                                                    msg.approvalStatusDate
                                                  ).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    hour12: true,
                                                  })}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  {detail?.isCompleted &&
                                    // detail?.taskStatus !== 3 && 
                                    (
                                      <>
                                        <div className="flex flex-col shrink-0 mt-5 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                                          <div
                                            _ngcontent-fyk-c288=""
                                            class="flex items-center w-full  border-b justify-between"
                                          ></div>
                                        </div>
                                        {canEdit && (
                                          <div
                                            className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                                            style={{ width: "100%" }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                              }}
                                            >
                                              <FormControl
                                                fullWidth
                                                sx={{
                                                  m: 1,
                                                  maxWidth: "100%",
                                                }}
                                              >
                                                <span className="font-semibold leading-none">
                                                  Comments*
                                                </span>
                                                <OutlinedInput
                                                  id="reasonForNewDocument"
                                                  name="reasonForNewDocument"
                                                  value={comments}
                                                  onChange={(e) => {
                                                    setComments(e.target.value);
                                                    if (
                                                      e.target.value.trim() !==
                                                      ""
                                                    ) {
                                                      setErrorMessage(""); // Clear error message on input change
                                                    }
                                                  }}
                                                  label="Reason For Change*"
                                                  className="mt-5"
                                                />
                                                {errorMessage && (
                                                  <div className="text-red-500 text-sm mt-1">
                                                    {errorMessage}
                                                  </div>
                                                )}
                                              </FormControl>
                                            </Box>
                                          </div>
                                        )}
                                        {canEdit && (
                                          <div className="flex justify-start ">
                                            
                                            <Button
                                              className="whitespace-nowrap ms-5 "
                                              variant="contained"
                                              color="primary"
                                              style={{
                                                marginTop: "10px",
                                                // backgroundColor: "white",
                                                // color: "black",
                                              }}
                                              onClick={(e) =>
                                                {handelRejectImpl(e, detail)
                                                setComments("")}
                                              }
                                              disabled={isButtonDisabled}
                                            >
                                               {detail.taskStatus == 3 ?
                                                    'Reopen' : "Reject"}
                                            </Button>
                                            {detail.taskStatus!==3 && <Button
                                              className="whitespace-nowrap ms-5 "
                                              variant="contained"
                                              color="secondary"
                                              style={{
                                                marginTop: "10px",
                                              }}
                                              onClick={(e) =>
                                              {  handelApproveImpl(e, detail)
                                                setComments("")}
                                              }
                                              disabled={isButtonDisabled}
                                            >
                                              Approve
                                            </Button>}
                                          </div>
                                        )}
                                      </>
                                    )}
                                </div>
                              </Step>
                            </Stepper>
                          </AccordionDetails>
                        </Accordion>
                      );
                    }
                    return null;
                  })}
                  <div
                    className="flex mt-7 pt-24"
                    style={{ justifyContent: "end" }}
                  >
                    <Box>
                      <div>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{
                            mr: 1,
                            backgroundColor: index !== 0 ? "black" : "default",
                            color: index !== 0 ? "white" : "default",
                            "&:hover": {
                              backgroundColor:
                                index !== 0 ? "black" : "default",
                            },
                          }}
                          style={{
                            paddingLeft: "35px",
                            paddingRight: "35px",
                          }}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mr: 1 }}
                          style={{
                            color: "white",
                            backgroundColor: "blue",
                            paddingLeft: "35px",
                            paddingRight: "35px",
                          }}
                        >
                          {index === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                      </div>
                    </Box>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps?.length && (
          <Paper square elevation={0} className="pt-10 pb-10">
            <Button
              onClick={handleReset}
              sx={{ mt: 1, mr: 1 }}
              style={{
                border: "1px solid",
                backgroundColor: "#0000",
                color: "black",
                borderColor: "rgba(203,213,225)",
              }}
            >
              Reset
            </Button>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default ImplementationView;
