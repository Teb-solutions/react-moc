import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import { parseISO, format } from "date-fns";

function Initiation(props) {
  const { contentDetails } = props;

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

  const handleOpen = () => {
    // Add your document handling logic here
  };

  return (
    <div className="w-full">
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow overflow-hidden">
          <div>
            <div className="flex items-center w-full border-b justify-between">
              <h2 className="text-2xl font-semibold">MOC Document Request</h2>
            </div>
            <div className="px-6 mb-6">
              <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Request No
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.requestNo}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">Date</div>
                  <div className="text-lg leading-6 font-medium">
                    {formatDate(contentDetails?.requestDate)}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Site In Charge
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.siteInChargeName}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div>
                  <div className="mt-3 leading-6 text-secondary">Site</div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.siteName}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">Division</div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.divisionName}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">Function</div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.functionName}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div>
                  <div className="mt-3 leading-6 text-secondary">Type</div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.typeString}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Project Value
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.projectValue}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Expense Nature
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.expenseNatureString}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Expense Type
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.expenseTypeString}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Purchase Category
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.purchaseCategoryString}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    {/* Doc Controller */}
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.docControllerName}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Project Name
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.projectName}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Project Description
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {contentDetails?.projectDescription}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full mt-8 px-6 py-3 border-t">
              <div>
                <Button
                  className="whitespace-nowrap mt-5"
                  style={{
                    border: "1px solid",
                    backgroundColor: "transparent",
                    color: "black",
                    borderColor: "rgba(203,213,225)",
                  }}
                  variant="contained"
                  color="warning"
                  startIcon={
                    <FuseSvgIcon size={20}>heroicons-solid:upload</FuseSvgIcon>
                  }
                  onClick={handleOpen}
                >
                  Document
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </SwipeableViews>
    </div>
  );
}

export default Initiation;
