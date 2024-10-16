import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";

import { parseISO, format } from "date-fns";
import { apiAuth } from "src/utils/http";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmationModal from "../../common_modal/confirmation_modal/ConfirmationModal";

const Approval = ({
  contentDetails,
  appActivity,
  currentActivityForm,
  appActions,
  ApprovalManager,
  evaluationId,
  changeEvaluationId,
  setIsLoading,
  getRecords,
  currentPhaseName,
}) => {
  const [valueRemark, setValueRemark] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [submit, setSubmit] = useState({
    uid: 0,
    name: "",
    type: ""
  })
  const handleClose = () => setOpen(false);
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

  const handleChangeRemark = (event) => {
    if (event.target.value.trim() !== "") {
      setErrorMessage(""); // Clear error message on input change
    }
    setValueRemark(event.target.value);
  };


  const SubmitApprovelCreate = (e, uid, name, type) => {
    if (valueRemark.trim() === "") {
      setErrorMessage("Comments are required.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);

    apiAuth
      .post(`/ApprovalManager/Create/${evaluationId}`, {
        actionUID: uid,
        activityUID: uid,
        formUID: changeEvaluationId,
        actionName: name,
        actionType: type,
        activityCode: appActivity.code,
        activityId: appActivity.uid,
        consultaioncomment: "",
        formType: appActivity.form,
        remark: valueRemark,
        taskscomment: "",
        version: appActivity.version,
      })
      .then((resp) => {
        if (resp.data.statusCode != 400) {
          setValueRemark("");
          getRecords();
          setIsLoading(false);
        } else {
          setIsLoading(false);

          toast?.error(resp.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };


  const handleOpen = (e, uid, name, type) => {

    if (valueRemark.trim() === "") {

      setErrorMessage("Comments are required.");
      setOpen(false);

    } else {

      setSubmit({
        ...submit,
        uid: uid,
        name: name,
        type: type
      })

      setOpen(true);
    }
  };





  return (
    <>
      <ConfirmationModal
        openSubmit={open}
        handleCloseSubmit={handleClose}
        title="Submit Approval"
        text="Do you really want to approve? Once submitted, you will not be able to revert! Are you sure you want to continue?"
      >
        <div
          className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
          style={{
            marginTop: "15px",
            justifyContent: "end",
            backgroundColor: " rgba(248,250,252)",
            padding: "10px",
          }}
        >
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="primary"
            style={{
              padding: "23px",
              backgroundColor: "white",
              color: "black",
              border: "1px solid grey",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            style={{
              padding: "23px",
              backgroundColor: "red",
            }}
            type="submit"
            onClick={(e) => SubmitApprovelCreate(e, submit.uid, submit.name, submit.type)}
          >
            Submit
          </Button>
        </div>
      </ConfirmationModal>
      {currentPhaseName == "Approval" && (
        <>
          <Paper className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden">
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
            >
              <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                Summary Details
              </h2>
            </div>
            <div
              _ngcontent-fyk-c288=""
              class="p-30 pt-24 pb-24 mb-6 ng-star-inserted"
            >
              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="" className="my-6">
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
                <div _ngcontent-fyk-c288="" className="my-6">
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
                <div _ngcontent-fyk-c288="" className="my-6">
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
                    {formatDate(contentDetails?.requestDate)}
                  </div>
                </div>
              </div>

              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="" className="my-6">
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
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Document Name
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.projectName}
                  </div>
                </div>

                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Document Type
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.documentType}New
                  </div>
                </div>
              </div>

              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Doc Controller
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.docControllerName}
                  </div>
                </div>
                {contentDetails?.docOldValidityDate != null && (
                  <div _ngcontent-fyk-c288="" className="my-6">
                    <div
                      _ngcontent-fyk-c288=""
                      class="mt-3 leading-6 text-secondary"
                    >
                      Validity Expiring On
                    </div>
                    <div
                      _ngcontent-fyk-c288=""
                      class="text-lg leading-6 font-medium"
                    >
                      {" "}
                      {new Date(
                        contentDetails?.docOldValidityDate
                      ).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                )}
              </div>

              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
              ></div>

              <div _ngcontent-fyk-c288="" class="grid w-full">
                <div className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Document Description
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
              <div _ngcontent-fyk-c288="" class="grid w-full">
                <div className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Reason for New Document
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.reasonForNewDocument}
                  </div>
                </div>
              </div>
              <div _ngcontent-fyk-c288="" class="grid w-full">
                <div className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Document Url
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    <a
                      _ngcontent-fyk-c288=""
                      target="_blank"
                      class="text-blue-500 hover:text-blue-800"
                      style={{ background: "none", color: "blue" }}
                      href={contentDetails?.documentUrl}
                    >
                      {contentDetails?.documentUrl}
                    </a>
                  </div>
                </div>
              </div>
              <div _ngcontent-fyk-c288="" class="grid  w-full">
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Consolidated Document Url
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    <a
                      _ngcontent-fyk-c288=""
                      target="_blank"
                      class="text-blue-500 hover:text-blue-800"
                      style={{ background: "none", color: "blue" }}
                      href={contentDetails?.consolidatedDocumentUrl}
                    >
                      {contentDetails?.consolidatedDocumentUrl}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Paper>
          <>
            <Paper
              className="w-full  mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden"
              style={{ width: "100%" }}
            >
              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full p-30 pt-12 pb-12 border-b justify-between"
              >
                <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                  Stake Holders
                </h2>
                <TextField
                  variant="filled"
                  fullWidth
                  placeholder="Search"
                  //   value={searchTerm}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ marginTop: "0px" }}
                      >
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 320 }}
                />
              </div>
              {contentDetails?.consultaion?.map((itm) => (
                <div
                  className="inventory-grid grid items-center gap-4 p-30 pt-24 pb-24"
                  style={{ width: "40%" }}
                >
                  <div className="flex items-center">
                    <img
                      src="/assets/images/etc/userpic.png"
                      alt="Card cover image"
                      className="rounded-full mr-4"
                      style={{ width: "4rem", height: "4rem" }}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold leading-none">
                        {itm.staff}
                      </span>
                      <span className="text-sm text-secondary leading-none pt-5">
                        Consulted on{" "}
                        {new Date(itm?.consultedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Paper>
          </>
        </>
      )}
      <Paper
        className="w-full  mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden"
        style={{ marginRight: "15px", width: "100%" }}
      >
        <div
          _ngcontent-fyk-c288=""
          class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
        >
          <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
            Approval
          </h2>
        </div>

        {appActivity.isComplete && appActivity.status != "Pending" ? (
          <div
            className="inventory-grid grid items-center gap-4 p-30 pt-24 pb-24"
            style={{ width: "40%" }}
          >
            <span className="leading-none">
              <b>Approver Comment:</b> {ApprovalManager?.remark}
            </span>
          </div>
        ) : (
          <div
            className="inventory-grid grid items-center gap-4 p-30 pt-24 pb-24"
            style={{ width: "100%" }}
          >
            {currentActivityForm.canEdit && (
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
                  <span className="font-semibold leading-none">Comment *</span>
                  <OutlinedInput
                    id="reasonForNewDocument"
                    name="reasonForNewDocument"
                    onChange={handleChangeRemark}
                    label="Reason For Change*"
                    className="mt-5"
                    value={valueRemark}
                  />
                  {errorMessage && (
                    <div className="text-red-500 text-sm mt-1">
                      {errorMessage}
                    </div>
                  )}
                </FormControl>
              </Box>
            )}
            {currentActivityForm.canExecute && (
              <div className="flex justify-end ">
                {appActions.map((btn) => (
                  <Button
                    className="whitespace-nowrap ms-5 "
                    variant="contained"
                    color="secondary"
                    style={{
                      marginTop: "10px",
                    }}
                    onClick={(e) =>
                      handleOpen(e, btn.uid, btn.name, btn.type)
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
    </>
  );
};

export default Approval;
