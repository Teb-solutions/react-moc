import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

import {
  Backdrop,
  Box,
  Button,
  Fade,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Link,
} from "@mui/material";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect } from "react";
import { apiAuth } from "src/utils/http";

const InitiationComplete = ({
  assetEvaluationId,
  AppActions,
  AppActivity,
  AssetDetails,
  currentActivityForm,
  currentSummeryById,
}) => {
  const [class1, setClass1] = useState([]);
  const [selectedClass, setSelectedClass] = useState(1);
  const [open, setOpen] = useState(false);
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

  const handleClose = () => setOpen(false);

  const handleOpen = (btn) => {
    setOpen(true);
    setIniComp((prevState) => ({
      ...prevState,
      actionUID: btn.uid,
      executeActivity: {
        actionUID: btn.uid,
      },
    }));
  };

  const [IniComp, setIniComp] = useState({
    classCategory: "",
    changeLeaderId: "",
    changeLocation: "",
    changeType: "",
    TerminationDate: new Date(),
    changeTerminationDate: new Date(),
    briefDescription: "",
    changeBenefits: "",
    documentType: "Activity",

    actionUID: "",
    formUID: "",
    token: AssetDetails.token,
  });

  console.log(IniComp, "IniComp");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIniComp((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getRecords = async (classType) => {
    try {
      const response = await apiAuth.get(
        `/ChangeSummary/changeleaders/lov/${assetEvaluationId}/${classType}`
      );
      setClass1(response.data?.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    getRecords(1);
  }, []);

  const handleChanges = (date) => {
    setIniComp({
      ...IniComp,
      TerminationDate: date,
      changeTerminationDate: date,
    });
  };

  const handleClassChange = (event) => {
    const selectedValue = event.target.value;
    setIniComp({
      ...IniComp,
      classCategory: event.target.value,
    });
    setSelectedClass(selectedValue);

    if (selectedValue == 1) {
      getRecords(1);
    } else if (selectedValue == 2) {
      getRecords(2);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const TermDate = new Date(IniComp.TerminationDate);
    const ChangeTermDate = new Date(IniComp.TerminationDate);

    let formattedTermDate = null;
    let formattedChangeTermDate = null;

    if (TermDate != "Invalid Date" && ChangeTermDate != "Invalid Date") {
      formattedTermDate = TermDate.toISOString();
      formattedChangeTermDate = ChangeTermDate.toISOString();
    }

    const formattedDocumentState = {
      ...IniComp,
      formattedTermDate: formattedTermDate,
      changeTerminationDate: formattedChangeTermDate,
      documentId: AppActivity.uid,
      documentStatus: AppActivity.form,
      activityUID: AppActivity.uid,
      executeActivity: {
        actionUID: AppActions[0].uid,
        activityUID: AppActivity.uid,
      },
    };
    apiAuth
      .post("/ChangeSummary/Create", formattedDocumentState)
      .then((response) => {
        toast.success("Successfully Created");

        setOpen(false);
      })
      .catch((error) => {});
  };

  return (
    <div className="w-full">
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
                    Once submited you will not be able to revert ! Are you sure
                    you want to continue ?
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
                style={{ padding: "23px", backgroundColor: "red" }}
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <SwipeableViews>
        <Paper className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden">
          <div>
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full  border-b justify-between"
            >
              <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                Change Summary
              </h2>
            </div>
            <div>&nbsp;</div>
            <div _ngcontent-fyk-c288="" class=" mb-6 ng-star-inserted">
              <div className="mt-2">
                <div className="space-y-4">
                  <div className="flex row">
                    <FormControl
                      component="fieldset"
                      className="flex-auto w-1/2 pln-15 prn-15 radio_button"
                    >
                      <FormLabel
                        component="legend"
                        className="block gender_label pb-2"
                        style={{ fontWeight: 500 }}
                      >
                        Class Category *
                        <Link
                          href="#"
                          className="inline-flex ml-3 leading-6 text-primary hover:underline cursor-pointer"
                        >
                          <span className="inline-flex">
                            <span className="font-medium leading-5">
                              (View Class Category Details)
                            </span>
                          </span>
                        </Link>
                      </FormLabel>
                      {currentActivityForm.canEdit ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                          }}
                        >
                          <FormControl>
                            <RadioGroup
                              row
                              aria-labelledby="documentType"
                              name="classCategory"
                              value={selectedClass}
                              onChange={handleClassChange}
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="Class I"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="Class II"
                              />
                            </RadioGroup>
                            <Link
                              href="#"
                              className="inline-flex ml-3 leading-6 text-primary hover:underline cursor-pointer"
                            >
                              <span className="inline-flex">
                                <span className="font-medium leading-5">
                                  (View Class Category Details)
                                </span>
                              </span>
                            </Link>
                          </FormControl>
                        </Box>
                      ) : (
                        <span>{currentSummeryById.classCategoryString}</span>
                      )}
                    </FormControl>
                  </div>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "20px",
                    }}
                  >
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <FormLabel
                        className="font-medium text-14"
                        component="legend"
                      >
                        Type*
                      </FormLabel>
                      {currentActivityForm.canEdit ? (
                        <Select
                          labelId="functionName-label"
                          id="docControllerId"
                          name="changeLeaderId"
                          value={IniComp.changeLeaderId}
                          onChange={handleChange}
                          label="Document Controller *"
                        >
                          {class1.map((option) => (
                            <MenuItem key={option.id} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <span>{currentSummeryById.changeLeader}</span>
                      )}
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "15px",
                    }}
                  >
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <FormLabel
                        className="font-medium text-14"
                        component="legend"
                      >
                        Change Location (you can add multiple location) *
                      </FormLabel>
                      {currentActivityForm.canEdit ? (
                        <OutlinedInput
                          id="changeLocation"
                          name="changeLocation"
                          value={IniComp.changeLocation}
                          onChange={handleChange}
                          label="changeLocation*"
                        />
                      ) : (
                        <span>{currentSummeryById.changeLocation}</span>
                      )}
                    </FormControl>
                  </Box>
                  <FormControl>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      <FormControl>
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          Change Type*
                        </FormLabel>
                        {currentActivityForm.canEdit ? (
                          <RadioGroup
                            row
                            aria-labelledby="documentType"
                            name="changeType"
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              value="1"
                              control={<Radio />}
                              label="Permenent"
                            />
                            <FormControlLabel
                              value="2"
                              control={<Radio />}
                              label="Temporory"
                            />
                          </RadioGroup>
                        ) : (
                          <span>{currentSummeryById.changeTypeString}</span>
                        )}
                      </FormControl>
                    </Box>
                  </FormControl>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <FormControl
                        sx={{
                          m: 1,
                          width: 800,
                          maxWidth: "100%",
                        }}
                      >
                        <FormLabel
                          className="font-medium text-14"
                          component="legend"
                        >
                          Expected Change Completion Date
                        </FormLabel>
                        {currentActivityForm.canEdit ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              marginTop: "15px",
                            }}
                          >
                            <DatePicker
                              label="Validity Expires On *"
                              value={IniComp.TerminationDate}
                              onChange={handleChanges}
                              renderInput={(params) => (
                                <TextField fullWidth {...params} />
                              )}
                            />
                          </Box>
                        ) : (
                          <span>
                            {currentSummeryById.changeTerminationDate}
                          </span>
                        )}
                      </FormControl>
                    </LocalizationProvider>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "15px",
                    }}
                  >
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <FormLabel
                        className="font-medium text-14"
                        component="legend"
                      >
                        Brief Description *
                      </FormLabel>
                      {currentActivityForm.canEdit ? (
                        <OutlinedInput
                          id="briefDescription"
                          name="briefDescription"
                          value={IniComp.briefDescription}
                          onChange={handleChange}
                          label="Reason For New Document *"
                        />
                      ) : (
                        <span>{currentSummeryById.briefDescription}</span>
                      )}
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "15px",
                    }}
                  >
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <FormLabel
                        className="font-medium text-14"
                        component="legend"
                      >
                        Change Benefits *
                      </FormLabel>
                      {currentActivityForm.canEdit ? (
                        <OutlinedInput
                          id="changeBenefits"
                          name="changeBenefits"
                          value={IniComp.changeBenefits}
                          onChange={handleChange}
                          label="Reason For New Document *"
                        />
                      ) : (
                        <span>{currentSummeryById.changeBenefits}</span>
                      )}
                    </FormControl>
                  </Box>
                </div>
              </div>
            </div>
            <div
              className="my-10"
              style={{ borderTopWidth: "2px", marginTop: "40px" }}
            ></div>
            <div className="flex justify-between">
              <div
                className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                style={{ marginTop: "15px" }}
              >
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
                    <FuseSvgIcon size={20}>heroicons-solid:upload</FuseSvgIcon>
                  }
                  // onClick={handleOpenDocModal}
                >
                  Document
                </Button>
              </div>
              {currentActivityForm.canExecute && (
                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{ marginTop: "15px" }}
                >
                  {AppActions.map((btn) => (
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      style={{ padding: "15px" }}
                      onClick={() => handleOpen(btn)}
                    >
                      {btn.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Paper>
      </SwipeableViews>
    </div>
  );
};

export default InitiationComplete;
