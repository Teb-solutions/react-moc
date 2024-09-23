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
  Typography,
  Checkbox,
} from "@mui/material";
import React from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import CountdownTimer from "../../common_components/CountdownTimer ";

const SessionModal = ({
  open,
  handleClose,
  SessionList,
  formatDate,
  timer,
  timerRef,
  Session,
  show,
  setStopComment,
  handleStopSession,
  groupedData,
  selectedItems,
  handleCheckboxChange,
  handelCreateSession,
}) => {
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    maxWidth: "80vw",
    overflowY: "auto", // Enable scrolling if content exceeds maxHeight
    borderRadius: "16px",
    backgroundColor: "#fff", // Adjust as needed
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)", // Example box shadow
    padding: "0px",
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style1}>
          <div
            className="flex items-center justify-between p-30 border-b"
            style={{
              backgroundColor: "#4f46e5",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <Typography variant="h6" className="text-white">
              Evaluation Session
            </Typography>
            <FuseSvgIcon
              className="cursor-pointer text-white"
              size={20}
              onClick={handleClose}
            >
              heroicons-outline:x
            </FuseSvgIcon>
          </div>

          {SessionList[0]?.isActive ? (
            <>
              <div className="pb-0 p-30 pt-24">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Evaluation session started by{" "}
                    <b>{SessionList[0]?.startedByStaffName}</b> on{" "}
                    <b>{formatDate(SessionList[0]?.startedAt)}</b>
                  </span>
                  <span
                    style={{
                      color: "orangered",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i
                      className="clock icon"
                      style={{ marginRight: "5px" }}
                    ></i>
                    {timer}
                  </span>
                  <CountdownTimer
                    ref={timerRef}
                    Session={Session}
                    show={false}
                  />
                </div>
                <div className="mt-5 row" style={{ marginTop: "20px" }}>
                  <div
                    className="ng-star-inserted"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ flex: "65%" }}>
                      {SessionList?.map((teamMember, index) =>
                        teamMember.teamList.map((itm) => (
                          <div key={index} className="ng-star-inserted">
                            <b className="ng-star-inserted">
                              {itm.teamType == 1
                                ? "CHANGE LEADER"
                                : itm.teamType == 2
                                  ? "HSEQ"
                                  : "OTHERS"}
                            </b>
                            <span>{itm.staffName}</span>
                            <span
                              style={{
                                color:
                                  itm.approvalStatus === 2
                                    ? "green"
                                    : "orangered",
                                fontSize: "small",
                                marginLeft: "5px",
                              }}
                              className="ng-star-inserted"
                            >
                              {itm.approvalStatus === 2
                                ? `Accepted at ${formatDate(itm.updatedAt)}`
                                : "Acceptance Pending"}
                            </span>
                            {itm.comments && (
                              <div>Commented as: {itm.comments}</div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <br className="ng-star-inserted" />
                </div>
                {Session?.activeSession?.status == 2 && (
                  <div>
                    <textarea
                      placeholder="Comment *"
                      onChange={(e) => setStopComment(e.target.value)}
                    />
                  </div>
                )}
              </div>
              {Session?.activeSession?.status == 2 && (
                <div className="flex justify-end p-30 pt-24 pb-24">
                  <button className="stop-session" onClick={handleStopSession}>
                    Stop Session
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className="flex flex-col items-start justify-between p-24"
              style={{ height: "100%", overflowY: "scroll" }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {Object.keys(groupedData).map((role) => (
                    <>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {role}
                      </Typography>
                      <Table>
                        <TableHead>
                          <TableRow></TableRow>
                        </TableHead>
                        <TableBody>
                          {groupedData[role].map((item) => {
                            const isAlwaysChecked = selectedItems.some(
                              (selectedItem) =>
                                selectedItem.teamType === item.teamType &&
                                selectedItem.staffId === item.staffId
                            );

                            return (
                              <div
                                key={item.value}
                                style={{ marginTop: "10px" }}
                              >
                                <label>
                                  <Checkbox
                                    checked={isAlwaysChecked}
                                    onChange={() =>
                                      !isAlwaysChecked &&
                                      handleCheckboxChange(
                                        item.teamType,
                                        item.staffId,
                                        item.staffName
                                      )
                                    }
                                    disabled={isAlwaysChecked} // Disable checkbox if it's always checked
                                  />
                                  <span>{item.staffName}</span>
                                </label>
                              </div>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </>
                  ))}

                  <div className="flex justify-end">
                    <div
                      className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                      style={{ marginTop: "15px", marginRight: "15px" }}
                    >
                      <Button
                        className="whitespace-nowrap"
                        variant="contained"
                        color="secondary"
                        style={{ padding: "15px" }}
                        onClick={handelCreateSession}
                      >
                        Start Session
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default SessionModal;
