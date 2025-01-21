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
import {
  FormControlLabel,
  Menu,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
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
  const [viewAsTable, setViewAsTable] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState(0);
  const [isSiteLoading, setIsSiteLoading] = useState(true);
  const [site, setSite] = useState<ISite[]>([]);
  const [data, setData] = useState<IHiraList[]>([]);
  const { selectedTask, setSelectedTask } = useTaskStore();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);
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
  }, []);

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
                    // onChange={handleSearchText}
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
                    <motion.div
                      className="flex flex-1 my-20 items-center justify-center"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow className=" bg-blue-700 bg-opacity-10 ">
                              <TableCell>HIRA Number</TableCell>
                              <TableCell align="center">Division</TableCell>
                              <TableCell align="center">Site</TableCell>
                              <TableCell align="center">Project Name</TableCell>
                              <TableCell align="center">Category</TableCell>
                              <TableCell align="center">Created At</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rowData.map((row) => (
                              <TableRow
                                key={row.hiranumber}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  className="text-blue-700 font-medium"
                                >
                                  <Link
                                    to={
                                      row.status ===
                                      RiskRegisterStatus.Evaluation
                                        ? `/risk/riskevaluation/${row.id}`
                                        : `/risk/approverisk/${row.id}`
                                    }
                                  >
                                    {row.hiranumber}
                                  </Link>
                                </TableCell>

                                <TableCell align="left">
                                  {row.divisionName}
                                </TableCell>
                                <TableCell align="left">
                                  {row.siteName}
                                </TableCell>
                                <TableCell align="left">
                                  {row.projectName}
                                </TableCell>
                                <TableCell align="left">
                                  {RiskCategory[row.category].replace("_", " ")}
                                </TableCell>
                                <TableCell align="left">
                                  {dayjs(row.date).format("MMMM DD, YYYY")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <TablePagination
                          rowsPerPageOptions={[4, 8, 16]}
                          component="div"
                          count={data.length}
                          rowsPerPage={rowsPerPage}
                          page={0}
                          onPageChange={(event, newPage) => {
                            handleChangePage(event, newPage);
                          }}
                          onRowsPerPageChange={(event) => {
                            handleChangeRowsPerPage(event);
                          }}
                        />
                      </TableContainer>
                    </motion.div>
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
