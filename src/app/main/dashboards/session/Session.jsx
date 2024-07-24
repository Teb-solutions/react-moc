import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { apiAuth } from "src/utils/http";
import { format, parseISO } from "date-fns";
import FuseLoading from "@fuse/core/FuseLoading";
const SessionList = () => {
  const [sessionList, setSessionList] = useState([]);
  const [Comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  function getRecords() {
    apiAuth.get(`/NotificationManager/GetAllSessions/`).then((resp) => {
      setIsLoading(false);
      setSessionList(resp.data.data);
    });
  }

  useEffect(() => {
    getRecords();
  }, []);

  const formatDate = (isoString) => {
    // Parse the ISO string
    const date = parseISO(isoString);

    // Format the date
    return format(date, "MMM d, h:mm a");
  };

  const handleAccept = (id, ChangeId) => {
    setIsLoading(true);

    apiAuth
      .put(
        `/ChangeEvaluationSession/SessionApprove/${ChangeId}/${id}/Approve`,
        {
          comments: Comment,
        }
      )
      .then((resp) => {
        getRecords();
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const handleReject = (id, ChangeId) => {
    setIsLoading(true);
    apiAuth
      .put(`/ChangeEvaluationSession/SessionApprove/${ChangeId}/${id}/Reject`, {
        comments: Comment,
      })
      .then((resp) => {
        getRecords();
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="" style={{ margin: "30px" }}>
        <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            style={{ fontSize: "xx-large", color: "black" }}
          >
            <b>Session List</b>
          </InputLabel>
        </div>
      </div>
      <div
        _ngcontent-fyk-c288=""
        class="flex items-center w-full  border-b justify-between"
      ></div>
      {sessionList?.map((list) => (
        <>
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
                        {list.sessionType == "PSSR" &&
                          "New PSSR Session started by "}{" "}
                        {list?.startedByStaffName}
                      </b>
                    </div>
                    <div className="text-gray-500" style={{ fontSize: "15px" }}>
                      {`${list.requestName} | ${list.requestType}  | ${formatDate(list.startedAt)}`}
                    </div>
                    {list.comments != null && (
                      <div>
                        Comment: <b>{list.comments}</b>
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
                    {list.statusString == "Canceled" &&
                      list.isExpired != true && (
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
                            <FormControl
                              fullWidth
                              sx={{ m: 1, maxWidth: "100%" }}
                            >
                              <FormLabel
                                htmlFor="reasonForNewDocument"
                                className="font-semibold leading-none"
                              >
                                Comment
                              </FormLabel>
                              <OutlinedInput
                                id="reasonForNewDocument"
                                name="reasonForNewDocument"
                                onChange={(e) => setComment(e.target.value)}
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
                                  handleAccept(list.id, list.changeRequestId)
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
                                  handleReject(list.id, list.changeRequestId)
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
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          ></div>
        </>
      ))}
    </>
  );
};

export default SessionList;
