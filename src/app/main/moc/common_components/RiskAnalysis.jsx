import React, { useEffect, useRef, useState, useCallback } from "react";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Link, useParams } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormHelperText, FormLabel } from "@mui/material";
import Box from "@mui/material/Box";
import { apiAuth } from "src/utils/http";
import TextField from "@mui/material/TextField";

const RiskAnalysis = ({
  viewrisk,
  goBack,
  subTaskDetail,
  handleChangeImpact,
  TaskhazardRiskView,
  TaskhazardRiskApi,
  TaskhazardRiskViewName,
  generalGuidePdf,
  handleGeneralGuideClick,
  formValues,
  hazaid,
  subTaskhazardDetail,
  handleInputChangeHazard,
  errorsSub,
  handelRiskInputChange,
  potentialTimeDetails,
  potentialFrequencyDetails,
  likelihoodValues,
  handelResidualRiskInputChange,
  Classifications,
  setCreateNewRisk,
  editRiskAnalysDetail,
  handelRiskSubmit,
  potentialFrequencyRiskDetails,
  setRisk,
}) => {



  console.log(potentialFrequencyRiskDetails, "potentialFrequencyRiskDetails");

  const taskFormControlStyles = viewrisk
    ? {
      borderColor: "white",
      m: 1,
      maxWidth: "100%",
      border: "1px solid white",
    }
    : { m: 1, maxWidth: "100%" };

  return (
    <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
      <div>
        <div className="flex items-center w-full p-30 pt-24 pb-24 border-b pb-5 justify-between">
          <h2 className="text-2xl font-semibold">New Risk Analysis</h2>
        </div>
        <div className="font-semibold p-30 pt-24 pb-0 ">
          <Link
            rel="noopener noreferrer"
            onClick={goBack}
            className="text-blue"
          >
            {viewrisk ? "Back to Impact List" : "Go Back"}
          </Link>
        </div>
      </div>
      <div className="p-30 pt-24 pb-24">
        <Box
          sx={{
            // display: "flex",
            // flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
          <FormControl fullWidth sx={taskFormControlStyles} className="m-0">
            <FormLabel
              htmlFor="hazardDetail"
              className="font-semibold leading-none"
            >
              Task
            </FormLabel>
            {viewrisk ? (
              <>
                <span>{subTaskDetail.taskName}</span>
              </>
            ) : (
              <OutlinedInput
                id="hazardDetail"
                name="hazardDetail"
                value={subTaskDetail.taskName}
                onChange={handleChangeImpact}
                label="Reason For Change*"
                className="mt-5"
                disabled
              />
            )}
          </FormControl>
          <FormControl
            fullWidth
            sx={{ margin: "15px 0 0 0", maxWidth: "100%" }}
          >
            <FormLabel
              htmlFor="hazardDetail"
              className="font-semibold leading-none"
            >
              Sub Task
            </FormLabel>
            {viewrisk ? (
              <>
                <span>{subTaskDetail.subTaskName}</span>
              </>
            ) : (
              <OutlinedInput
                id="hazardDetail"
                name="hazardDetail"
                value={subTaskDetail.subTaskName}
                onChange={handleChangeImpact}
                label="Reason For Change*"
                className="mt-5"
                disabled
              />
            )}
          </FormControl>

          {viewrisk ? (
            <Box
              className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 w-full"
              sx={{
                width: TaskhazardRiskView ? 818 : 600,
                maxWidth: "100%",
              }}
            >
              <FormControl fullWidth sx={{ margin: "20px 0 0 0" }}>
                <FormLabel
                  htmlFor="Time"
                  className="font-semibold leading-none"
                >
                  Hazard Type
                </FormLabel>

                <Select
                  labelId="time-select-label"
                  id="time-select"
                  label="hazardType *"
                  name="hazardType"
                  value={
                    formValues.hazardType.value
                      ? formValues.hazardType.value
                      : hazaid
                  }
                  onChange={(e) => {
                    const selectedOption = subTaskhazardDetail.find(
                      (option) => option.value === e.target.value
                    );
                    handleInputChangeHazard(e, selectedOption);
                  }}
                  error={!!errorsSub.hazardType}
                  disabled
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiSelect-icon": {
                      display: "none",
                    },
                    "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                    {
                      padding: "0px",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>None</em>
                  </MenuItem>
                  {subTaskhazardDetail.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.text}
                    </MenuItem>
                  ))}
                </Select>
                {!!errorsSub.hazardType && (
                  <FormHelperText error>{errorsSub.hazardType}</FormHelperText>
                )}
              </FormControl>
            </Box>
          ) : (
            <Box
              sx={{
                width: TaskhazardRiskView ? 818 : 600,
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-24 w-full"
            >
              <FormControl fullWidth sx={{ flexGrow: 1, margin: "20px 0 0 0" }}>
                <InputLabel id="division-label">Hazard Type *</InputLabel>
                <Select
                  labelId="division-label"
                  name="hazardType"
                  value={
                    formValues?.hazardType?.value
                      ? formValues?.hazardType?.value
                      : hazaid
                  }
                  onChange={(e) => {
                    const selectedOption = subTaskhazardDetail.find(
                      (option) => option.value === e.target.value
                    );
                    handleInputChangeHazard(e, selectedOption);
                  }}
                  error={!!errorsSub.hazardType}
                >
                  <MenuItem value="" disabled>
                    <em>None</em>
                  </MenuItem>
                  {subTaskhazardDetail.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.text}
                    </MenuItem>
                  ))}
                </Select>

                {!!errorsSub.hazardType && (
                  <FormHelperText error>{errorsSub.hazardType}</FormHelperText>
                )}
              </FormControl>

              <Box
                sx={{
                  margin: "15px 0 0 0",
                  padding: "12px 0 0 0",
                }}
              >
                {TaskhazardRiskView && (
                  <>
                    <a
                      href={URL.createObjectURL(
                        new Blob([TaskhazardRiskApi], {
                          type: "application/pdf",
                        })
                      )}
                      target="_blank"
                      className="text-blue"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: "white",
                        marginRight: "15px",
                      }}
                    >
                      {TaskhazardRiskViewName}.pdf
                    </a>
                  </>
                )}

                <a
                  href={URL.createObjectURL(
                    new Blob([generalGuidePdf], {
                      type: "application/pdf",
                    })
                  )}
                  target="_blank"
                  className="text-blue"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "white",
                    color: "blue",
                  }}
                  onClick={handleGeneralGuideClick}
                >
                  General Guide
                </a>
              </Box>
            </Box>
          )}
        </Box>
        <Box
          sx={
            {
              // marginTop: "15px",
            }
          }
        >
          <div className="flex-auto">
            <div className="flex flex-col-reverse">
              <div
                style={{
                  // marginTop: "30px",
                  justifyContent: "space-between",
                  // margin: "10px",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-24 w-full"
              >
                <Box
                  sx={{
                    width: 600,
                    maxWidth: "100%",
                    margin: "15px 0 0 0",
                  }}
                >
                  {viewrisk ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column", // Stack items vertically
                      }}
                    >
                      <FormLabel
                        htmlFor="hazardDetail"
                        className="font-semibold leading-none"
                      >
                        Hazardous Situation
                      </FormLabel>

                      <span className="pt-5">
                        {formValues.hazardousSituation}
                      </span>
                    </Box>
                  ) : (
                    <TextField
                      fullWidth
                      label="Hazardous Situation *"
                      name="hazardousSituation"
                      value={formValues.hazardousSituation}
                      onChange={handelRiskInputChange}
                      error={!!errorsSub.hazardousSituation}
                      helperText={errorsSub.hazardousSituation}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    width: 600,
                    maxWidth: "100%",
                    margin: "15px 0 0 0",
                  }}
                >
                  {viewrisk ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column", // Stack items vertically
                      }}
                    >
                      <FormLabel
                        htmlFor="hazardDetail"
                        className="font-semibold leading-none"
                      >
                        Consequence
                      </FormLabel>
                      <span className="pt-5">{formValues.consequence}</span>
                    </Box>
                  ) : (
                    <TextField
                      fullWidth
                      label="Consequence *"
                      name="consequence"
                      value={formValues.consequence}
                      onChange={handelRiskInputChange}
                      error={!!errorsSub.consequence}
                      helperText={errorsSub.consequence}
                    />
                  )}
                </Box>
              </div>
            </div>
            <h3
              style={{
                padding: "10px 0",
                margin: "15px 0 0 0",
              }}
            >
              <b>Potential Risk</b>
            </h3>
            <div className="flex flex-col-reverse">
              <div
                style={{
                  // marginTop: "30px",
                  justifyContent: "space-between",
                  // margin: "15px 0 0 0",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
              >
                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormControl fullWidth>
                        <FormLabel
                          htmlFor="Time"
                          className="font-semibold leading-none"
                        >
                          Time
                        </FormLabel>

                        <Select
                          labelId="time-select-label"
                          id="time-select"
                          label="Time *"
                          name="time"
                          value={formValues.time}
                          onChange={handelRiskInputChange}
                          error={!!errorsSub.time}
                          disabled
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-icon": {
                              display: "none",
                            },
                            "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              padding: "0px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {potentialTimeDetails.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errorsSub.time && (
                          <FormHelperText error>
                            {errorsSub.time}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      width: 380,
                      maxWidth: "100%",
                      margin: "15px 0 0 0",
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="time-select-label">Time *</InputLabel>
                      <Select
                        labelId="time-select-label"
                        id="time-select"
                        label="Time *"
                        name="time"
                        value={formValues.time}
                        onChange={handelRiskInputChange}
                        error={!!errorsSub.time}
                      >
                        <MenuItem value="" disabled>
                          <em>None</em>
                        </MenuItem>
                        {potentialTimeDetails.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                      {!!errorsSub.time && (
                        <FormHelperText error>{errorsSub.time}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                )}

                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormControl fullWidth>
                        <FormLabel
                          htmlFor="Frequency"
                          className="font-semibold leading-none"
                        >
                          Frequency
                        </FormLabel>
                        <Select
                          labelId="time-select-label"
                          id="time-select"
                          label="Frequency *"
                          name="frequencyDetails"
                          value={formValues.frequencyDetails}
                          onChange={handelRiskInputChange}
                          error={!!errorsSub.frequencyDetails}
                          disabled
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-icon": {
                              display: "none",
                            },
                            "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              padding: "0px",
                            },
                          }}
                        >
                          {potentialFrequencyDetails.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errorsSub.frequencyDetails && (
                          <FormHelperText error>
                            {errorsSub.frequencyDetails}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      width: 380,
                      maxWidth: "100%",
                      margin: "15px 0 0 0",
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="time-select-label">
                        Frequency *
                      </InputLabel>
                      <Select
                        labelId="time-select-label"
                        id="time-select"
                        label="Frequency *"
                        name="frequencyDetails"
                        value={formValues.frequencyDetails}
                        onChange={handelRiskInputChange}
                        error={!!errorsSub.frequencyDetails}
                      >
                        {potentialFrequencyDetails.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.text}
                          </MenuItem>
                        ))}
                      </Select>
                      {!!errorsSub.frequencyDetails && (
                        <FormHelperText error>
                          {errorsSub.frequencyDetails}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                )}

                <Box
                  sx={{
                    width: 380,
                    maxWidth: "100%",
                    margin: "15px 0 0 0",
                  }}
                >
                  {viewrisk ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column", // Stack items vertically
                        }}
                      >
                        <FormLabel
                          htmlFor="hazardDetail"
                          className="font-semibold leading-none"
                        >
                          Frequency Scoring
                        </FormLabel>
                        &nbsp;&nbsp; &nbsp;&nbsp;
                        <span style={{ color: "#a3a9b4" }}>
                          {formValues.frequencyScoring}
                        </span>
                      </Box>
                    </>
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        label="Frequency Scoring"
                        name="frequencyScoring"
                        value={formValues.frequencyScoring}
                        disabled
                      />
                    </>
                  )}
                </Box>
              </div>
            </div>{" "}
            <div className="flex flex-col-reverse">
              <div
                style={{
                  // marginTop: "30px",
                  justifyContent: "space-between",
                  // margin: "15px 0 0 0",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full "
              >
                <Box
                  sx={{
                    width: 380,
                    maxWidth: "100%",
                    margin: "15px 0 0 0",
                  }}
                >
                  {viewrisk ? (
                    <>
                      <FormControl fullWidth>
                        <FormLabel
                          htmlFor=" Likelihood Scoring"
                          className="font-semibold leading-none"
                        >
                          Likelihood Scoring
                        </FormLabel>
                        <Select
                          labelId="likelihood-select-label"
                          id="likelihood-select"
                          label="Likelihood Scoring"
                          name="likelihoodScoring"
                          onChange={handelRiskInputChange}
                          value={formValues.likelihoodScoring}
                          error={!!errorsSub.likelihoodScoring}
                          disabled
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-icon": {
                              display: "none",
                            },
                            "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              padding: "0px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {likelihoodValues.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.likelihoodScoring && (
                          <FormHelperText error>
                            {errorsSub.likelihoodScoring}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <FormControl fullWidth>
                        <InputLabel id="likelihood-select-label">
                          Likelihood Scoring
                        </InputLabel>
                        <Select
                          labelId="likelihood-select-label"
                          id="likelihood-select"
                          label="Likelihood Scoring"
                          name="likelihoodScoring"
                          onChange={handelRiskInputChange}
                          value={formValues.likelihoodScoring}
                          error={!!errorsSub.likelihoodScoring}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {likelihoodValues.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.likelihoodScoring && (
                          <FormHelperText error>
                            {errorsSub.likelihoodScoring}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    width: 380,
                    maxWidth: "100%",
                    margin: "15px 0 0 0",
                  }}
                >
                  {viewrisk ? (
                    <>
                      <FormLabel
                        htmlFor="Frequency"
                        className="font-semibold leading-none"
                      >
                        Frequency
                      </FormLabel>
                      <FormControl fullWidth>
                        <Select
                          labelId="severity-select-label"
                          id="severity-select"
                          label="Severity Scoring"
                          name="severityScoring"
                          value={formValues.severityScoring}
                          onChange={handelRiskInputChange}
                          error={!!errorsSub.severityScoring}
                          disabled
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-icon": {
                              display: "none",
                            },
                            "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              padding: "0px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {likelihoodValues.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.severityScoring && (
                          <FormHelperText error>
                            {errorsSub.severityScoring}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <FormControl fullWidth>
                        <InputLabel id="severity-select-label">
                          Severity Scoring
                        </InputLabel>
                        <Select
                          labelId="severity-select-label"
                          id="severity-select"
                          label="Severity Scoring"
                          name="severityScoring"
                          value={formValues.severityScoring}
                          onChange={handelRiskInputChange}
                          error={!!errorsSub.severityScoring}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {likelihoodValues.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.severityScoring && (
                          <FormHelperText error>
                            {errorsSub.severityScoring}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    width: 380,
                    maxWidth: "100%",
                    margin: "15px 0 0 0",
                  }}
                >
                  {viewrisk ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column", // Stack items vertically
                        }}
                      >
                        <FormLabel
                          htmlFor="hazardDetail"
                          className="font-semibold leading-none"
                        >
                          Potential Risk
                        </FormLabel>
                        &nbsp;&nbsp; &nbsp;&nbsp;
                        <span style={{ color: "#a3a9b4" }}>
                          {formValues.potentialRisk}
                        </span>
                      </Box>
                    </>
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        label="Potential Risk"
                        name="potentialRisk"
                        value={formValues.potentialRisk}
                        disabled
                      />
                    </>
                  )}
                </Box>
              </div>
            </div>{" "}
            <h3
              style={{
                padding: "10px 0",
                margin: "15px 0 0 0",
              }}
            >
              <b>Control Measures</b>
            </h3>
            <div className="flex flex-col-reverse">
              <div
                style={{
                  // marginTop: "30px",
                  justifyContent: "space-between",
                  // margin: "15px 0 0 0",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
              >
                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column", // Stack items vertically
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormLabel
                        htmlFor="hazardDetail"
                        className="font-semibold leading-none"
                      >
                        Human
                      </FormLabel>
                      &nbsp;&nbsp; &nbsp;&nbsp;
                      <span>{formValues.humanControlMeasure}</span>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "15px 0 0 0",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Human * "
                      name="humanControlMeasure"
                      onChange={handelRiskInputChange}
                      value={formValues.humanControlMeasure}
                      error={errorsSub.humanControlMeasure}
                      helperText={errorsSub.humanControlMeasure}
                    />
                  </Box>
                )}
                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column", // Stack items vertically
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormLabel
                        htmlFor="hazardDetail"
                        className="font-semibold leading-none"
                      >
                        Technical
                      </FormLabel>
                      &nbsp;&nbsp; &nbsp;&nbsp;
                      <span>{formValues.technicalControlMeasure}</span>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      margin: "15px 0 0 0",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Technical *"
                      name="technicalControlMeasure"
                      onChange={handelRiskInputChange}
                      value={formValues.technicalControlMeasure}
                      error={errorsSub.technicalControlMeasure}
                      helperText={errorsSub.technicalControlMeasure}
                    />
                  </Box>
                )}

                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        margin: "15px 0 0 0",
                        flexDirection: "column", // Stack items vertically
                      }}
                    >
                      <FormLabel
                        htmlFor="hazardDetail"
                        className="font-semibold leading-none"
                      >
                        Organisational
                      </FormLabel>
                      &nbsp;&nbsp; &nbsp;&nbsp;
                      <span>{formValues.organisationalControlMeasure}</span>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      width: 380,
                      maxWidth: "100%",
                      margin: "15px 0 0 0",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Organisational *"
                      name="organisationalControlMeasure"
                      onChange={handelRiskInputChange}
                      value={formValues.organisationalControlMeasure}
                      error={errorsSub.organisationalControlMeasure}
                      helperText={errorsSub.organisationalControlMeasure}
                    />
                  </Box>
                )}
              </div>
            </div>{" "}
            <h3
              style={{
                padding: "10px 0",
                margin: "15px 0 0 0",
              }}
            >
              <b>Residual Risk</b>
            </h3>
            <div className="flex flex-col-reverse">
              <div
                style={{
                  // marginTop: "30px",
                  justifyContent: "space-between",
                  // margin: "10px",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
              >
                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        margin: "15px 0 0 0",
                        flexDirection: "column",
                      }}
                    >
                      <FormControl fullWidth>
                        <FormLabel
                          id="time-select-label"
                          className="font-semibold leading-none"
                        >
                          Time
                        </FormLabel>
                        <Select
                          labelId="time-select-label"
                          id="time-select"
                          label="Time * "
                          name="modifiedTime"
                          value={formValues.modifiedTime}
                          onChange={(e) => handelResidualRiskInputChange(e)}
                          error={!!errorsSub.modifiedTime}
                          disabled
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-icon": {
                              display: "none",
                            },
                            "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              padding: "0px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {potentialTimeDetails.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.modifiedTime && (
                          <FormHelperText error>
                            {errorsSub.modifiedTime}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 380,
                        maxWidth: "100%",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel id="time-select-label">Time *</InputLabel>
                        <Select
                          labelId="time-select-label"
                          id="time-select"
                          label="Time * "
                          name="modifiedTime"
                          value={formValues.modifiedTime}
                          onChange={(e) => handelResidualRiskInputChange(e)}
                          error={!!errorsSub.modifiedTime}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {potentialTimeDetails.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.modifiedTime && (
                          <FormHelperText error>
                            {errorsSub.modifiedTime}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                )}

                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormControl fullWidth>
                        <FormLabel
                          id="time-select-label"
                          className="font-semibold leading-none"
                        >
                          Frequency
                        </FormLabel>
                        <Select
                          labelId="time-select-label"
                          id="time-select"
                          label="Frequency *"
                          name="modifiedFrequencyDetails"
                          value={formValues.modifiedFrequencyDetails}
                          onChange={(e) => handelResidualRiskInputChange(e)}
                          error={!!errorsSub.modifiedFrequencyDetails}
                          disabled
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-icon": {
                              display: "none",
                            },
                            "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              padding: "0px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {potentialFrequencyRiskDetails.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.modifiedFrequencyDetails && (
                          <FormHelperText error>
                            {errorsSub.modifiedFrequencyDetails}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 380,
                        maxWidth: "100%",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel id="time-select-label">
                          Frequency *
                        </InputLabel>
                        <Select
                          labelId="time-select-label"
                          id="time-select"
                          label="Frequency *"
                          name="modifiedFrequencyDetails"
                          value={formValues.modifiedFrequencyDetails}
                          onChange={(e) => handelResidualRiskInputChange(e)}
                          error={!!errorsSub.modifiedFrequencyDetails}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {potentialFrequencyRiskDetails.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.text}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.modifiedFrequencyDetails && (
                          <FormHelperText error>
                            {errorsSub.modifiedFrequencyDetails}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                )}
                {viewrisk ? (
                  <>
                    {" "}
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormLabel
                        htmlFor="hazardDetail"
                        className="font-semibold leading-none"
                      >
                        Frequency Scoring
                      </FormLabel>
                      &nbsp;&nbsp; &nbsp;&nbsp;
                      <span style={{ color: "#a3a9b4" }}>
                        {formValues.residualFrequencyScoring}
                      </span>
                    </Box>
                  </>
                ) : (
                  <>
                    {" "}
                    <Box
                      sx={{
                        width: 380,
                        maxWidth: "100%",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Frequency Scoring *"
                        name="handelResidualRiskInputChange"
                        value={formValues.residualFrequencyScoring}
                        disabled
                      />
                    </Box>
                  </>
                )}
              </div>
            </div>{" "}
            <div className="flex flex-col-reverse">
              <div
                style={{
                  // marginTop: "30px",
                  justifyContent: "space-between",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
              >
                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormControl fullWidth>
                        <FormLabel
                          id="time-select-label"
                          className="font-semibold leading-none"
                        >
                          Likelihood Scoring
                        </FormLabel>
                        <Select
                          labelId="likelihood-select-label"
                          id="likelihood-select"
                          label="Likelihood Scoring"
                          name="residualLikelihoodScoring"
                          value={formValues.residualLikelihoodScoring}
                          onChange={(e) => handelResidualRiskInputChange(e)}
                          error={!!errorsSub.residualLikelihoodScoring}
                          disabled
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-icon": {
                              display: "none",
                            },
                            "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              padding: "0px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {likelihoodValues.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.residualLikelihoodScoring && (
                          <FormHelperText error>
                            {errorsSub.residualLikelihoodScoring}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 380,
                        maxWidth: "100%",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel id="likelihood-select-label">
                          Likelihood Scoring
                        </InputLabel>
                        <Select
                          labelId="likelihood-select-label"
                          id="likelihood-select"
                          label="Likelihood Scoring"
                          name="residualLikelihoodScoring"
                          value={formValues.residualLikelihoodScoring}
                          onChange={(e) => handelResidualRiskInputChange(e)}
                          error={!!errorsSub.residualLikelihoodScoring}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {likelihoodValues.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.residualLikelihoodScoring && (
                          <FormHelperText error>
                            {errorsSub.residualLikelihoodScoring}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                )}

                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormControl fullWidth>
                        <FormLabel
                          id="time-select-label"
                          className="font-semibold leading-none"
                        >
                          Severity Scoring
                        </FormLabel>
                        <Select
                          labelId="severity-select-label"
                          id="severity-select"
                          label="Residual Severity Scoring"
                          name="residualSeverityScoring"
                          value={formValues.residualSeverityScoring}
                          onChange={(e) => handelResidualRiskInputChange(e)}
                          error={!!errorsSub.residualSeverityScoring}
                          disabled
                          sx={{
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-icon": {
                              display: "none",
                            },
                            "& .muiltr-1t630aw-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              padding: "0px",
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {likelihoodValues.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.residualSeverityScoring && (
                          <FormHelperText error>
                            {errorsSub.residualSeverityScoring}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 380,
                        maxWidth: "100%",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel id="severity-select-label">
                          Severity Scoring
                        </InputLabel>
                        <Select
                          labelId="severity-select-label"
                          id="severity-select"
                          label="Residual Severity Scoring"
                          name="residualSeverityScoring"
                          value={formValues.residualSeverityScoring}
                          onChange={(e) => handelResidualRiskInputChange(e)}
                          error={!!errorsSub.residualSeverityScoring}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {likelihoodValues.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                        {errorsSub.residualSeverityScoring && (
                          <FormHelperText error>
                            {errorsSub.residualSeverityScoring}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  </>
                )}

                {viewrisk ? (
                  <>
                    <Box
                      sx={{
                        width: 280,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <FormLabel
                        htmlFor="Residual Risk"
                        className="font-semibold leading-none"
                      >
                        Residual Risk
                      </FormLabel>
                      &nbsp;&nbsp; &nbsp;&nbsp;
                      <span style={{ color: "#a3a9b4" }}>
                        {formValues.residualRisk}
                      </span>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 380,
                        maxWidth: "100%",
                        margin: "15px 0 0 0",
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Residual Risk"
                        name="residualRisk"
                        value={formValues.residualRisk}
                        disabled
                      />
                    </Box>
                  </>
                )}
              </div>
            </div>{" "}
          </div>
        </Box>
        <div
          className="flex justify-end"
          style={{
            paddingLeft: "10px",
            paddingBottom: "5px",
            margin: "15px 0 0 0",
          }}
        >
          <Button
            variant="contained"
            disabled
            style={{
              backgroundColor:
                formValues.residualRiskClassification == 1
                  ? "red"
                  : formValues.residualRiskClassification == 2
                    ? "purple"
                    : formValues.residualRiskClassification == 3
                      ? "orange"
                      : formValues.residualRiskClassification == 4
                        ? "yellow"
                        : formValues.residualRiskClassification == 5
                          ? "green"
                          : "",
              borderRadius: "5px",
              padding: "10px 20px",
              fontSize: "14px",
              color:
                formValues.residualRiskClassification == 4 ? "#000" : "white",
              cursor: "pointer",
            }}
          >
            {Classifications}
          </Button>
        </div>
      </div>
      <div className="flex items-center w-full border-b pb-5 justify-between"></div>
      <div className="flex justify-end p-30 pt-24 pb-24">
        {!viewrisk && (
          <>
            <Button
              className="whitespace-nowrap"
              style={{
                border: "1px solid",
                backgroundColor: "#0000",
                color: "black",
                borderColor: "rgba(203,213,225)",
                marginLeft: "10px",
              }}
              variant="contained"
              onClick={() => setRisk(false)}
            >
              Cancel
            </Button>
            <Button
              className="whitespace-nowrap ms-5 "
              variant="contained"
              color="secondary"
              onClick={() =>
                handelRiskSubmit(
                  editRiskAnalysDetail.length ? "Update" : "Submit"
                )
              }
            >
              {editRiskAnalysDetail.length ? "Update" : "Submit"}
            </Button>
          </>
        )}
        {viewrisk && (
          <Button
            className="whitespace-nowrap mt-5"
            style={{
              border: "1px solid",
              backgroundColor: "#0000",
              color: "black",
              borderColor: "rgba(203,213,225)",
              marginLeft: "10px",
              // marginTop: "10px",
            }}
            variant="contained"
            onClick={goBack}
          >
            Close
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default RiskAnalysis;
