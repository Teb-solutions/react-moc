import {
  Button,
  FormControl,
  FormLabel,
  OutlinedInput,
  Paper,
  Box,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";

function InitiationApproval(props) {
  const {
    ApprovalDetails,
    ApprovalManager,
    currentActivityForm,
    Actions,
    Activity,
    SubmitApprovelCreate,
    handleChangeRemark,
    valueRemark,
  } = props;

  return (
    <div className="w-full h-full">
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow overflow-hidden">
          <div>
            <div className="flex items-center w-full border-b justify-between">
              <h2 className="text-2xl font-semibold">Summary Details</h2>
            </div>
            <div className="px-6 mb-6">
              <div>&nbsp;</div>
              <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Request No
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.requestNo}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">Initiator</div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.initiatorName}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Initiated On
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.requestDate}
                  </div>
                </div>
              </div>
              <div>&nbsp;</div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div>
                  <div className="mt-3 leading-6 text-secondary">Type</div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.requestTypeName}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Expense Nature
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.expenseNature}
                  </div>
                </div>
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Expense Type
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.expenseType}
                  </div>
                </div>
              </div>
              <div>&nbsp;</div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div>
                  <div className="mt-3 leading-6 text-secondary">
                    Project Description
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.projectDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </SwipeableViews>
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 p-24 rounded-16 shadow">
          <div className="flex items-center w-full border-b justify-between">
            <h2 className="text-2xl font-semibold">Approval</h2>
          </div>
          <div>&nbsp;</div>
          {Activity.isComplete && Activity.status !== "Pending" ? (
            <div
              className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
              style={{ width: "40%" }}
            >
              <span className="font-semibold leading-none">
                Approver Comment: {ApprovalManager?.remark}
              </span>
            </div>
          ) : (
            <div
              className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
              style={{ width: "100%" }}
            >
              {currentActivityForm.canEdit && (
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                    <FormLabel
                      htmlFor="reasonForNewDocument"
                      className="font-semibold leading-none"
                    >
                      Comment
                    </FormLabel>
                    <OutlinedInput
                      id="reasonForNewDocument"
                      name="reasonForNewDocument"
                      onChange={handleChangeRemark}
                      label="Reason For Change*"
                      className="mt-5"
                      value={valueRemark}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f0f0f0",
                          "& fieldset": {
                            borderColor: "#ccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#333",
                          },
                        },
                      }}
                    />
                  </FormControl>
                </Box>
              )}
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              <div className="flex items-center w-full border-b justify-between"></div>
              {currentActivityForm.canExecute && (
                <div className="flex justify-end">
                  {Actions.map((btn) => (
                    <Button
                      key={btn.uid}
                      className="whitespace-nowrap ms-5"
                      variant="contained"
                      color="secondary"
                      style={{ marginTop: "10px" }}
                      onClick={(e) =>
                        SubmitApprovelCreate(e, btn.uid, btn.name, btn.type)
                      }
                    >
                      {btn.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Paper>
      </SwipeableViews>
    </div>
  );
}

export default InitiationApproval;
