import React, { useEffect, useRef, useState, useCallback } from "react";

import Paper from "@mui/material/Paper";
import {
  Grid,
  TableRow,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TableBody,
} from "@mui/material";
import Typography from "@mui/material/Typography";

const RiskAnalysisTableView = ({
  Paper,
  matchingRisks,
  currentActivityForm,
  handelRisk,
  handelViewDetails,
  handelEditRiskDetails,
  handelRemoveDetails,
  showEditRemove,
}) => {
  return (
    <>
      <TableContainer
        component={Paper}
        style={{
          margin: "10px 0 10px 0",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              style={{
                backgroundColor: "rgb(241 248 255)",
              }}
            >
              <TableCell
              // style={{ padding: "15px" }}
              >
                Risk Details
              </TableCell>
              <TableCell
              // style={{ padding: "10px" }}
              >
                Human Measures
              </TableCell>
              <TableCell
              // style={{ padding: "10px" }}
              >
                Technical Measures
              </TableCell>
              <TableCell
              // style={{ padding: "10px" }}
              >
                Organisational Measures
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchingRisks?.map((sub, index) =>
              sub.riskAnalysisSubTasks.map((subItm) => (
                <React.Fragment key={index}>
                  {subItm.riskAnalysisHazardTypes.length === 0 ? (
                    <TableRow>
                      <TableCell>
                        <Grid container className="inventory-grid">
                          <Grid item xs={12} md={5}>
                            <Typography
                              variant="h6"
                              style={{
                                paddingLeft: "10px",
                              }}
                              className="text-sm"
                            >
                              {subItm.subTaskName}
                            </Typography>
                          </Grid>
                        </Grid>
                        {subItm.riskAnalysisHazardTypes.length === 0 && (
                          <Grid item xs={12} md={4}>
                            <Typography
                              variant="h6"
                              style={{
                                paddingLeft: "10px",
                              }}
                              className="text-sm text-brown"
                            >
                              <b>Risk analysis not done</b>
                            </Typography>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          {currentActivityForm.canEdit && showEditRemove && (
                            <span
                              className="text-white d-inline-block"
                              style={{
                                backgroundColor: "#2563eb",
                                borderRadius: "5px",
                                marginLeft: "10px",
                                padding: "4px",
                                fontSize: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => handelRisk(subItm.id)}
                            >
                              Create New Risk Analysis
                            </span>
                          )}
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ) : (
                    subItm.riskAnalysisHazardTypes?.map((hazardType) => (
                      <React.Fragment key={hazardType.id}>
                        {hazardType.riskAnalysisHazardSituation?.map(
                          (situation) => (
                            <React.Fragment key={situation.id}>
                              <TableRow>
                                <TableCell
                                  style={{
                                    padding: "2px 16px",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    style={{
                                      backgroundColor:
                                        situation.residualRiskClassificationDisplay ===
                                        "HighRisk"
                                          ? "red"
                                          : situation.residualRiskClassificationDisplay ===
                                              "LowRisk"
                                            ? "yellow"
                                            : situation.residualRiskClassificationDisplay ===
                                                "AverageRisk"
                                              ? "orange"
                                              : situation.residualRiskClassificationDisplay ===
                                                  "SignificantRisk"
                                                ? "purple"
                                                : "green",
                                      width: "auto",
                                      padding: "3px",
                                      color:
                                        situation.residualRiskClassificationDisplay ===
                                        "LowRisk"
                                          ? "#000"
                                          : "white",
                                      borderRadius: "5px",
                                      display: "inline-block",
                                      textAlign: "center",
                                      fontSize: "12px",
                                      fontWeight:
                                        situation.residualRiskClassificationDisplay ===
                                        "LowRisk"
                                          ? ""
                                          : "bold",
                                    }}
                                  >
                                    {
                                      situation.residualRiskClassificationDisplay
                                    }
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    style={{
                                      fontSize: "12px",
                                    }}
                                  >
                                    {situation.humanControlMeasure}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    style={{
                                      fontSize: "12px",
                                    }}
                                  >
                                    {situation.technicalControlMeasure}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    style={{
                                      fontSize: "12px",
                                    }}
                                  >
                                    {situation.organisationalControlMeasure}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  style={{
                                    padding: "2px 16px",
                                  }}
                                >
                                  <div className=" pt-0 pb-24">
                                    <h6>{subItm.subTaskName}</h6>
                                    <h6>- {hazardType.hazardTypeDisplay}</h6>
                                    <h6>- {situation.hazardousSituation}</h6>
                                    <div className="my-5">
                                      <a
                                        title="View Details"
                                        className="inline-flex items-center leading-6 text-primary cursor-pointer hover:underline dark:hover:bg-hover"
                                        onClick={() =>
                                          handelViewDetails(
                                            situation.id,
                                            subItm.id
                                          )
                                        }
                                      >
                                        <span className="inline-flex items-center">
                                          <span
                                            className="font-medium cursor-pointer leading-5 fuse-vertical-navigation-item-badge-content hover:underline dark:hover:bg-hover px-12 bg-gray-200 text-black rounded"
                                            style={{
                                              fontSize: "12px",
                                            }}
                                          >
                                            View
                                          </span>
                                        </span>
                                      </a>
                                      {currentActivityForm.canEdit &&
                                        showEditRemove && (
                                          <>
                                            <a
                                              title="Edit"
                                              className="inline-flex items-center leading-6 text-primary mx-5 cursor-pointer hover:underline dark:hover:bg-hover"
                                              onClick={() =>
                                                handelEditRiskDetails(
                                                  situation.id,
                                                  subItm.id
                                                )
                                              }
                                            >
                                              <span className="inline-flex items-center">
                                                <span
                                                  className="font-medium cursor-pointer leading-5 fuse-vertical-navigation-item-badge-content hover:underline dark:hover:bg-hover px-12 bg-gray-200 text-black rounded"
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  Edit
                                                </span>
                                              </span>
                                            </a>

                                            <a
                                              title="Remove"
                                              className="inline-flex items-center leading-6 text-primary ml-2 cursor-pointer hover:underline dark:hover:bg-hover"
                                              onClick={() =>
                                                handelRemoveDetails(
                                                  situation.id,
                                                  subItm.id
                                                )
                                              }
                                            >
                                              <span className="inline-flex items-center">
                                                <span
                                                  className="font-medium cursor-pointer leading-5 fuse-vertical-navigation-item-badge-content hover:underline dark:hover:bg-hover px-12 bg-gray-200 text-black rounded"
                                                  style={{
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  Remove
                                                </span>
                                              </span>
                                            </a>
                                          </>
                                        )}
                                    </div>
                                    {currentActivityForm.canEdit &&
                                      showEditRemove && (
                                        <span
                                          className="text-white d-inline-block"
                                          style={{
                                            backgroundColor: "#2563eb",
                                            borderRadius: "5px",
                                            padding: "3px",
                                            fontSize: "10px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            handelRisk(
                                              subItm.id,
                                              hazardType.hazardType
                                            )
                                          }
                                        >
                                          Create New Risk Analysis
                                        </span>
                                      )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          )
                        )}
                      </React.Fragment>
                    ))
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RiskAnalysisTableView;
