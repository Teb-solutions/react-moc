import { InputLabel, Paper } from "@mui/material";
import { format, parseISO } from "date-fns";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { apiAuth } from "src/utils/http";

const Notification = () => {
  const [notificationList, setNotificationList] = useState([]);

  function getRecords() {
    apiAuth.get(`/NotificationManager/Notifications/`).then((resp) => {
      setNotificationList(resp.data.data);
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
            <b>Notification List</b>
          </InputLabel>
        </div>
      </div>
      <div
        _ngcontent-fyk-c288=""
        class="flex items-center w-full  border-b justify-between"
      ></div>
      {notificationList.map((list) => (
        <>
          <Link
            className="p-20   shadow overflow-hidden"
            style={{ cursor: "pointer", textDecoration: "none" }}
            to={"/task"}
          >
            <div className="flex flex-col p-4">
              <div className="flex">
                <div className="flex flex-col flex-auto">
                  <div className="flex flex-col leading-5 text-md text-secondary space-y-2">
                    <div>
                      <b style={{ fontSize: "15px", color: "blacl" }}>
                        {list.notificationSubject}
                      </b>
                    </div>
                    <div className="text-gray-500" style={{ fontSize: "13px" }}>
                      {list?.notificationContent}
                    </div>
                    <div className="text-gray-500" style={{ fontSize: "10px" }}>
                      {formatDate(list?.createdAt)}
                    </div>

                    {list.approvalStatus == 2 && (
                      <div className="text-green">
                        Session Accepted at {list.updatedAt}
                      </div>
                    )}
                    {list.isExpired == true &&
                      list.approvalStatusString == "Pending" && (
                        <div className="text-red">
                          {" "}
                          Session Expired at {list.expiredTime}
                        </div>
                      )}
                    {list.statusString == "Canceled" &&
                      list.isExpired != true && (
                        <div>Session Rejected at {list.updatedAt}</div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          ></div>
        </>
      ))}
    </>
  );
};

export default Notification;
