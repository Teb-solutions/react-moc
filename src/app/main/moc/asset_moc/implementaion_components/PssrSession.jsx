import {
    Backdrop,
    Badge,
    Box,
    Button,
    Checkbox,
    Fade,

    Modal,

} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";


const PssrSession = (props) => {
    const { pssrSessionOpen, setPssrSessionOpen, pssrsessionStatus, teamList, pssrList, handlePssrSessionSave, checkedStaff, handleCheckboxSessionChange, startedAt, handleStopSession, stopComment, setStopComment } = props
    const stylePssr = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "900px",
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
                open={pssrSessionOpen}
                onClose={() => setPssrSessionOpen(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={pssrSessionOpen}>
                    <Box sx={stylePssr}>
                        <Box
                            style={{
                                padding: "25px",
                                backgroundColor: "#4f46e5",
                                borderTopLeftRadius: "16px",
                                borderTopRightRadius: "16px",
                                display: "flex",
                                justifyContent: "space-between",
                                color: "white",
                            }}
                            className="cursor-pointer"
                            onClick={() => setPssrSessionOpen(false)}
                        >
                            <h4 className="pt-12" style={{ fontSize: "17px" }}>
                                PSSR Session
                            </h4>
                            <FuseSvgIcon size={25}>heroicons-outline:x</FuseSvgIcon>
                        </Box>
                        <Box
                            sx={{
                                overflow: "auto",
                                padding: "5px 30px 30px 30px",
                                maxHeight: "500px",
                                overflowY: "auto",
                            }}
                        >
                            {pssrsessionStatus == 0 && (
                                <ul style={{ listStyleType: "none", padding: 0 }}>
                                    {pssrList.map((item) => (
                                        <li
                                            key={item.staffId}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <Checkbox
                                                checked={checkedStaff.includes(item.staffId)}
                                                onChange={() =>
                                                    handleCheckboxSessionChange(item.staffId)
                                                }
                                            />
                                            <label
                                                htmlFor={`pssr-${item.staffId}`}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                {item.staffName}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <>
                                {(pssrsessionStatus == 1 || pssrsessionStatus == 2) && (
                                    <>
                                        <h3 style={{ padding: "2rem" }}>
                                            {pssrsessionStatus != 2 && " PSSR session created by "}
                                            {pssrsessionStatus == 1 ||
                                                (pssrsessionStatus == 2 && " PSSR session started by ")}
                                            {""}
                                            <b>{localStorage.getItem("username")} </b>
                                            on{" "}
                                            <b>
                                                {new Date(startedAt).toLocaleString(
                                                    "en-US",
                                                    {
                                                        month: "numeric",
                                                        day: "numeric",
                                                        year: "2-digit",
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        hour12: true,
                                                    }
                                                )}
                                            </b>
                                        </h3>
                                        <h3 style={{ paddingLeft: "2rem" }}>
                                            {" "}
                                            <b>TEAM</b>
                                        </h3>
                                    </>
                                )}
                                <ul style={{ paddingLeft: "2rem" }}>
                                    {teamList.map((item) => (
                                        <li
                                            style={{
                                                fontSize: "16px",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {item.staffName}
                                            {item.approvalStatus === 1 ? (
                                                <span
                                                    style={{
                                                        color: "orangered",
                                                        fontSize: "14px",
                                                        marginLeft: "8px",
                                                    }}
                                                >
                                                    Approval Pending
                                                </span>
                                            ) : item.approvalStatus === 2 ? (
                                                <span
                                                    style={{
                                                        color: "green",
                                                        fontSize: "14px",
                                                        marginLeft: "8px",
                                                    }}
                                                >
                                                    Approved
                                                </span>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: "red",
                                                        fontSize: "14px",
                                                        marginLeft: "8px",
                                                    }}
                                                >
                                                    Rejected
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                {pssrsessionStatus == 2 && (
                                    <div style={{ paddingLeft: "2rem" }}>
                                        <textarea
                                            placeholder="Comment *"
                                            onChange={(e) => setStopComment(e.target.value)}
                                        />
                                    </div>
                                )}

                                {pssrsessionStatus == 2 && (
                                    <div className="flex justify-end p-5 pt-24 pb-24">
                                        <button
                                            className="stop-session"
                                            onClick={handleStopSession}
                                            style={
                                                stopComment == "" ? { backgroundColor: "#c5c5c5" } : {}
                                            }
                                            disabled={stopComment == ""}
                                        >
                                            Stop Session
                                        </button>
                                    </div>
                                )}
                            </>

                            {pssrsessionStatus == 0 && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ float: "right" }}
                                    className="mx-12"
                                    onClick={handlePssrSessionSave}
                                >
                                    Save
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default PssrSession