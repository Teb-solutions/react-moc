import React from "react";
import {
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Fade,
  InputAdornment,
  TextField,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

const AuditListModal = ({
  open,
  handleClose,
  auditData,

  title,
}) => {
  const columns = [
    { id: "index", label: "#", minWidth: 50 },
    {
      id: "Task",
      label: "Task",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Audit",
      label: "Audit Comments",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "date",
      label: "Done By Date",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "staff",
      label: "Done BY staff",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDepartmentList = auditData.filter((row) =>
    row.Audit.toString().includes(searchQuery)
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1100px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={styleModal}>
          <Box
            style={{
              padding: "20px",
              backgroundColor: "#4f46e5",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h4 className="pt-12">Audit List</h4>
            <Button onClick={handleClose}>
              <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
            </Button>
          </Box>
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-end"
            style={{ marginTop: "10px" }}
          >
            <TextField
              variant="filled"
              fullWidth
              placeholder="Search"
              style={{
                marginBottom: "15px",
                backgroundColor: "white",
                marginRight: "30px",
              }}
              //   value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    style={{
                      marginTop: "0px",
                      paddingTop: "0px",
                    }}
                  >
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 320 }}
            />
          </div>
          <Box sx={{ overflow: "auto", padding: "5px 30px 0 30px" }}>
            <TableContainer>
              <Table stickyHeader aria-label="audit table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDepartmentList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "string"
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
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={filteredDepartmentList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AuditListModal;
