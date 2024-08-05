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
import {
  TicketCategoryEnum,
  TicketPriorityEnum,
  TicketSourceEnum,
  TicketStatusEnum,
} from "../../EnumTicket/ticketEnums";
import axios from "axios";
import { toast } from "react-toastify";

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
  const [fileName, setFileName] = useState(null);
  const [ticketData, setTicketData] = useState({
    projectId: "5EC94E1B-E058-4008-EC12-08DC9C361D1D",
    customerName: "string",
    customerMobile: "string",
    customerLocation: "string",
    subject: "",
    message: "",
    ticketCategory: "",
    ticketPriority: "",
    referenceOrder: "string",
    remarks: "creadted ticket11",
    ticketSource: "",
    dueDate: "2024-08-02T06:50:53.617Z",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTicketData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        setTicketData((prevData) => ({
          ...prevData,
          attachment: {
            name: file.name,
            extension: file.name.split(".").pop(),
            data: base64String, // Store the Base64 string
          },
        }));
      };
      reader.readAsArrayBuffer(file);
      setFileName(file.name); // Set the file name
    }
  };

  console.log(ticketData, "ticketData");

  const handleSubmit = async () => {
    const tokenTicket = localStorage.getItem("jwt_access_ticket_token");
    console.log(ticketData, "ticketData");
    try {
      const response = await axios.post(
        "http://tebsdemoserver.westindia.cloudapp.azure.com:128/api/v1/tickets",
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${tokenTicket}`,
            Tenant: "root", // Pass the token in the Authorization header
            Accept: "application/json", // You can add other headers if needed
          },
        }
      );
      console.log("Response:", response.data);
      handleClose();
      toast.success("Successfully created");
      // Add your submit logic here
    } catch (error) {
      // Handle the error
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const ticketCategoryOptions = Object.entries(TicketCategoryEnum).map(
    ([key, value]) => (
      <MenuItem key={value} value={value}>
        {key}
      </MenuItem>
    )
  );

  const ticketPriorityOptions = Object.entries(TicketPriorityEnum).map(
    ([key, value]) => (
      <MenuItem key={value} value={value}>
        {key}
      </MenuItem>
    )
  );

  const ticketStatusOptions = Object.entries(TicketStatusEnum).map(
    ([key, value]) => (
      <MenuItem key={value} value={value}>
        {key}
      </MenuItem>
    )
  );

  const TicketSourceOptions = Object.entries(TicketSourceEnum).map(
    ([key, value]) => (
      <MenuItem key={value} value={value}>
        {key}
      </MenuItem>
    )
  );
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
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={ticketData.subject}
                onChange={handleInputChange}
              />
            </Box>
            <Box sx={{ marginTop: 2 }}>
              <TextField
                fullWidth
                label="Description"
                name="message"
                multiline
                rows={4}
                value={ticketData.message}
                onChange={handleInputChange}
              />
            </Box>
            <Box
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-24 "
              sx={{
                marginTop: 2,
                justifyContent: "space-between",
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Ticket Category</InputLabel>
                <Select
                  name="ticketCategory"
                  value={ticketData.ticketCategory}
                  onChange={handleInputChange}
                >
                  {ticketCategoryOptions}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Ticket Priority</InputLabel>
                <Select
                  name="ticketPriority"
                  value={ticketData.ticketPriority}
                  onChange={handleInputChange}
                >
                  {ticketPriorityOptions}
                </Select>
              </FormControl>
            </Box>
            <Box
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-24 "
              sx={{
                marginTop: 2,
                justifyContent: "space-between",
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Ticket Status</InputLabel>
                <Select
                  name="status"
                  value={ticketData.status}
                  onChange={handleInputChange}
                >
                  {ticketStatusOptions}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Ticket Source</InputLabel>
                <Select
                  name="ticketSource"
                  value={ticketData.ticketSource}
                  onChange={handleInputChange}
                >
                  {TicketSourceOptions}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ marginTop: 2 }}>
              <div className="file-upload-container">
                {fileName ? (
                  <div className="file-uploaded">
                    <Typography variant="body2" color="textSecondary">
                      File uploaded: {fileName}
                    </Typography>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      id="file-upload"
                      className="file-input"
                      multiple
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="file-label">
                      <span className="material-icons">cloud_upload</span>
                      <span>Upload Your File Here</span>
                    </label>
                    <div id="file-list" className="file-list"></div>
                  </>
                )}
              </div>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
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
