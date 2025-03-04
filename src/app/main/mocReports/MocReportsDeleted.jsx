import FusePageSimple from "@fuse/core/FusePageSimple";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import {
  Box,
  InputLabel,
  TextField,
  FormControl,
  Select,
  MenuItem,
  TablePagination,
  Button,
} from "@mui/material";
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
import MocHeader from "../moc/MocHeader";
import dayjs from "dayjs";
import { exportToCSV } from "src/utils/exportToCSV";
import _, { set } from "lodash";
import { useLocation } from "react-router";

/**
 * The ProjectDashboardApp page.
 */
function MocReportsDeleted() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [dense, setDense] = useState(false);
  const [data, setData] = useState({});
  // const useParamsId = useParams().id;
  const location = useLocation();
    const pathname = location.pathname;
    const useParamsId = pathname.substring(pathname.lastIndexOf('/') + 1);

  const paramValues = {
    category: "category",
    class: "class",
    status: "status",
    type: "type",
  }
 
  const categories = [
    {
      name: "Asset",
      value: "Asset",
    },
    {
      name: "Engg",
      value: "Engg",
    },
    {
      name: "TransportAct",
      value: "TransportAct",
    },
    {
      name: "Document",
      value: "Document",
    },
    {
      name: "Organisation",
      value: "Org",
    },
    {
      name: "Others",
      value: "Others",
    },
  ]

  
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };
  const fetchdataSetting = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt_access_token");
      if (!token) {
        navigate("/sign-in");
        return;
      }
      apiAuth.get(`/ChangeRequest/DeletedList`).then(async (resp) => {
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
      if (selectedCategory !== "all") {
        if ('category' === paramValues.category && item.requestTypeName !== selectedCategory) {
          return false;
        }
        
      }
      return item.requestNo.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, selectedCategory, searchTerm, useParamsId]);

  useEffect(() => {
    fetchdataSetting();
    setSelectedCategory("all");
  }, [useParamsId]);
  
  const columns = [
    {
      id: "requestTypeName",
      label: "Type",
    },
    {
      id: "requestNo",
      label: "Request No",
    },

    {
      id: "initiatorName",
      label: "Created By",
    },
    {
      id: "requestDate",
      label: "Initated Date",
    },
    {
      id: "projectName",
      label: "Project Name",
    },
    
    {
      id: "statusName",
      label: "Status",
    },
    {
      id: "classCategory",
      label: "Class",
    },
    {
      id: "changeType",
      label: "Change Type",
    },
    {
      id: "deletedAt",
      label: "Deleted Date",
    },
    {
      id: "deletedByName",
      label: "Deleted By",
    },
    {
      id: "deletionReason",
      label: "Reason",
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
      "requestTypeName",
      "requestNo",
      "requestDate",
      "initiatorName",
      "projectName",
      "changeLeaderName",
      "statusName",
      "classCategory",
      "changeType",
      "changeTerminationDate",
    ];
    exportToCSV(filteredData, fields, "MOC_report_by_" + useParamsId);
  };
  const handleSelectedCategory = useCallback((event) => {
    const value = event.target.value;
    setSelectedCategory(value);
  }, []);

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
              <b>Deleted MOC's</b>
            </InputLabel>
          </div>

          <b className="text-lg">Total MOCs Deleted: {data.length || 0}</b>
          <Box className=" flex flex-row gap-20 justify-end mt-10">
            <TextField
              label="Search by MOC number"
              id="search"
              value={searchTerm}
              onChange={(event) => handleSearch(event)}
            />
            <FormControl className="flex w-full sm:w-136" variant="outlined">
              <InputLabel id="category-select-label">Type</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                label="Category"
                value={selectedCategory}
                onChange={handleSelectedCategory}
              >
                <MenuItem value="all">
                  <em>All</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem value={category.value} key={category.value}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" className="mt-5" onClick={handleExport}>
              Export to CSV
            </Button>
          </Box>
          <Paper
            className="box_reset mt-24"
            sx={{ width: "100%", overflow: "hidden", backgroundColor: "none" }}
          >
            <div className=" px-10 text-gray-500 italic text-lg font-semibold">
              {searchTerm != "" || selectedCategory != "all"
                ? "Filtered Count:" + filteredData.length
                : ""}{" "}
            </div>
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
                                {column.id === "requestDate" ||
                                column.id === "deletedAt"
                                  ? value
                                    ? dayjs(value).format("MMM DD, YYYY")
                                    : ""
                                  : column.render
                                    ? column.render(row)
                                    : column.format && typeof value === "number"
                                      ? column.format(value)
                                      : value}
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

export default MocReportsDeleted;
