import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import React from "react";

const DeleteModal = ({ openDelete, handleCloseDelete, title, children }) => {
  const style1 = {
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
      open={openDelete}
      onClose={handleCloseDelete}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openDelete}>
        <Box sx={style1}>
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
                Confirm action
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
                  Do you want to delete ?
                </Typography>
              </Typography>
            </div>
          </Box>
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeleteModal;
