
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Backdrop,
    Box,
    Button,
    Checkbox,
    Fade,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    Modal,
    Badge,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const ExternalConsultation = (props) => {
    const { dateExtendopen, handlehandledateExtendClose, selectedTasks, formatDates, selectedStaff, handleStaffChange, staff, handleEmailChange, email, comments, handleCommentsChange, commentExtValidation, isLoading, handleSubmit } = props

    const style1 = {
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
                    <Box sx={style1}>
                        <Box
                            style={{
                                padding: "30px",
                                backgroundColor: "#4f46e5",
                                borderTopLeftRadius: "16px",
                                borderTopRightRadius: "16px",
                                color: "white",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <h5>Send for external consultation</h5>
                            <Button onClick={handlehandledateExtendClose}>
                                <FuseSvgIcon size={25}>heroicons-outline:x</FuseSvgIcon>
                            </Button>
                        </Box>

                        <Box sx={{ overflow: "auto", padding: "5px 30px 0 30px" }}>
                            <Grid container spacing={2} className="mt-5">
                                <Grid item xs={12}>
                                    <Table
                                        className="mat-elevatio demo-table col-span-12 mt-0 w-full table_custome"
                                        sx={{ width: "100%" }}
                                    >
                                        <TableHead
                                            sx={{
                                                borderBottom: "2px solid silver",
                                                fontSize: "medium",
                                            }}
                                        >
                                            <TableRow>
                                                <TableCell className="text-left">Impact</TableCell>
                                                <TableCell className="text-left">
                                                    What is the task
                                                </TableCell>
                                                <TableCell className="text-left">
                                                    How is the task done
                                                </TableCell>
                                                <TableCell className="text-left">
                                                    Task Deadline
                                                </TableCell>
                                                <TableCell className="text-left">
                                                    Task Assigned To
                                                </TableCell>
                                                <TableCell className="text-left">Due Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedTasks?.map((update) => (
                                                <TableRow key={update.id}>
                                                    <TableCell
                                                        className="text-left"
                                                    // sx={{ border: "1px solid silver" }}
                                                    >
                                                        {update.impact}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-left"
                                                    // sx={{ border: "1px solid silver" }}
                                                    >
                                                        {update.task}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-left"
                                                    // sx={{ border: "1px solid silver" }}
                                                    >
                                                        {update.how}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-left"
                                                    // sx={{ border: "1px solid silver" }}
                                                    >
                                                        {update.deadline}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-left"
                                                    // sx={{ border: "1px solid silver" }}
                                                    >
                                                        {update.assignedTo}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-left"
                                                    // sx={{ border: "1px solid silver" }}
                                                    >
                                                        {formatDates(update.dueDate)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div>&nbsp;</div>
                                    <Grid item xs={12} className="mt-5">
                                        <FormControl fullWidth sx={{ flexGrow: 1 }}>
                                            <InputLabel id="staff-label">Select Staff</InputLabel>
                                            <Select
                                                labelId="staff-label"
                                                id="staff-select"
                                                multiple
                                                value={selectedStaff}
                                                onChange={handleStaffChange}
                                                renderValue={(selected) => (
                                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                        {selected.map((value) => (
                                                            <div key={value}>
                                                                <ListItemText
                                                                    primary={
                                                                        staff.find(
                                                                            (staffMember) =>
                                                                                staffMember.value === value
                                                                        )?.text
                                                                    }
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 300,
                                                        },
                                                    },
                                                }}
                                            >
                                                {staff.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        <Checkbox
                                                            checked={
                                                                selectedStaff.indexOf(option.value) > -1
                                                            }
                                                        />
                                                        <ListItemText primary={option.text} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        className="mt-5"
                                        style={{ marginTop: "10px" }}
                                    >
                                        <TextField
                                            label="Email"
                                            multiline
                                            rows={1}
                                            fullWidth
                                            required
                                            value={email}
                                            onChange={handleEmailChange}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        className="mt-5"
                                        style={{ marginTop: "10px" }}
                                    >
                                        <TextField
                                            label="Comments"
                                            // className={`${commentExtValidation ? "border border-red-500" : ""}`}
                                            className="border-0"
                                            multiline
                                            rows={1}
                                            fullWidth
                                            required
                                            value={comments}
                                            onChange={handleCommentsChange}
                                        />
                                        <div className="mt-5 text-sm text-red-500">
                                            {commentExtValidation}
                                        </div>
                                    </Grid>
                                    <div
                                        className="p-30 pt-24 pb-24"
                                        style={{
                                            display: "flex",
                                            justifyContent: "end",
                                        }}
                                    >
                                        <div>
                                            <Button
                                                disabled={isLoading}
                                                variant="contained"
                                                style={{ color: "white", backgroundColor: "blue" }}
                                                onClick={handleSubmit}
                                            >
                                                Send Email
                                            </Button>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}



export default ExternalConsultation