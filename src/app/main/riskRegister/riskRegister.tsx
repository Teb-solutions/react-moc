import React from "react";
import MocHeader from "../moc/MocHeader";
import { styled } from "@mui/material/styles";
import FusePageCarded from "@fuse/core/FusePageCarded";
import _ from "@lodash";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Switch from "@mui/material/Switch";
import { FormControlLabel, Menu, Paper } from "@mui/material";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";

import { apiAuth } from "src/utils/http";
import FuseLoading from "@fuse/core/FuseLoading";
import RiskCard from "./dashboard/RiskCard";
import { use } from "i18next";
import { IHiraList, ISite, TeamList } from "./helpers/type";
import { set } from "lodash";
import RiskHeader from "./common/RiskHeader";
import { useTaskStore } from "./riskEvaluation/_componests/common/taskStore";
import { RiskCategory, RiskRegisterStatus } from "./helpers/enum";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { left } from "@popperjs/core";

// import RiskCard from "./riskCard";

const Root = styled(FusePageCarded)({
  "& .FusePageCarded-header": {},
  "& .FusePageCarded-toolbar": {},
  "& .FusePageCarded-content": {},
  "& .FusePageCarded-sidebarHeader": {},
  "& .FusePageCarded-sidebarContent": {},
});

const container = {
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};
const item = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

const RiskApp = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [searchText, setSearchText] = useState("");
  const [viewAsTable, setViewAsTable] = useState(
    localStorage.getItem("viewAsTableRisk") === "true"
  );
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState(0);
  const [isSiteLoading, setIsSiteLoading] = useState(true);
  const [site, setSite] = useState<ISite[]>([]);
  const [data, setData] = useState<IHiraList[]>([]);
  // const [originalData, setFilteredData] = useState<IHiraList[]>([]);
  const { selectedTask, setSelectedTask } = useTaskStore();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rowData, setRowData] = useState<IHiraList[]>([]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
    setRowData(data.slice(newPage * rowsPerPage, (newPage + 1) * rowsPerPage));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setRowData(data.slice(0, parseInt(event.target.value, 10)));
  };

  useEffect(() => {
    apiAuth
      .get("/RiskRegister/List")
      .then((res) => {
        setData(res.data.data);
        setOriginalData(res.data.data);
        setRowData(res.data.data.slice(0, rowsPerPage));
        setIsLoading(false);

        // console.log(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    apiAuth
      .get("/LookupData/List/site")
      .then((res) => {
        setSite(res.data.data);
        setIsSiteLoading(false);
        // console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [data]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "hiranumber",
        headerName: "HIRA No",
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
          <Link to={`/risk/riskevaluation/${params.row.id}`}>
            {params.row.hiranumber}
          </Link>
        ),
      },
      {
        field: "divisionName",
        headerName: "Division",
        // width: 150
      },
      {
        field: "siteName",
        headerName: "Site",
        // width: 150
      },
      { field: "projectName", headerName: "Project Name", width: 500 },
      {
        field: "category",
        headerName: "Category",
        // width: 150,
        valueGetter: (params) =>
          `${RiskCategory[params.row.category].replace("_", " ") || ""}`,
      },
      {
        field: "highRiskTaskCount",
        headerName: "High Risk Tasks",
        // width: 100
      },
      {
        field: "taskCount",
        headerName: "Tasks",
        //  width: 100
      },
      {
        field: "date",
        headerName: "Created By",
        // width: 200,
        renderCell: (params: GridRenderCellParams) => (
          <div className="flex flex-col">
            <p className="ml-5">{params.row.initiatedbyStaffName}</p>
            <p className="ml-5 text-xs">
              {params.row.createdAt &&
                dayjs(params.row.createdAt).format("MMM DD, YYYY HH:mm")}
            </p>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (selectedSite === 0 && searchText === "") {
      setData(originalData);
    } else if (selectedSite > 0 && searchText !== "") {
      const filteredData = originalData.filter(
        (item: IHiraList) =>
          item.siteId === selectedSite &&
          item.hiranumber.toString().includes(searchText)
      );
      setData(filteredData);
    } else if (selectedSite > 0) {
      const filteredData = originalData.filter(
        (item: IHiraList) => item.siteId === selectedSite
      );
      setData(filteredData);
    } else if (searchText !== "") {
      const filteredData = originalData.filter((item: IHiraList) =>
        item.hiranumber.toString().includes(searchText)
      );
      setData(filteredData);
    }
  }, [selectedSite, originalData, searchText]);

  const handleSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const paginationModel = { page: 0, pageSize: 10 };
  return (
    <>
      {isLoading && <FuseLoading />}
      {!isLoading && (
        <Root
          header={
            <RiskHeader
              risk="risk"
              home={true}
              // type={"Risk Register"}
              setLeftSidebarOpen={() => {}}
              leftSidebarOpen={false}
            />
          }
          content={
            <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-30">
              <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
                  <FormControl
                    className="flex w-full sm:w-136"
                    variant="outlined"
                  >
                    <InputLabel id="category-select-label">Site</InputLabel>
                    {isSiteLoading && <p>Loading...</p>}
                    {!isSiteLoading && site && (
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        label="Category"
                        value={selectedSite}
                        onChange={(event) =>
                          setSelectedSite(event.target.value as number)
                        }
                      >
                        <MenuItem value={0}>All</MenuItem>
                        {site &&
                          site.length > 0 &&
                          site?.map((site) => (
                            <MenuItem value={site.id} key={site.id}>
                              {site.description}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  </FormControl>

                  <TextField
                    label="Request No"
                    placeholder="Request No"
                    className="flex w-full sm:w-256 mx-8"
                    value={searchText}
                    inputProps={{
                      "aria-label": "Search",
                    }}
                    onChange={handleSearchText}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <FormControlLabel
                  label="View As Table"
                  control={
                    <Switch
                      onChange={(ev) => {
                        setViewAsTable(ev.target.checked);
                        ev.target.checked
                          ? localStorage.setItem("viewAsTableRisk", "true")
                          : localStorage.removeItem("viewAsTableRisk");
                      }}
                      checked={viewAsTable}
                      name="hideCompleted"
                    />
                  }
                />
              </div>
              {!isLoading && data.length > 0 ? (
                <>
                  {!viewAsTable && (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24 my-24"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {data.map((risk) => {
                        return (
                          <motion.div variants={item} key={risk.id}>
                            <RiskCard risk={risk} />
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                  {viewAsTable && (
                    <Paper
                      className="flex-1 bg-white my-20"
                      style={{
                        width: "100%",
                        height: "calc(100vh - 300px)", // Set fixed height
                        overflow: "hidden", // Hide overflow on Paper
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          overflowX: "auto", // Enable horizontal scroll on wrapper div
                          overflowY: "hidden",
                        }}
                      >
                        <DataGrid
                          rows={data}
                          columns={columns}
                          initialState={{ pagination: { paginationModel } }}
                          pageSizeOptions={[10, 25, 50]}
                          style={{
                            minWidth: "100%", // Ensure grid takes full width
                            height: "100%",
                          }}
                          sx={{
                            "& .MuiDataGrid-row": {
                              borderBottom: "1px solid #ccc",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                              backgroundColor: "#dbeafe",
                            },
                            "& .MuiDataGrid-cell": {
                              borderBottom: "none",
                            },
                          }}
                        />
                      </div>
                    </Paper>
                  )}
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <Typography color="text.secondary" className="text-24 my-24">
                    No risk registers found!
                  </Typography>
                </div>
              )}
            </div>
          }
        />
      )}
    </>
  );
};

export default RiskApp;
