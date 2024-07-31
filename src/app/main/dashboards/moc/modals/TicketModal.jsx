import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

const TicketModal = ({ open, handleClose }) => {
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
    p: 4,
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={styleImp} className="p-0">
          <div className="p-30 pt-24 pb-24 border-b">
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              style={{ fontSize: "2rem" }}
            >
              Create new ticket
            </Typography>
          </div>
          <Box component="form" className="p-30 pt-24 pb-24">
            <p className="text-blue text-lg mb-24">Ticket Info</p>
            <Box>
              <TextField fullWidth label="Subject" name="subject" />
            </Box>
            <Box sx={{ marginTop: 2 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
              />
            </Box>
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-24 "
              sx={{
                marginTop: 2,
                // display: "flex",
                
                justifyContent: "space-between",
              }}
            >
              <FormControl >
                <InputLabel>Ticket Category</InputLabel>
                <Select name="category">
                  <MenuItem>options</MenuItem>
                </Select>
              </FormControl>
              <FormControl >
                <InputLabel>Ticket Priority</InputLabel>
                <Select name="priority">
                  <MenuItem>options</MenuItem>
                </Select>
              </FormControl>

            </Box>
            <Box  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-24 "
              sx={{
                marginTop: 2,
                // display: "flex",
                justifyContent: "space-between",
              }}
            >
              
              <FormControl >
                <InputLabel>Ticket Status</InputLabel>
                <Select name="status">
                  <MenuItem>options</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ marginTop: 2 }}>
              {/* <input
                type="file"
                name="fileUpload"
                // onChange={handleFileUpload}
              /> */}
               <div class="file-upload-container">
        <input type="file" id="file-upload" class="file-input" multiple/>
        <label for="file-upload" class="file-label">
            <span class="material-icons">cloud_upload</span>
            <span>Drop Your File Here</span>
        </label>
        <div id="file-list" class="file-list"></div>
    </div>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
              <Button
                variant="contained"                  
            color="secondary"
                // onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TicketModal;
