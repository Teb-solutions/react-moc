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
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

import {
  TicketCategoryEnum,
  TicketPriorityEnum,
  TicketSourceEnum,
  TicketStatusEnum,
} from "../../EnumTicket/ticketEnums";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicketModal = ({ open, errors, setErrors, setModalOpen }) => {
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
    customerName: "",
    customerMobile: "string",
    customerLocation: "string",
    subject: "",
    message: "",
    ticketCategory: "",
    ticketPriority: "",
    referenceOrder: "string",
    remarks: "created ticket11",
    ticketSource: 5,
    dueDate: "2024-08-02T06:50:53.617Z",
    status: 1,
  });

  const handleModalClose = () => {
    setTicketData({
      projectId: "5EC94E1B-E058-4008-EC12-08DC9C361D1D",
      customerName: "",
      customerMobile: "string",
      customerLocation: "string",
      subject: "",
      message: "",
      ticketCategory: "",
      ticketPriority: "",
      referenceOrder: "string",
      remarks: "created ticket11",
      ticketSource: 5,
      dueDate: "2024-08-02T06:50:53.617Z",
      status: 1,
    });
    setFileName("");
    setModalOpen(false);
    setErrors({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTicketData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
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
            extension: `.${file.name.split(".").pop()}`,
            data: base64String, // Store the Base64 string
          },
        }));
      };
      reader.readAsArrayBuffer(file);
      setFileName(file.name);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!ticketData.subject) tempErrors.subject = "Subject is required.";
    if (!ticketData.customerName)
      tempErrors.customerName = "CustomerName is required.";
    if (!ticketData.message) tempErrors.message = "Description is required.";
    if (!ticketData.ticketCategory)
      tempErrors.ticketCategory = "Ticket Category is required.";
    if (!ticketData.ticketPriority && ticketData.ticketPriority !== 0)
      tempErrors.ticketPriority = "Ticket Priority is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    console.log(ticketData, "tickettt");
    const tokenTicket = localStorage.getItem("jwt_access_ticket_token");
    try {
      const response = await axios.post(
        "https://pmcrm.tebs.co.in/api/v1/tickets",
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${tokenTicket}`,
            Tenant: "root",
            Accept: "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      handleModalClose();
      toast.success("Successfully created");
      setTicketData({
        projectId: "5EC94E1B-E058-4008-EC12-08DC9C361D1D",
        customerName: "",
        customerMobile: "string",
        customerLocation: "string",
        subject: "",
        message: "",
        ticketCategory: "",
        ticketPriority: "",
        referenceOrder: "string",
        remarks: "created ticket11",
        ticketSource: 5,
        dueDate: "2024-08-02T06:50:53.617Z",
        status: 1,
      });
      setFileName("");
    } catch (error) {
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
      onClose={handleModalClose}
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
          <div className="p-30 pt-24 pb-24 border-b d-flex justify-between">
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              style={{ fontSize: "2rem" }}
            >
              Create new ticket
            </Typography>
            <Button onClick={handleModalClose}>
              <FuseSvgIcon size={25}>heroicons-outline:x</FuseSvgIcon>
            </Button>
          </div>
          <Box component="form" className="p-30 pt-24 pb-24">
            <p className="text-blue text-lg mb-24">Ticket Info</p>
            <Box>
              <TextField
                fullWidth
                label="Subject*"
                name="subject"
                value={ticketData.subject}
                onChange={handleInputChange}
                error={!!errors.subject}
                helperText={errors.subject}
              />
            </Box>
            <Box sx={{ marginTop: 2 }}>
              <TextField
                fullWidth
                label="Created By*"
                name="customerName"
                value={ticketData.customerName}
                onChange={handleInputChange}
                error={!!errors.customerName}
                helperText={errors.customerName}
              />
            </Box>
            <Box sx={{ marginTop: 2 }}>
              <TextField
                fullWidth
                label="Description*"
                name="message"
                multiline
                rows={4}
                value={ticketData.message}
                onChange={handleInputChange}
                error={!!errors.message}
                helperText={errors.message}
              />
            </Box>
            <Box
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-24 "
              sx={{
                marginTop: 2,
                justifyContent: "space-between",
              }}
            >
              <FormControl fullWidth error={!!errors.ticketCategory}>
                <InputLabel>Ticket Category*</InputLabel>
                <Select
                  name="ticketCategory"
                  value={ticketData.ticketCategory}
                  onChange={handleInputChange}
                >
                  {ticketCategoryOptions}
                </Select>
                {errors.ticketCategory && (
                  <Typography variant="caption" color="error">
                    {errors.ticketCategory}
                  </Typography>
                )}
              </FormControl>
              <FormControl fullWidth error={!!errors.ticketPriority}>
                <InputLabel>Ticket Priority*</InputLabel>
                <Select
                  name="ticketPriority"
                  value={ticketData.ticketPriority}
                  onChange={handleInputChange}
                >
                  {ticketPriorityOptions}
                </Select>
                {errors.ticketPriority && (
                  <Typography variant="caption" color="error">
                    {errors.ticketPriority}
                  </Typography>
                )}
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
