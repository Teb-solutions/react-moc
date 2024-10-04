import React from "react";
import {
  Modal,
  Box,
  Button,
  Fade,
  TextField,
  FormLabel,
  Typography,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const AuditModal = ({
  open,
  handleClose,
  handleSubmit,
  auditData,
  onChange,
  errors,
  setErrors
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const styleAuditCom = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box sx={styleAuditCom}>
          <Box
            style={{
              padding: "20px",
              backgroundColor: "#4f46e5",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h4 className="pt-12">Add Audit</h4>
            <Button onClick={handleClose}>
              <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
            </Button>
          </Box>
          <Box>
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              style={{
                fontSize: "4rem",
                fontWeight: "800px !important",
              }}
            >
              <div className="flex-auto">
                <div className="flex flex-col-reverse">
                  <div
                    style={{
                      marginTop: "30px",
                      justifyContent: "space-between",
                      margin: "10px",
                    }}
                    className="flex flex-row"
                  >
                    <Box sx={{ width: "100%" }}>
                      <FormLabel
                        className="font-medium text-14"
                        component="legend"
                      >
                        Comments *
                      </FormLabel>
                      <TextField
                        fullWidth
                        name="comments"
                        value={auditData.comments}
                        onChange={handleInputChange}
                        error={!!errors?.comments}
                        helperText={errors?.comments}
                      />
                    </Box>
                  </div>
                </div>{" "}
              </div>
              <div className="flex justify-end m-5">
                <Button
                  className="whitespace-nowrap ms-5 me-8 "
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </div>
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AuditModal;
