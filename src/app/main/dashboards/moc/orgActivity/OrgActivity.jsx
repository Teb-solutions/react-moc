import { styled } from "@mui/material/styles";
import FusePageCarded from "@fuse/core/FusePageCarded";
import _ from "@lodash";
import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  Select,
  MenuItem,
  ListItemText,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import MocHeader from "../MocHeader";
import { Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from "uuid";
import { apiAuth } from "src/utils/http";
import { useState } from "react";
import { useEffect } from "react";
import { parseISO, format } from "date-fns";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import FuseLoading from "@fuse/core/FuseLoading";

function OrgActivity() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "615px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };

  const [docContent, setDocContent] = useState([]);
  const [docController, setDocController] = useState([]);
  const [open, setOpen] = useState(false);
  const [staffDesignation, setStaffDesignation] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(true);

  const [documentState, setDocumentState] = useState({
    changeStaffId: "",
    changeStaffDesignationId: "",
    isNewDocument: null,
    staffType: "1",
    programCompletionDate: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDocumentState({
      ...documentState,
      [name]: value,
    });
  };

  const handleChanges = (date) => {
    setDocumentState({
      ...documentState,
      programCompletionDate: date,
    });
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setDocumentState((prevState) => ({
      ...prevState,
      staffType: value,
    }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!documentState.staffType)
      tempErrors.staffType = "Employee Type is required";
    if (!documentState.changeStaffId)
      tempErrors.changeStaffId = "Employee is required";

    if (!documentState.changeStaffDesignationId)
      tempErrors.changeStaffDesignationId = "Employee Designation  is required";

    if (documentState.programCompletionDate === true) {
      tempErrors.programCompletionDate = "Programe Completion Date is required";
    }

    // Add other validations here
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleOpen = () => {
    if (!validate()) {
      setFormValid(false);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  const [formValid, setFormValid] = useState(true);

  const handleSubmit = (event) => {
    setIsLoading(true);

    event.preventDefault();
    const date = new Date(documentState.programCompletionDate);
    let formattedDate = null;

    if (!isNaN(date)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      formattedDate = `${year}-${month}-${day}T00:00:00.000Z`;
    }

    const formattedDocumentState = {
      ...documentState,
      programCompletionDate: formattedDate,
    };
    apiAuth
      .post("/OrgMoc/CreateChangeRequest", formattedDocumentState)
      .then((response) => {
        if (response.data.statusCode == 400) {
          setOpen(false);
          setIsLoading(false);

          toast?.error(response.data.message);
        } else {
          setIsLoading(false);

          toast?.success("Successfully Created");
          setTimeout(() => {
            navigate("/dashboards/project");
          }, 1000);
          setOpen(false);
        }
      })
      .catch((error) => {
        setOpen(true);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      return format(date, "M/d/yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };

  const getRecords = async () => {
    try {
      const staffResponse = await apiAuth.get(`/Staff/LOV`);
      setDocController(staffResponse.data.data);

      const changeRequestResponse = await apiAuth.get(`/ChangeRequest/Create`);
      setIsLoading(false);
      setDocContent(changeRequestResponse.data.data);
      const staffDesignation = await apiAuth.get(`/LookupData/Lov/5`);
      setStaffDesignation(staffDesignation.data.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  useEffect(() => {
    if (Object.keys(docContent).length !== 0) {
      setDocumentState({
        requestNo: docContent.requestNo,
        divisionName: docContent.divisionName,
        siteInChargeName: docContent.siteInChargeName,
        siteName: docContent.siteName,
        functionName: docContent.functionName,
        divisionId: docContent.divisionId,
        functionId: docContent.functionId,
        siteId: docContent.siteId,
        siteInchargeId: docContent.siteInchargeId,
        type: "Document",
        documentId: "9f3b2152-36f6-4cc2-86be-e17f96a0f81f",
        documentStatus: 2,
        documentType: "OrgChangeReq",
        isNewStaff: true,
        requestDate: formatDate(docContent?.requestDate),
      });
    }
  }, [docContent]);

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={<MocHeader />}
      content={
        <>
          <ToastContainer className="toast-container" />

          <form onSubmit={handleSubmit}>
            <div className="p-24">
              <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-24 white_box rounded-2xl shadow">
                <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                  <div
                    _ngcontent-fyk-c288=""
                    class="flex items-center w-full justify-between"
                  >
                    <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                      New Organisation MOC Request
                    </h2>
                  </div>
                </div>
                <div
                  style={{ marginTop: "0", justifyContent: "space-between" }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full custom_margin"
                >
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Request No"
                      id="Request No"
                      value={docContent.requestNo || ""}
                      disabled
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Date"
                      id="Date"
                      value={formatDate(docContent?.requestDate)}
                      disabled
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Site in charge"
                      id="Site in charge"
                      value={docContent.siteInChargeName || ""}
                      disabled
                    />
                  </Box>
                </div>
                <div
                  style={{ marginTop: "0", justifyContent: "space-between" }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full custom_margin"
                >
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Site"
                      id="Site
  "
                      value={docContent.siteName || ""}
                      disabled
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Division"
                      id="Division"
                      value={docContent.divisionName || ""}
                      disabled
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Function"
                      id="Function"
                      value={docContent.functionName || ""}
                      disabled
                    />
                  </Box>
                </div>

                <div
                  className="mt-25px"
                  style={{ borderTopWidth: "2px" }}
                ></div>
                <div
                  style={{ marginTop: "0" }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full custom_margin"
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "25px",
                      marginLeft: "0",
                    }}
                  >
                    <FormControl>
                      <FormLabel
                        id="documentType"
                        style={{ color: formValid ? "inherit" : "red" }}
                      >
                        Employee Type *
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="staffType"
                        name="staffType"
                        value={documentState.staffType}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="New"
                        />
                        <FormControlLabel
                          value="2"
                          control={<Radio />}
                          label="Existing"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full">
                  <Box
                    className="custom_margin"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      // marginTop: "25px",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{ m: 1 }}
                      error={!!errors.changeStaffId}
                    >
                      <FormLabel
                        id="documentType"
                        style={{ color: formValid ? "inherit" : "red" }}
                      >
                        Employee *
                      </FormLabel>
                      <Autocomplete
                        id="docControllerId"
                        options={docController}
                        getOptionLabel={(option) => option.text}
                        value={
                          docController.find(
                            (option) =>
                              option.value === documentState.changeStaffId
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "changeStaffId",
                              value: newValue ? newValue.value : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.changeStaffId}
                            helperText={errors.changeStaffId}
                          />
                        )}
                      />
                    </FormControl>
                  </Box>
                  <Box
                    className="custom_margin"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      // marginTop: "25px",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{ m: 1 }}
                      error={!!errors.changeStaffDesignationId}
                    >
                      <FormLabel
                        id="documentType"
                        style={{ color: formValid ? "inherit" : "red" }}
                      >
                        Employee Designation *
                      </FormLabel>

                      <Autocomplete
                        id="changeStaffDesignationId"
                        options={staffDesignation}
                        getOptionLabel={(option) => option.text}
                        value={
                          staffDesignation.find(
                            (option) =>
                              option.value ===
                              documentState.changeStaffDesignationId
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "changeStaffDesignationId",
                              value: newValue ? newValue.value : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.changeStaffDesignationId}
                            helperText={errors.changeStaffDesignationId}
                          />
                        )}
                      />
                    </FormControl>
                  </Box>

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <FormControl
                      className="custom_margin2"
                      sx={{
                        // m: 1,
                        width: "100%",
                        maxWidth: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          // marginTop: "36px",
                        }}
                      >
                        <DatePicker
                          label="Program Completion Date *"
                          value={documentState.programCompletionDate}
                          onChange={handleChanges}
                          renderInput={(params) => (
                            <TextField fullWidth {...params} />
                          )}
                        />
                      </Box>
                    </FormControl>
                  </LocalizationProvider>
                </div>
                <div
                  className="mt-25px"
                  style={{ borderTopWidth: "2px" }}
                ></div>
                <div className="flex justify-between">
                  <div className="flex items-center mt-25px ">
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      style={{ padding: "15px", marginRight: "10px" }}
                      onClick={handleOpen}
                    >
                      Submit
                    </Button>

                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      open={open}
                      onClose={handleClose}
                      closeAfterTransition
                      slots={{ backdrop: Backdrop }}
                      slotProps={{
                        backdrop: {
                          timeout: 500,
                        },
                      }}
                    >
                      <Fade in={open}>
                        <Box sx={style}>
                          <Box>
                            <div className="flex">
                              <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                                style={{
                                  fontSize: "15px",
                                  marginRight: "5px",
                                  marginTop: "5px",

                                  color: "red",
                                }}
                              >
                                <img src="/assets/images/etc/icon.png" />
                              </Typography>
                              <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                                style={{
                                  fontSize: "2rem",
                                }}
                              >
                                Submit request
                                <Typography
                                  id="transition-modal-title"
                                  variant="h6"
                                  component="h2"
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: "800px !important",
                                    color: "grey",
                                  }}
                                >
                                  Once submited you will not be able to revert !
                                  Are you sure you want to continue ?
                                </Typography>
                              </Typography>
                            </div>
                          </Box>
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
                              onClick={handleSubmit}
                            >
                              Submit
                            </Button>
                          </div>
                        </Box>
                      </Fade>
                    </Modal>
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="primary"
                      style={{
                        padding: "15px",
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid grey",
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>
      }
    />
  );
}

export default OrgActivity;
