import { InputAdornment, Paper, TextField } from "@mui/material";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import SearchIcon from "@mui/icons-material/Search";

const EvaluationApproval = ({
  contentDetails,
  showRiskAnalysisChart,
  riskAnalysisChartOptions,
}) => {
  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  console.log("====================================");
  console.log(showRiskAnalysisChart, "showRiskAnalysisChart");
  console.log(riskAnalysisChartOptions, "showRiskAnalysisChart1");

  console.log("====================================");
  return (
    <div className="w-full h-full">
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden">
          <div>
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full  border-b justify-between"
            >
              <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                Summary Details
              </h2>
            </div>
            <div _ngcontent-fyk-c288="" class="px-6 mb-6 ng-star-inserted">
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
                    {formatDates(contentDetails?.requestDate)}
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
                    Expense Nature
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.expenseNature}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Expense Type
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.expenseType}
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
                    Change Type
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.changeType}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Project Value
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.projectValue}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Date of termination of change
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {formatDates(contentDetails?.changeTerminationDate)}
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
                    Project Description
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

              <div _ngcontent-fyk-c288="">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Location of change
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetails?.changeLocationString}
                </div>

                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Change Benefits
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.changeBenefits}
                  </div>
                </div>
              </div>
            </div>
            <div>&nbsp;</div>
          </div>
        </Paper>
      </SwipeableViews>
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div className="flex items-center w-full border-b justify-between">
            <h2 className="text-2xl font-semibold">Change Evaluation Team</h2>
          </div>
          <div className="evaluation-team-container grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentDetails?.evaluationTeam?.map((list, index) => (
              <div
                className="inventory-grid grid items-center gap-4 py-3 px-2"
                key={index}
              >
                <div
                  className="flex items-center"
                  style={{ marginTop: "15px" }}
                >
                  <img
                    src="/assets/images/etc/userpic.png"
                    alt="Card cover image"
                    className="rounded-full mr-4"
                    style={{ width: "4rem", height: "4rem" }}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold leading-none">
                      {list.staffName}
                    </span>
                    <span className="text-sm text-secondary leading-none pt-5">
                      {list?.roleName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Paper>
      </SwipeableViews>
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          >
            <h2 className="text-2xl font-semibold">Stake Holders</h2>
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
          {contentDetails?.consultaion?.map((itm) => (
            <div>
              <div className="flex items-center" style={{ marginTop: "15px" }}>
                <img
                  src="/assets/images/etc/userpic.png"
                  alt="Card cover image"
                  className="rounded-full mr-4"
                  style={{ width: "3.5rem", height: "3.5rem" }}
                />
                <div className="flex flex-col">
                  <span className="font-semibold leading-none">
                    {itm?.staff}
                  </span>
                  <span className="text-sm text-secondary leading-none pt-5">
                    Consulted On {formatDates(itm?.consultedDate)}
                  </span>
                </div>
                <div className="task-button ml-auto">
                  <button className="task-mark-reviewed-button mat-stroked-button">
                    <span className="mat-button-wrapper">
                      Click here to mark as reviewed
                    </span>
                  </button>
                </div>
              </div>
              <div className="flex items-center" style={{ marginTop: "10px" }}>
                <h5> {itm?.remark}</h5>
              </div>
              <div className="mt-5" style={{ marginTop: "20px" }}>
                <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                  Task Added
                </span>

                <span className="task-detail-value">{itm.tasks[0]}</span>
              </div>
              <div
                className="mat-form-field-wrapper"
                style={{ marginTop: "25px" }}
              >
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
                      //   onChange={(e) =>
                      //     setHandelCommentRemark(
                      //       e.target.value
                      //     )
                      //   }
                    ></textarea>
                    <button
                      className="mat-focus-indicator mat-raised-button mat-button-base"
                      style={{ float: "right" }}
                      //   onClick={() =>
                      //     handelCommentImp(imptsk.id)
                      //   }
                    >
                      <span className="mat-button-wrapper">Save</span>
                      <span className="mat-ripple mat-button-ripple"></span>
                      <span className="mat-button-focus-overlay"></span>
                    </button>
                    <span className="mat-form-field-label-wrapper"></span>
                  </div>
                </div>

                <div>&nbsp;</div>
                <div
                  _ngcontent-fyk-c288=""
                  class="flex items-center w-full  border-b justify-between"
                ></div>
              </div>
            </div>
          ))}
        </Paper>
      </SwipeableViews>
    </div>
  );
};

export default EvaluationApproval;
