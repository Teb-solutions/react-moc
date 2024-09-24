import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import "react-toastify/dist/ReactToastify.css";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button } from "@mui/material";

const HelpModal = ({ showHelpmodal, handelHelpModalClose, activityName }) => {
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
        <Box sx={styleImp} className="p-0">
          <Box
            style={{
              padding: "15px",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              color: "black",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button onClick={handelHelpModalClose}>
              <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
            </Button>
          </Box>
          <Box component="form" className=" pb-24">
            <div className="flex gap-24 w-full mt-32 justify-center">
              {activityName === "Initiation" && (
                <img
                  src="assets/images/help/initiation.png"
                  alt="Initiation Image"
                />
              )}
              {activityName === "Evaluation" && (
                <img
                  src="assets/images/help/evaluation.png"
                  alt="Evaluation Image"
                />
              )}
              {activityName === "Implementation" && (
                <img
                  src="assets/images/help/implementation.png"
                  alt="Implementation Image"
                />
              )}
            </div>
          </Box>
          <Box component="form" className="pl-12 pt-24 pb-24">
            <div className="flex  w-full mt-32 justify-center">
              If you need further assistance, please&nbsp;
              <a
                href="http://wikihelp.tebs.co.in:3000/en/moc/user-manual"
                target="_blank"
                style={{
                  textDecoration: "none",
                  backgroundColor: "white",
                }}
                className="text-blue"
              >
                click here
              </a>
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default HelpModal;
