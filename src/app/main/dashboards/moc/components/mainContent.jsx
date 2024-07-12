import { Paper } from "@mui/material";
import React from "react";
import SwipeableViews from "react-swipeable-views";

function MainComponent({ contentDetails, contentChanges }) {
  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
  console.log("====================================");
  console.log(contentChanges, "contentChanges");
  console.log("====================================");
  return (
    <div className="w-full">
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden">
          <div>
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full  border-b justify-between"
            >
              <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                {contentChanges
                  ? "MOC Organisation Request"
                  : "Summary Details"}
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
                    {contentChanges ? "Date" : "Initiator"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? formatDates(contentDetails?.requestDate)
                      : contentDetails?.initiatorName}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Site In Charge" : "Initiated On"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.siteInChargeName
                      : formatDates(contentDetails?.requestDate)}
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
                    {contentChanges ? "Site" : "Type"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.siteName
                      : contentDetails?.requestTypeName}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Division" : "Expense Nature"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.divisionName
                      : contentDetails?.expenseNature}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Function" : "Expense Type"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.functionName
                      : contentDetails?.expenseType}
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
                    {contentChanges ? "Type" : "Change Type"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.typeString
                      : contentDetails?.changeType}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Employee Type" : " Project Value"}
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
                    {contentChanges
                      ? "Employee Name"
                      : "Date of termination of change"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.changeStaffName
                      : formatDates(contentDetails?.changeTerminationDate)}
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
                    {contentChanges
                      ? "Employee Designation"
                      : "Project Description"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.changeStaffDesignationName
                      : contentDetails?.projectDescription}
                  </div>
                </div>
              </div>
              <div>&nbsp;</div>

              <div _ngcontent-fyk-c288="">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  {contentChanges
                    ? "Program Completion Date"
                    : "Location of change"}
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentChanges
                    ? formatDates(contentDetails?.programCompletionDate)
                    : contentDetails?.changeLocationString}
                </div>
                {!contentChanges && (
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
                )}
              </div>
            </div>
            <div>&nbsp;</div>
          </div>
        </Paper>
      </SwipeableViews>
    </div>
  );
}

export default MainComponent;
