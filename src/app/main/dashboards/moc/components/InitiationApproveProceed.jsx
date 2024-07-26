import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Paper } from "@mui/material";
import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { parseISO, format } from "date-fns";
import { useEffect } from "react";
import { apiAuth } from "src/utils/http";
import FuseLoading from "@fuse/core/FuseLoading";
import Initiation from "./Initiation";

function InitiationApprovalProceed({
  assetEvaluationId,
  AppActions,
  AppActivity,
  currentActivityForm,
  TeamAssignmentList,
  setContent,
  contentDetails,
}) {
  const [staffList, setStaffList] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
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
  function getRecords() {
    try {
      apiAuth.get(`/TeamAssignment/Create`).then((resp) => {
        setStaffList(resp.data?.data.staffData);
      });
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }

  useEffect(() => {
    getRecords();
  }, []);

  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [selectedTeamType, setSelectedTeamType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [teamAssignments, setTeamAssignments] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState({
    StaffId: "",
    teamType: "Hseq",
  });

  const handleTeamTypeChange = (event) => {
    const { value } = event.target;
    setSelectedTeamType(value);
    const selectedStaff = staffList.find((staff) => staff.value === value);
    if (selectedStaff) {
      setTeamAssignments((prevState) => [
        ...prevState,
        { staffId: selectedStaff.value, teamType: "Hseq" },
      ]);
    }
  };

  const handleStaffChange = (event, newValue) => {
    setSelectedStaffs(
      newValue.map((staff) => ({
        staffId: staff.value,
        teamType: "Others",
      }))
    );
  };

  console.log(AppActivity, "payloadss");

  const handleSubmit = () => {
    setIsLoading(true);
    const payload = {
      teamAssignments: [...teamAssignments, ...selectedStaffs],
      executeActivity: {
        activityUID: AppActivity.uid,
        actionUID: AppActions[0].uid, // Assuming AppActions is an array, use the correct index or structure to access uid
      },
    };
    apiAuth
      .put(`/TeamAssignment/Create?id=${assetEvaluationId}`, payload)
      .then((resp) => {
        console.log("Response:", resp.data);
        setIsLoading(false);

        setOpen(false);
        apiAuth
          .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
          .then((resp) => {
            setContent(resp.data.data.phases);
          });
        getRecords();
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <FuseLoading />;
  }

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
                  Submit Team Assignment
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
                    Once submited you will not be able to revert! Are you sure
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
      <Initiation
        contentDetails={contentDetails}
        assetEvaluationId={assetEvaluationId}
      />
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
          <div className="flex items-center w-full border-b justify-between p-30 pt-24 pb-24">
            <h2 className="text-2xl font-semibold">Team Assignment</h2>
          </div>

          {currentActivityForm.canEdit && (
            <div className="p-30">
              <>
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
                      Change Leader*
                    </FormLabel>

                    <span>hello</span>
                  </FormControl>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", marginTop: "0" }}>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <FormLabel
                      className="font-medium text-14"
                      component="legend"
                    >
                      Hseq *
                    </FormLabel>
                    <Autocomplete
                      id="teamType"
                      options={staffList}
                      getOptionLabel={(option) => option.text}
                      value={
                        staffList.find(
                          (option) => option.value === selectedTeamType
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        handleTeamTypeChange({
                          target: {
                            name: "teamType",
                            value: newValue ? newValue.value : "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={false}
                          helperText={null}
                        />
                      )}
                      renderOption={(props, option) => (
                        <MenuItem
                          {...props}
                          key={option.value}
                          value={option.value}
                        >
                          <ListItemText primary={option.text} />
                        </MenuItem>
                      )}
                    />
                  </FormControl>
                </Box>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}
                >
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <FormLabel
                      className="font-medium text-14"
                      component="legend"
                    >
                      Others*
                    </FormLabel>
                    <Autocomplete
                      multiple
                      id="staff-autocomplete"
                      options={staffList}
                      getOptionLabel={(option) => option.text}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={staffList.filter((staff) =>
                        selectedStaffs.some(
                          (selected) => selected.staffId === staff.value
                        )
                      )}
                      onChange={handleStaffChange}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" fullWidth />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props} key={option.value}>
                          <Checkbox checked={selected} />
                          <ListItemText primary={option.text} />
                        </li>
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <span key={index} {...getTagProps({ index })}>
                            {option.text}
                          </span>
                        ))
                      }
                    />
                  </FormControl>
                </Box>
              </>
            </div>
          )}

          {currentActivityForm.canEdit && (
            <div className="p-30">
              <>
                <div
                  className="my-10"
                  style={{ borderTopWidth: "2px", marginTop: "40px" }}
                ></div>
                <div className="flex justify-end">
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
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div
                    className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                    style={{ marginTop: "25px" }}
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
                </div>
              </>
            </div>
          )}
          <div className="p-30">
            {!currentActivityForm.canEdit &&
              TeamAssignmentList.filter(
                (list) => list.roleName !== "Change Leader"
              ).map((list) => (
                <div
                  className="inventory-grid grid items-center gap-4 py-6"
                  style={{ width: "40%" }}
                >
                  <div className="flex items-center" style={{ marginTop: "0" }}>
                    <img
                      src="/assets/images/etc/userpic.png"
                      alt="Card cover image"
                      className="rounded-full mr-24"
                      style={{ width: "4rem", height: "4rem" }}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold leading-none">
                        {list.staffName}
                      </span>
                      <span className="text-sm text-secondary leading-none pt-5">
                        {list?.roleName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Paper>
      </SwipeableViews>
    </div>
  );
}

export default InitiationApprovalProceed;
