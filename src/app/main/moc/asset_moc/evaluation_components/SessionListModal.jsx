import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
const SessionListModal = ({
  openSession,
  handleCloseSession,
  SessionList,
  formatDate,
}) => {
  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    maxWidth: "80vw",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "24px",
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openSession}
      onClose={handleCloseSession}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openSession}>
        <Box sx={style2}>
          <Box
            className=" align-items-center"
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
            <span> Evaluation Session</span>
            <Button
              className="p-0 d-block minw-auto"
              variant="contained"
              style={{ backgroundColor: "#4f46e5", color: "white" }}
              onClick={handleCloseSession}
            >
              <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
            </Button>
          </Box>

          <Box sx={{ overflow: "auto" }} className="p-30 pt-24 pb-24">
            <Grid
              container
              spacing={2}
              className="m-0 p-0 w-100"
              style={{ overflow: "scroll", height: "35vh" }}
            >
              <Grid item xs={12} className="p-0 w-100">
                <Table
                  className="mat-elevatio demo-table table_custome col-span-12 mt-0 w-full"
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
                      ></TableCell>
                      <TableCell
                        className="text-left pb-3"
                        sx={{ border: "1px solid black" }}
                      >
                        <b> Session</b>
                      </TableCell>
                      <TableCell
                        className="text-left pb-3"
                        sx={{ border: "1px solid black" }}
                      >
                        <b> Team</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ border: "1px solid black" }}>
                    {SessionList.map((session, index) => {
                      const isRejected = session.teamList.some(
                        (team) => team.approvalStatus === 3
                      );

                      return (
                        <TableRow key={session.id}>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {isRejected ? (
                              <span className="bg-red-100 rounded px-5 py-1 text-grey font-semibold">
                                Rejected
                              </span>
                            ) : (
                              <>
                                {session.isExpired && (
                                  <span
                                    className="bg-red-100 rounded px-5 py-1 text-secondary font-semibold"
                                    style={{
                                      backgroundColor: "rgba(254,202,202)",
                                    }}
                                  >
                                    Expired
                                  </span>
                                )}
                                {session.isActive && (
                                  <span className="bg-green-100 rounded px-5 py-1 text-secondary font-semibold">
                                    Active
                                  </span>
                                )}
                                {session.isSessionEnded && (
                                  <span className="bg-red-100 rounded px-5 py-1 text-grey font-semibold">
                                    Ended
                                  </span>
                                )}
                              </>
                            )}
                            <div>
                              <b>Session started by</b>{" "}
                              {session.startedByStaffName} at{" "}
                              {formatDate(session.startedAt)}
                            </div>
                            {session.isSessionEnded && (
                              <div className="mt-2">
                                <b>Session ended at</b>{" "}
                                {session.endedAt && formatDate(session.endedAt)}
                              </div>
                            )}
                            {session.comments && <div>{session.comments}</div>}
                          </TableCell>
                          <TableCell
                            className="text-left pb-3"
                            sx={{ border: "1px solid silver" }}
                          >
                            {session.teamList.map((team, index) => (
                              <div key={index}>
                                {team.staffName}-
                                {team.approvalStatus === 1 ? (
                                  <span style={{ color: "orangered" }}>
                                    Acceptance Pending
                                  </span>
                                ) : team.approvalStatus === 2 ? (
                                  <span className="text-green">
                                    Accepted at{" "}
                                    {team.updatedAt &&
                                      formatDate(team.updatedAt)}
                                  </span>
                                ) : (
                                  <span className="text-red">
                                    Rejected at{" "}
                                    {team.updatedAt &&
                                      formatDate(team.updatedAt)}
                                  </span>
                                )}
                                {team.comments && (
                                  <div>
                                    <b>Commented as: </b>
                                    {team.comments}
                                  </div>
                                )}
                              </div>
                            ))}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SessionListModal;
