import { InputLabel, Paper } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import { apiAuth } from "src/utils/http";
import { format, parseISO } from "date-fns";
const SessionList = () => {
  const [sessionList, setSessionList] = useState([]);

  function getRecords() {
    apiAuth.get(`/NotificationManager/GetAllSessions/`).then((resp) => {
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
      {sessionList.map((list) => (
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
                        New Evaluation Session started by{" "}
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
