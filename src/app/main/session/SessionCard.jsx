import {
  Box,
  Button,
  FormControl,
  FormLabel,
  OutlinedInput,
  Paper,
} from "@mui/material";
import React from "react";

const SessionCard = ({
  list,
  formatDate,
  handleCommentChange,
  commentError,
  handleAccept,
  handleReject,
}) => {
  return (
    <Paper
      className="  sm:my-8  p-24   shadow overflow-hidden"
      style={{ margin: "20px", borderRadius: "0px" }}
    >
      <div className="flex flex-col p-4">
        <div className="flex">
          <div className="flex flex-col flex-auto">
            <div className="flex flex-col leading-5 text-md text-secondary space-y-2">
              <div>
                <b style={{ fontSize: "larger" }}>
                  {list.sessionType == "Evaluation" &&
                    "New Evaluation Session started by"}{" "}
                  {list.sessionType == "Implementation" &&
                    "New Implementation Session started by"}{" "}
                  {list.sessionType == "PSSR" && "New PSSR Session started by "}{" "}
                  {list?.startedByStaffName}
                </b>
              </div>
              <div className="text-gray-500" style={{ fontSize: "15px" }}>
                {`${list.requestName} | ${list.requestType}  | ${formatDate(list.startedAt)}`}
              </div>
              {list.comments != null && list?.comments && (
                <div className="text-gray-700">
                  Comment: <b className="text-gray-500"> {list.comments}</b>
                </div>
              )}
              {list.approvalStatus == 2 && (
                <div className="text-green">
                  Session Accepted at{" "}
                  {new Date(list.updatedAt).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>
              )}
              {list.isExpired == true &&
                list.approvalStatusString == "Pending" && (
                  <div className="text-red">
                    {" "}
                    Session Expired at{" "}
                    {new Date(list.expiredTime).toLocaleString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </div>
                )}
              {list.statusString == "Canceled" && list.isExpired != true && (
                <div>
                  Session Rejected at{" "}
                  {new Date(list.updatedAt).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>
              )}
              {list.approvalStatusString == "Pending" &&
                list.statusString != "Canceled" &&
                list.isExpired == false && (
                  <>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                        <FormLabel
                          htmlFor="reasonForNewDocument"
                          className="font-semibold leading-none"
                        >
                          Comment *
                        </FormLabel>
                        <OutlinedInput
                          id="reasonForNewDocument"
                          name="reasonForNewDocument"
                          onChange={handleCommentChange}
                          label="Reason For Change*"
                          className="mt-5"
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
                        {commentError && (
                          <span style={{ color: "red", fontSize: "12px" }}>
                            {commentError}
                          </span>
                        )}
                      </FormControl>
                    </Box>
                    <div className="flex justify-start">
                      <div
                        className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                        style={{ marginTop: "15px" }}
                      >
                        <Button
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                          style={{ padding: "15px" }}
                          onClick={() =>
                            handleAccept(
                              list.id,
                              list.changeRequestId,
                              list.sessionType
                            )
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                          style={{ padding: "15px" }}
                          onClick={() =>
                            handleReject(
                              list.id,
                              list.changeRequestId,
                              list.sessionType
                            )
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default SessionCard;
