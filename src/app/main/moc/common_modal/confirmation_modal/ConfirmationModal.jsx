import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import React from "react";

const ConfirmationModal = ({
  openSubmit,
  handleCloseSubmit,
  title,
  children,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "615px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openSubmit}
      onClose={handleCloseSubmit}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openSubmit}>
        <Box sx={style}>
          <Box>
            <div className="flex">
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                style={{
                  fontSize: "15px",
                  marginRight: "5px",
                  marginTop: "5px",

                  color: "red",
                }}
              >
                <img src="/assets/images/etc/icon.png" />
              </Typography>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                style={{
                  fontSize: "2rem",
                }}
              >
                {title}
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "15px",
                    fontWeight: "800px !important",
                    color: "grey",
                  }}
                >
                  Once submited you will not be able to revert ! Are you sure
                  you want to continue ?
                </Typography>
              </Typography>
            </div>
          </Box>
          {children}
          {/* here i need to add the button div */}
        </Box>
      </Fade>
    </Modal>
  );
};

export default ConfirmationModal;
