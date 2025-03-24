import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import {
  Tabs,
  Tab,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { useGetPermenant } from "src/utils/swr";
import { t, use } from "i18next";
import { apiAuth } from "src/utils/http";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
export const ViewTeamAssignmentHistory = ({
  isOpen,
  setIsOpen,
  assetEvaluationId,
}) => {
  const styleImp = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
  };
  console.log("isOpen", isOpen);
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPage(0);
    setRowsPerPage(4);
  };
  
  const { data, isLoading:dataLoading, error } = useGetPermenant(
    isOpen && `ChangeRequest/TeamHistoryList?id=${assetEvaluationId}`
  );

  
  const {
    data: approverdata,
    isLoading: approverdataLoading,
    error: approvererror,
  } = useGetPermenant(
    isOpen && value==1 &&  `Activity/ActivityTargetUsersHistory/${assetEvaluationId}`
  );
   

  const approverdataPaginated = useMemo(() => {
    return approverdata?.data?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, approverdata]);

  const dataPaginated = useMemo(() => {
    // const newdata = data?.data?.slice(0,-1)
    console.log(data?.data);
    return data?.data?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [page, rowsPerPage, data]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={isOpen}>
        <Box sx={styleImp} className="p-0">
          <Box
            style={{
              padding: "20px",
              backgroundColor: "#4f46e5",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <div className="flex justify-between text-white">
              <span className="text-popup font-medium">
                View Team Assignment History {""}
              </span>
              <span
                onClick={() => setIsOpen(false)}
                style={{ cursor: "pointer" }}
                className="cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fit=""
                  height="24"
                  width="24"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </span>
            </div>
          </Box>
          <div
            style={{
              textAlign: "center",
              //   padding: "30px",
              marginTop: "0",
              paddingBottom: "0",
            }}
          >
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, marginTop: "10px" } }}
              noValidate
              autoComplete="off"
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <Tab  label="Team Change History" {...a11yProps(0)} />
                  <Tab label="Approver Change History" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                {dataLoading && (
                  <div className="text-center">Loading...</div>
                )}
              {data?.data?.length > 0 && (
                  <Box sx={{ width: "100%", overflowX: "auto" }}>
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow className="bg-gray-200 p-0">
                            <TableCell>Team</TableCell>
                           
                            <TableCell>Reason</TableCell>
                            <TableCell>Changed By</TableCell>
                            <TableCell>Changed On</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataPaginated?.map((row) => (
                            <TableRow
                              key={row.activityName}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <div className="flex flex-col">
                                <div><span className="font-semibold">Site In Charge</span> - {row?.siteInChargeName}</div>
                                {row?.teamAssignments?.map((team) => (
                                    <div><span className="font-semibold">{team?.roleName}</span> - {team?.staffName}</div>
                                ))}
                                </div>
                              </TableCell>
                              
                              <TableCell>{row?.reasonForChange || "NA"}</TableCell>
                              <TableCell>{row?.createdByStaffName || "NA"}</TableCell>
                              <TableCell>{row?.changeDate || "NA"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={data?.data?.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                )}
                {data?.data?.length == 0 && (
                  <div className="text-center">No Data Found</div>
                )}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                {approverdataLoading && (
                  <div className="text-center">Loading...</div>
                )}
                {approverdata?.data?.length > 0 && (
                  <Box sx={{ width: "100%", overflowX: "auto" }}>
                    <TableContainer>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow className="bg-gray-200 p-0">
                            <TableCell>Activity Name</TableCell>
                            <TableCell>Old User</TableCell>
                            <TableCell>New User</TableCell>
                            <TableCell>Changed By</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Changed On</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {approverdataPaginated?.map((row) => (
                            <TableRow
                              key={row.activityName}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {row.activityName}
                              </TableCell>
                              <TableCell align="left">
                                {row.oldStaffName}
                              </TableCell>
                              <TableCell align="left">
                                {row.newStaffName}
                              </TableCell>

                              <TableCell>{row.createdByStaffName}</TableCell>
                              <TableCell>{row.reasonForChange}</TableCell>
                              <TableCell>{row?.changeDate || "NA"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      component="div"
                      count={approverdata?.data?.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                )}
                {approverdata?.data?.length == 0 && (
                  <div className="text-center">No Data Found</div>
                )}
              </CustomTabPanel>
            </Box>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
