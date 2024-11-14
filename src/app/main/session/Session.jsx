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
import SessionCard from "./SessionCard";
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

  const [commentError, setCommentError] = useState("");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (commentError) setCommentError(""); // Clear the error on input change
  };
  const handleAccept = (id, ChangeId, sessionType) => {
    if (!Comment) {
      setCommentError("Comment is required");
      return; // Do not proceed if the comment is empty
    }
    setIsLoading(true);
    let apiPath =
      sessionType === "PSSR"
        ? `/PssrSession/SessionApprove/${ChangeId}/${id}/Approve`
        : `/ChangeEvaluationSession/SessionApprove/${ChangeId}/${id}/Approve`;
    apiPath =
      sessionType === "RiskRegister" &&
      `/RiskRegister/session/approve/${ChangeId}/${id}/Approve`;
    apiAuth
      .put(apiPath, {
        comments: Comment,
      })
      .then((resp) => {
        setTimeout(() => setIsLoading(false), 1000);
        getRecords();
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };
  const handleReject = (id, ChangeId, sessionType) => {
    if (!Comment) {
      setCommentError("Comment is required");
      return; // Do not proceed if the comment is empty
    }
    setIsLoading(true);
    let apiPath =
      sessionType === "PSSR"
        ? `/PssrSession/SessionApprove/${ChangeId}/${id}/Reject`
        : `/ChangeEvaluationSession/SessionApprove/${ChangeId}/${id}/Reject`;

    apiPath =
      sessionType === "RiskRegister" &&
      `/RiskRegister/session/approve/${ChangeId}/${id}/Reject`;
    apiAuth
      .put(apiPath, {
        comments: Comment,
      })
      .then((resp) => {
        setTimeout(() => setIsLoading(false), 1000);
        getRecords();
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
      <div className="p-20">
        <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            style={{ color: "black" }}
            className="text-2xl text-left"
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
          <SessionCard
            list={list}
            formatDate={formatDate}
            handleCommentChange={handleCommentChange}
            commentError={commentError}
            handleAccept={handleAccept}
            handleReject={handleReject}
          />

          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          ></div>
        </>
      ))}
      {sessionList?.length == 0 && (
        <h2 className="text-center mt-5 text-grey">No Data Found !!</h2>
      )}
    </>
  );
};

export default SessionList;
