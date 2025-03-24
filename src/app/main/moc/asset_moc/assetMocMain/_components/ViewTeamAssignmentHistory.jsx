import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";

export const ViewTeamAssignmentHistory = ({ 
    isOpen,
    setIsOpen
 }) => {
    const styleImp = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        maxWidth: "80vw",
        height: "auto",
        borderRadius: "16px",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 2,
      };
    return (
        <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={showHelpmodal}
      onClose={handelHelpModalClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={showHelpmodal}>
            <div className="modal-content">
                <h2>Modal Content</h2>
                <p>This is the content of the modal.</p>
                <button onClick={()=>setIsOpen(false)}>Close</button>
            </div>
            </Fade>
        </Modal>

    );
}