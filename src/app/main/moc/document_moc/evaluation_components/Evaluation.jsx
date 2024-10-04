import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Paper,
  Step,
  Stepper,
  TextField,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { parseISO, format } from "date-fns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { apiAuth } from "src/utils/http";
import { toast } from "react-toastify";
import { useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const Evaluation = ({
  canEdits,
  evalActions,
  contentDetails,
  evaluationId,
  changeEvaluationId,
  setChangeEvaluationDetail,
  setIsLoading,
  ChangeEvaluationDetail,
  evalActivity,
  setContent,
}) => {
  const [addStake, setAddStake] = useState(false);
  const [errorss, setErrorStake] = useState("");
  const [errors, setErrors] = useState([]);
  const [errorsUrl, setErrorsUrl] = useState({});
  const [data, setData] = useState({
    consultedDate: null,
    consultedStaffId: "",
    changeEvaluationId: 0,
    changeRequestId: 0,
    comments: "",
    consultedStaffDesignationId: "",
    id: 0,
    isActive: true,
    isEditable: true,
    taskReviewId: "",
  });
  const [handelUrlChange, setHandelUrlChange] = useState({
    urlRemarks: "",
  });
  const [forms, setForms] = useState([
    {
      id: Date.now(),
      data: { consultedDate: new Date(), consultedStaffId: "" },
    },
  ]);
  const [docStaff, setDocStaff] = useState([]);

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

  const handelAddStake = () => {
    setErrorStake("");
    setErrors([]);
    setForms([
      {
        id: Date.now(),
        data: { consultedDate: new Date(), consultedStaffId: "" },
      },
    ]);
    setAddStake(true);

    apiAuth
      .get(`/ApprovalManager/LOV/${evaluationId}/1/Consultaion`)
      .then((resp) => {
        apiAuth.get(`/Staff/LOV`).then((resp) => {
          setDocStaff(resp.data.data);
          apiAuth.get(`/LookupData/Lov/5`).then((resp) => { });
        });
      });
  };

  const handleChangeStaffDate = (id, date) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id
          ? { ...form, data: { ...form.data, consultedDate: date } }
          : form
      )
    );
    setErrors((prevErrors) =>
      prevErrors.map((error, index) =>
        forms[index].id === id ? { ...error, consultedDate: "" } : error
      )
    );
  };

  function getRecords() {
    apiAuth.get(`/Activity/RequestLifecycle/${evaluationId}`).then((resp) => {
      setContent(resp.data.data.phases);

      setIsLoading(false);
    });
  }

  const handleUrlChange = (event) => {
    setHandelUrlChange({
      ...handelUrlChange,
      urlRemarks: event.target.value,
    });
    setErrorsUrl({});
  };

  const handleChangeStaff = (id, event) => {
    const { name, value } = event.target;
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id
          ? { ...form, data: { ...form.data, [name]: value } }
          : form
      )
    );
    setErrors((prevErrors) =>
      prevErrors.map((error, index) =>
        forms[index].id === id ? { ...error, [name]: "" } : error
      )
    );
  };

  const handleAddForm = () => {
    const newForms = [
      ...forms,
      { id: Date.now(), data: { consultedDate: null, consultedStaffId: "" } },
    ];
    setForms(newForms);
    if (newForms.length > 1) {
      setErrorStake("");
    }
  };



  const handleRemoveForm = (id) => {
    // setAddStake(false);
    const newForms = forms.filter((form) => form.id !== id);
    setForms(newForms);
    if (newForms.length < 1) setAddStake(false);

    // setErrorStake("At least one stakeholder is required.");
  };

  const handelNewForm = () => {
    handleAddForm();
  };

  const validate = () => {
    let tempErrors = forms.map((form) => ({
      consultedDate: !form.data.consultedDate
        ? "Consulted Date is required"
        : "",
      consultedStaffId: !form.data.consultedStaffId ? "Staff is required" : "",
    }));

    setErrors(tempErrors);
    return tempErrors.every(
      (error) => !error.consultedDate && !error.consultedStaffId
    );
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formattedForms = forms.map((form) => {
        const date = form?.data?.consultedDate;
        let formattedDate = null;

        if (date) {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1); // Month is zero-based
          const year = date.getFullYear();
          formattedDate = `${month}/${day}/${year}`;
        }

        return {
          ...data, // Assuming 'data' contains common fields
          consultedDate: formattedDate,
          consultedStaffId: form.data.consultedStaffId,
        };
      });
      setIsLoading(true);

      apiAuth
        .post(
          `/ChangeEvaluationConsultation/Create/${changeEvaluationId}/${evaluationId}`,
          formattedForms
        )
        .then((response) => {
          setIsLoading(false);

          getRecords();
          apiAuth
            .get(
              `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${changeEvaluationId}`
            )
            .then((resp) => {
              setChangeEvaluationDetail(resp.data?.data);
              setAddStake(false);
            });
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  };

  const validateUrl = () => {
    let tempErrors = {};

    // Add validation logic here
    if (!handelUrlChange.urlRemarks) {
      tempErrors.handelUrlChange = "Consolidated Document Url is required";
    }

    // Update the state with errors
    setErrorsUrl(tempErrors);

    // Return true if there are no errors
    return Object.keys(tempErrors).length === 0;
  };

  const handelUrlUpdate = (e) => {
    e.preventDefault();
    if (validateUrl()) {
      apiAuth
        .post(`/DocMoc/UpdateEvaluationDocumentDetails/${changeEvaluationId}`, {
          ConsolidatedDocumentUrl: handelUrlChange.urlRemarks,
        })
        .then((resp) => {
          toast?.success("  Consolidated Document url successfully updated");
        });
    } else {
      toast?.error("Concolidated Document Url is not valid");
    }
  };

  const SubmitApprovel = (e, uid) => {
    // if (forms.length < 1) {
    //   toast?.error("At least one stakeholder is required.");
    // } else {
    //   // setIsLoading(true);
    // }
    apiAuth
      .get(
        `/ChangeEvaluationConsultation/DeatailsList?evaluationId=${changeEvaluationId}`
      )
      .then((resp) => {
        const data = resp.data.data; // Assuming resp contains your data array

        // Check if any object in data has an empty tasks array
        const hasEmptyComment = data.some((item) => item.comments === "");
        if (resp.data.data.length === 0) {
          toast?.error("Minimum One stakeholders Required");
        } else {
          if (hasEmptyComment) {
            toast?.error("All stakeholders must update  comments");
          } else {
            setIsLoading(true);

            apiAuth
              .post(
                `/DocMoc/EvaluationSubmitForApproval/${changeEvaluationId}`,
                {
                  actionUID: uid,
                  activityUID: evalActivity.uid,
                  formUID: changeEvaluationId,
                }
              )
              .then((resp) => {
                if (resp.data.statusCode == 400) {
                  toast?.error(resp.data.message);
                  setIsLoading(false);
                } else {
                  getRecords();
                  setIsLoading(false);
                }

                // location.reload();
              })
              .catch((err) => {
                setIsLoading(false);
              });
          }
        }
      });
  };
  return (
    <>
      <Paper
        className="w-full mx-auto rounded-16 shadow overflow-hidden"
        style={{ marginRight: "0", width: "100%" }}
      >
        <div
          _ngcontent-fyk-c288=""
          class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
        >
          <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
            Evaluation
          </h2>
        </div>
        <div className="p-30 pt-24 pb-24">
          {!addStake ? (
            <div className="mb-10">
              <b>Stakeholders</b>
            </div>
          ) : (
            <div className="font-semibold text-blue cursor-pointer">
              <a rel="noopener noreferrer" onClick={() => setAddStake(false)}>
                Back to Stakeholders List
              </a>
            </div>
          )}
          {canEdits &&
            !addStake &&
            ChangeEvaluationDetail.map((list) => (
              <Accordion style={{ margin: "0px" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  style={{ minHeight: "60px" }}
                >
                  <div
                    className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
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
                          {list?.staff}
                        </span>
                        <span className="text-sm text-secondary leading-none pt-5">
                          Consulted on {formatDate(list?.consultedDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                    <div className="flex items-center">
                      <div
                        className="py-0.5 px-3 rounded-full text-sm"
                        style={{
                          backgroundColor:
                            list.comments == "" || list.comments == null
                              ? "rgba(252,165,165)"
                              : "rgba(134,239,172)",
                          padding: "5px",
                        }}
                      >
                        {list.comments === ""
                          ? "No Comments Added"
                          : "Comments Added"}
                      </div>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <Stepper orientation="vertical">
                    <Step>
                      <div className="mat-expansion-panel-body ng-tns-c137-15">
                        <div className="mt-2 ng-tns-c137-15">
                          <div className="prose prose-sm max-w-5xl">
                            <div className="ng-star-inserted">
                              <span
                                className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                style={{
                                  padding: "10px",
                                }}
                              >
                                {list.comments === "" ? (
                                  "No Comments Added"
                                ) : (
                                  <div className="mb-12">
                                    <span className="task-detail-label bg-default rounded  text-secondary font-semibold">
                                      comments
                                    </span>
                                    <span className="task-detail-value">
                                      {list.comments}
                                    </span>
                                  </div>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Step>
                  </Stepper>
                </AccordionDetails>
              </Accordion>
            ))}
          {!canEdits &&
            ChangeEvaluationDetail.map((list) => (
              <Accordion style={{ margin: "0px" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  style={{ minHeight: "60px" }}
                >
                  <div
                    className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
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
                          {list?.staff}
                        </span>
                        <span className="text-sm text-secondary leading-none pt-5">
                          Consulted on {formatDate(list?.consultedDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2">
                    <div className="flex items-center">
                      <div
                        className="py-0.5 px-3 rounded-full text-sm"
                        style={{
                          backgroundColor:
                            list.comments == "" || list.comments == null
                              ? "rgba(252,165,165)"
                              : "rgba(134,239,172)",
                          padding: "5px",
                        }}
                      >
                        {list.comments === ""
                          ? "No Comments Added"
                          : "Comments Added"}
                      </div>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <Stepper orientation="vertical">
                    <Step>
                      <div className="mat-expansion-panel-body ng-tns-c137-15">
                        <div className="mt-2 ng-tns-c137-15">
                          <div className="prose prose-sm max-w-5xl">
                            {list.comments ? (
                              <div className="ng-star-inserted">
                                <span
                                  className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                  style={{
                                    backgroundColor: "rgba(241,245,249)",
                                    padding: "10px",
                                  }}
                                >
                                  Comments
                                </span>
                                <span>{list?.comments}</span>
                              </div>
                            ) : (
                              <div className="ng-star-inserted">
                                <span
                                  className="inline-flex bg-default rounded  mr-5 text-secondary font-semibold"
                                  style={{
                                    backgroundColor: "rgba(241,245,249)",
                                    padding: "10px",
                                  }}
                                >
                                  No Comments Added
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Step>
                  </Stepper>
                </AccordionDetails>
              </Accordion>
            ))}
          {!ChangeEvaluationDetail.length && (
            <div className="mt-5 mb-4 ">
              <h5>
                {errorss ? (
                  <b className="text-red">{errorss}</b>
                ) : (
                  "No stakeholders added"
                )}
              </h5>
            </div>
          )}

          {addStake &&
            forms.map((form, index) => (
              <div
                style={{
                  // margin: "30px",
                  justifyContent: "space-start",
                }}
                className="flex flex-row pt-24 pb-24"
                key={index}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <FormControl
                    sx={
                      {
                        // marginLeft: "10px",
                      }
                    }
                  >
                    <Box sx={{}}>
                      <DatePicker
                        label="Consulted On *"
                        name="consultedDate"
                        value={form.data.consultedDate}
                        minDate={new Date()} // Prevents selection of past dates
                        onChange={(date) =>
                          handleChangeStaffDate(form.id, date)
                        }
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            error={!!errors[index]?.consultedDate}
                          />
                        )}
                      />
                    </Box>
                    {errors[index]?.consultedDate && (
                      <span style={{ color: "red" }}>
                        {errors[index].consultedDate}
                      </span>
                    )}
                  </FormControl>
                </LocalizationProvider>
                <Box
                  sx={{
                    width: 860,
                    maxWidth: "50%",
                    marginLeft: "5rem",
                  }}
                >
                  <FormControl fullWidth>
                    <Autocomplete
                      id="consultedStaffId"
                      options={docStaff}
                      getOptionLabel={(option) => option.text || ""}
                      value={
                        docStaff.find(
                          (staff) => staff.value === form.data.consultedStaffId
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        handleChangeStaff(form.id, {
                          target: {
                            name: "consultedStaffId",
                            value: newValue ? newValue.value : "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Staff"
                          error={!!errors[index]?.consultedStaffId}
                        />
                      )}
                    />
                    {errors[index]?.consultedStaffId && (
                      <span style={{ color: "red" }}>
                        {errors[index].consultedStaffId}
                      </span>
                    )}
                  </FormControl>
                </Box>
                <Button
                  className="whitespace-nowrap mt-5"
                  startIcon={
                    <FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
                  }
                  onClick={() => handleRemoveForm(form.id)}
                ></Button>
              </div>
            ))}

          {addStake && (
            <>
              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full  border-b justify-between"
              ></div>

              <div className="flex justify-between pt-24 pb-24">
                <div>
                  <Button
                    className="whitespace-nowrap"
                    style={{
                      border: "1px solid",
                      backgroundColor: "#0000",
                      color: "black",
                      borderColor: "rgba(203,213,225)",
                      // marginLeft: "10px",
                      // marginTop: "10px",
                    }}
                    variant="contained"
                    color="warning"
                    startIcon={
                      <FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>
                    }
                    onClick={handelNewForm}
                  >
                    Add New
                  </Button>
                </div>
                <div>
                  <Button
                    className="whitespace-nowrap "
                    style={{
                      border: "1px solid",
                      backgroundColor: "#0000",
                      color: "black",
                      borderColor: "rgba(203,213,225)",
                      marginLeft: "10px",
                      // marginTop: "10px",
                    }}
                    variant="contained"
                    onClick={() => setAddStake(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="whitespace-nowrap  "
                    variant="contained"
                    color="secondary"
                    style={{
                      marginLeft: " 10px",
                      // marginTop: "8px",
                    }}
                    onClick={handelSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>

              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full  border-b justify-between"
              ></div>
            </>
          )}

          {canEdits && (
            <>
              {!addStake && (
                <Button
                  className="whitespace-nowrap mt-5"
                  style={{
                    border: "1px solid",
                    backgroundColor: "#0000",
                    color: "black",
                    borderColor: "rgba(203,213,225)",
                  }}
                  variant="contained"
                  color="warning"
                  startIcon={
                    <FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>
                  }
                  onClick={handelAddStake}
                >
                  Add Stakeholders
                </Button>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <FormControl
                  fullWidth
                  sx={{ mt: 1, mb: 1 }}
                  error={!!errorsUrl.handelUrlChange}
                >
                  <span>
                    {" "}
                    Consolidated Document Url (Provide the link of SharePoint
                    File)*
                  </span>
                  <OutlinedInput
                    id="documentUrl"
                    value={
                      contentDetails?.remarks
                        ? contentDetails?.remarks
                        : handelUrlChange.urlRemarks
                    }
                    onChange={handleUrlChange}
                  />
                  {!!errorsUrl.handelUrlChange && (
                    <FormHelperText>{errorsUrl.handelUrlChange}</FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Button
                className="whitespace-nowrap mb-5 "
                variant="contained"
                color="secondary"
                style={{
                  paddingLeft: " 40px",
                  paddingRight: "40px",
                }}
                onClick={handelUrlUpdate}
              >
                Update
              </Button>

              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full mb-10 mt-10  border-b justify-between"
              ></div>
              <div className="flex justify-end ">
                {evalActions.map((btn) => (
                  <Button
                    className="whitespace-nowrap ms-5 "
                    variant="contained"
                    color="secondary"
                    style={{
                      marginTop: "10px",
                    }}
                    onClick={(e) => SubmitApprovel(e, btn.uid)}
                  >
                    {btn.name}
                  </Button>
                ))}
              </div>
            </>
          )}
          {!canEdits && (
            <div className=" pt-10 pb-24">
              <div className="flex row">
                <div className="ng-star-inserted">
                  <div>
                    Consolidated Document Url (Provide the link of SharePoint
                    File)
                  </div>
                  <div className="font-semibold">
                    <a
                      href={contentDetails?.remarks}
                      rel="noopener noreferrer"
                      className="text-blue"
                    >
                      {contentDetails?.remarks}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Paper>
      {canEdits && (
        <Paper
          className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden"
          style={{ width: "100%" }}
        >
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
          >
            <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
              Help
            </h2>
          </div>
          <div className="prose p-30 pt-24 pb-24">
            <ul className="text-sm">
              <li>
                After stakeholders are added, a task is assigned to each
                stakeholder to review the document. Stakeholders can view the
                document by going to MOC details from Tasks page which contains
                the document share point link and they need to add their
                comments in the document uploaded in share point.
              </li>
              <li>
                Once they have reviewed the document, each stakeholder has to go
                to Tasks page and submit the task as an acknowledgement.
              </li>
              <li>
                Here information of each stakeholder having reviewed the
                document is available.
              </li>
              <li>
                Document author will call internal (Plant/office) stakeholders
                and conduct session to review the document uploaded in share
                point and confirm review of document.
              </li>
              <li>
                Document author will create clean version of the document
                incorporating all modifications / suggestions into same location
                in share point.
              </li>
              <li>
                Document author has to update the new consolidated document url
                here.
              </li>
              <li>Document author can then submit for approval.</li>
            </ul>
          </div>
        </Paper>
      )}
    </>
  );
};

export default Evaluation;
