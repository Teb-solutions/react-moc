import {
  Backdrop,
  Badge,
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

const DateExtend = (props) => {
  const {
    dateExtendopen,
    handlehandledateExtendClose,
    task,
    ShowTask,
    formatDates,
    AdapterDateFns,
    reqDate,
    setReqDate,
    setDueDateValidation,
    dueDateValidation,
    setDueDateCommentValidation,
    commentss,
    setCommentss,
    dueDateCommentValidation,
    handleSubmits,
  } = props;
  const styleExt = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1200px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
  };
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={dateExtendopen}
        onClose={handlehandledateExtendClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={dateExtendopen}>
          <Box sx={styleExt}>
            <Box
              style={{
                padding: "30px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                display: "flex",
                justifyContent: "end",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
              }}
              className="cursor-pointer"
              onClick={handlehandledateExtendClose}
            >
              {" "}
              <h4 className="pt-12">Extend Date</h4>
              <FuseSvgIcon size={25}>heroicons-outline:x</FuseSvgIcon>
            </Box>

            <Box sx={{ overflow: "auto", padding: "5px 30px 30px 30px" }}>
              <Grid container spacing={2} className="mt-5">
                <Grid item xs={12}>
                  <Table
                    className="mat-elevatio demo-table col-span-12 mt-0 w-full"
                    sx={{ width: "100%" }}
                  >
                    <TableHead
                      sx={{
                        borderBottom: "2px solid silver",
                        fontSize: "medium",
                        border: "1px solid black",
                      }}
                    >
                      <TableRow>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Actual Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Request Comments
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Request Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ width: "20%", border: "1px solid black" }}
                        >
                          Approved Comments
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Approved Date
                        </TableCell>
                        <TableCell
                          className="text-left pb-3"
                          sx={{ border: "1px solid black" }}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task?.taskDateUpdates?.map((update) => (
                        <TableRow key={update.id}>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {formatDates(update.oldDate)}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.requestComments}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {formatDates(update.requestDate)}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.approvedComments || "N/A"}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.approvedDate
                              ? formatDates(update.approvedDate)
                              : "N/A"}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {update.taskdateupdateStatus == 2
                              ? "Approved"
                              : update.taskdateupdateStatus == 3
                                ? "Rejected"
                                : ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
              {task?.taskDateUpdates?.length != 0 && !ShowTask && (
                <Grid
                  container
                  spacing={2}
                  className="flex mt-5"
                  direction="row"
                  alignItems="center"
                >
                  <Grid item xs={4}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Old Due Date
                    </Typography>
                    <Typography
                      variant="body1"
                      className="mt-2 cursor-pointer text-grey"
                    >
                      {formatDates(
                        task?.taskDateUpdates?.[
                          task?.taskDateUpdates?.length - 1
                        ]?.oldDate
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Request Date
                    </Typography>
                    <Typography
                      variant="body1"
                      className="mt-2 cursor-pointer text-grey"
                    >
                      {formatDates(
                        task?.taskDateUpdates?.[
                          task?.taskDateUpdates?.length - 1
                        ]?.requestDate
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="body1" className="font-semibold pt-4">
                      Request Comments
                    </Typography>
                    <Typography
                      variant="body1"
                      className="mt-2 cursor-pointer text-grey"
                    >
                      {
                        task?.taskDateUpdates?.[
                          task?.taskDateUpdates?.length - 1
                        ]?.requestComments
                      }
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    className="flex mt-5"
                    direction="row"
                    alignItems="center"
                    paddingLeft="20px"
                  >
                    <Grid item xs={12} sm={12}>
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        style={{ width: "100%" }}
                      >
                        <DatePicker
                          label="Request Date*"
                          value={reqDate}
                          minDate={new Date()} // Prevents selection of past dates
                          onChange={(newValue) => {
                            setReqDate(newValue);
                            setDueDateValidation(null);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className={`${dueDateValidation ? "border border-red-500" : ""}`}
                              fullWidth
                              required
                            />
                          )}
                        />
                      </LocalizationProvider>
                      <div>
                        <span className="text-xs text-red-500 text-grey">
                          {dueDateValidation}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xs={12} className="mt-5">
                      <TextField
                        label="Remark"
                        multiline
                        rows={1}
                        fullWidth
                        required
                        value={commentss}
                        className={`${dueDateCommentValidation ? "error" : ""}`}
                        onChange={(e) => {
                          setCommentss(e.target.value);
                          setDueDateCommentValidation(
                            e.target.value.length > 0
                              ? ""
                              : "Please enter a reason for extension"
                          );
                        }}
                      />
                      <div>
                        <span className="text-xs text-red-500 text-grey">
                          {dueDateCommentValidation}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xs={12} sx={{ paddingTop: "20px" }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleSubmits(task, 2)}
                        sx={{ float: "right" }}
                        className="mx-12"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleSubmits(task, 3)}
                        sx={{ float: "right" }}
                        className="bg-red"
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default DateExtend;
