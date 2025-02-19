import FusePageSimple from "@fuse/core/FusePageSimple";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import {Box,InputLabel,TextField,FormControl,Input,TablePagination,Button,} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import FuseLoading from "@fuse/core/FuseLoading";
import { useCallback, useMemo } from "react";
import { useEffect } from "react";
import { apiAuth, apiTicketAuth } from "src/utils/http";
// import MocHeader from "../../../moc/MocHeader";
import MocHeader from "../../moc/MocHeader";
import dayjs from "dayjs";
import { exportToCSV } from 'src/utils/exportToCSV';
import _, { set } from 'lodash';
import { useLocation } from "react-router";

/**
 * The ProjectDashboardApp page.
 */
function MocReportByDate() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [dense, setDense] = useState(false);
  const [data, setData] = useState({});
  // const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  // const useParamsId = useParams().id;
  const location = useLocation();
  const pathname = location.pathname;
  const useParamsId = pathname.substring(pathname.lastIndexOf('/') + 1);
  const paramValues = {
    requestdate: "requestdate",
    terminationdate: "terminationdate",
  }
  const Title = {
    requestdate: "Request Date",
    terminationdate: "Termintion Date",
  }
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  }
  const fetchdataSetting = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) {
        navigate("/sign-in");
        return;
      }
      apiAuth.get(`/ChangeRequest/List`).then(async (resp) => {
        setData(resp?.data?.data);
        // setFilteredData(resp?.data?.data);
        setIsLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const filteredData = useMemo(() => {
    
    return _.filter(data, (item) => {
      // if (selectedCategory !== "all" && item.classCategory !== selectedCategory) {
      //   return false;
      // }
      if (fromDate && toDate &&  useParamsId === paramValues.requestdate) {
        const requestDate = dayjs(item.requestDate);
        // const terminationDate = dayjs(item.changeTerminationDate);
        const fromDateObj = dayjs(fromDate);
        const toDateObj = dayjs(toDate);
        if (requestDate.isBefore(fromDateObj) || requestDate.isAfter(toDateObj)) {
          return false;
        }
      }
      if (fromDate && toDate && useParamsId === paramValues.terminationdate) {
        const terminationDate = dayjs(item.changeTerminationDate);
        const fromDateObj = dayjs(fromDate);
        const toDateObj = dayjs(toDate);
        if (!terminationDate.isValid()) {
          return false;
        }
        if ( terminationDate.isBefore(fromDateObj) || terminationDate.isAfter(toDateObj)) {
          return false;
        }
      }
      return item.requestNo.toLowerCase().includes(searchTerm.toLowerCase());
    });

    
  }, [data, searchTerm, fromDate, toDate, useParamsId]);

  useEffect(() => {
    fetchdataSetting();
    setSearchTerm("");
    setFromDate("");
    setToDate("");
  }, [useParamsId]);
  
  const columns = [
    {
      id: 'requestTypeName',
      label: 'Type',
    },
    {
      id: "requestNo",
      label: "Request No",
    },
    
    {
      id: 'initiatorName',
      label: 'Created By',
    },
    {
      id: 'requestDate',
      label: 'Initated Date',
    },
    {
      id: 'projectName',
      label: 'Project Name',
    },
    {
      id: 'changeLeaderName',
      label: 'Change Leader',
    },
    {
      id: 'statusName',
      label: 'Status',
    },
    {
      id: 'classCategory',
      label: 'Class'
    },
    {
      id:'changeType',
      label: 'Change Type'
    },
    {
      id: 'changeTerminationDate',
      label: 'Termination Date'
    }
    
    
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleExport = () => {
    const fields = [
      'requestTypeName',
      'requestNo',
      'requestDate',
      'initiatorName',
      'projectName',
      'changeLeaderName',
      'statusName',
      'classCategory',
      'changeType',
      'changeTerminationDate'
      
    ];
    exportToCSV(filteredData, fields, 'MOC_report_by_'+useParamsId);
   
  };
  

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <div className="flex flex-col w-full h-full white_bg">
    <div className="">
    <MocHeader nothing={"nothing"} type={"Report"} />
      <div style={{ margin: "20px" }}>
        <div className="flex d-flex flex-col flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel id="category-select-label" className="text-4xl">
            <b>By {Title[useParamsId]}</b>
          </InputLabel>
        </div>

        <b className="text-lg">Total MOC Requests: {data.length || 0}</b>
        <Box className=" flex flex-row gap-20 justify-end mt-10">
            <TextField
              label="Search by MOC number"
              id="search"
              value={searchTerm}
              onChange={(event)=>handleSearch(event)}
            />
            <FormControl className="flex w-full sm:w-136" variant="outlined">
               
                <TextField 
                id="fromDate"
                name="fromDate"
                type="date"
                value={fromDate}
                label="From Date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event)=>setFromDate(dayjs(event.target.value).format("YYYY-MM-DD"))}
                 />
                
              </FormControl>
              <FormControl className="flex w-full sm:w-136" variant="outlined">
                <TextField 
                id="toDate"
                name="toDate"
                type="date"
                value={toDate}
                label="To Date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event)=>setToDate(dayjs(event.target.value).format("YYYY-MM-DD"))}
                 />
                
              </FormControl>
            <Button variant="outlined" className="mt-5" onClick={handleExport}>Export to CSV</Button>
            
        </Box>
        <Paper
        className="box_reset mt-24"
        sx={{ width: "100%", overflow: "hidden", backgroundColor: "none" }}
      >
        <div className=" px-10 text-gray-500 italic text-lg font-semibold">{filteredData.length ?  "Filtered Count:"+filteredData.length:''} </div>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow style={{ backgroundColor: "white" }}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    className="whitespace_"
                    style={{
                      minWidth: column.minWidth,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                      sx={{ padding: dense ? "4px" : "default" }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ borderBottom: "1px solid #dddddd" }}
                          >
                            {column.id === "requestDate"
                             || column.id ==="changeTerminationDate"
                              ? (
                                value ? dayjs(value).format("MMM DD, YYYY"):''
                            ) : column.render ? (
                              column.render(row)
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={filteredData.length} // Update count to filtered list length
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
        </div>
      </div>  
    </div>
      
    
    );
}

export default MocReportByDate;
