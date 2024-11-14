// src/components/CommonModal.jsx
import React from "react";
import { Modal, Backdrop, Fade, Box, Button } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

interface CommonModalProps {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  title: string;
}

const CommonModal: React.FC<CommonModalProps> = ({
  open,
  handleClose,
  children,
  title,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "120rem",
    maxWidth: "90vw",
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
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div
            className="flex justify-end mx-4 sm:mx-8"
            style={{
              marginTop: "-32px",
              marginRight: "-29px",
              padding: "0 0 -24px ",
            }}
          >
            <Button
              variant="contained"
              style={{ backgroundColor: "white" }}
              onClick={handleClose}
            >
              {" "}
              X
            </Button>
          </div>
          <div className="border-1 border-blue-500 rounded-md">
            <h2
              id="transition-modal-title "
              className="border-b-1 mb-20 bg-blue-500 p-5 text-white"
            >
              {title}
            </h2>
            <div className="px-10 pb-20">{children}</div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CommonModal;
