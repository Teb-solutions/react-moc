import { styled } from "@mui/material/styles";
import FusePageCarded from "@fuse/core/FusePageCarded";
import _ from "@lodash";
import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Select, MenuItem, ListItemText } from "@mui/material";
import MocHeader from "../MocHeader";
import { Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

import { apiAuth } from "src/utils/http";
import { useState } from "react";
import { useEffect } from "react";
import { parseISO, format } from "date-fns";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

function DocRequest() {
  const Root = styled(FusePageCarded)({
    "& .FusePageCarded-header": {},
    "& .FusePageCarded-toolbar": {},
    "& .FusePageCarded-content": {},
    "& .FusePageCarded-sidebarHeader": {},
    "& .FusePageCarded-sidebarContent": {},
  });

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
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1200px",
    maxWidth: "80vw",
    height: "60%",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };

  const drawerStyle = (open) => ({
    width: 350,
    bgcolor: "background.paper",
    borderTopRightRadius: "16px",
    borderBottomRightRadius: "16px",
    boxShadow: 24,
    p: 2,
    position: "absolute",
    top: 0,
    right: open ? 0 : -250, // Move drawer out of view when closed
    height: "100%",
    zIndex: 10,
    transition: "right 0.3s ease", // Smooth transition for opening/closing
  });

  const [docContent, setDocContent] = useState([]);
  const [docController, setDocController] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openDocModal, setOpenDocModal] = useState(false);
  const handleOpenDocModal = () => setOpenDocModal(true);
  const [listDocument, setListDocument] = useState([]);

  const [documentState, setDocumentState] = useState({
    docControllerId: "",
    isNewDocument: null,
    projectDescription: "",
    projectName: "",
    documentUrl: "",
    reasonForNewDocument: "",
    docOldValidityDate: null,
  });
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState({
    name: "",
    description: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "9efc1e9d-205e-4167-8592-f4e66dbaf961",
    changeRequestToken: null,
  });

  const handleOpenDocModalClose = () => {
    setOpenDocModal(false);
    setOpenDrawer(false);
  };

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDocumentState({
      ...documentState,
      [name]: value,
    });
  };

  const handleChanges = (date) => {
    setDocumentState({
      ...documentState,
      docOldValidityDate: date,
    });
  };

  const handelFileChange = (e) => {
    console.log(e.target.files[0]);
    setSelectedFile({
      name: e.target.files[0].name,
      description: "",
      type: e.target.files[0].type,
      document: e.target.files[0],
      documentType: "ChangeRequest",
      documentId: "9efc1e9d-205e-4167-8592-f4e66dbaf961",
      changeRequestToken: null,
    });
  };
  const handleSubmitDocument = () => {
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("descritpion", selectedFile.description);
    formData.append("type", selectedFile.type);
    formData.append("document", selectedFile.document);
    formData.append("documentType", selectedFile.documentType);
    formData.append("documentId", selectedFile.documentId);
    formData.append("changeRequestToken", selectedFile.changeRequestToken);
    apiAuth
      .post("DocumentManager/Create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        apiAuth
          .get(
            `/DocumentManager/DocList/${selectedFile.documentId}/ChangeRequest?changeRequestToken=${selectedFile.changeRequestToken}`
          )
          .then((response) => {
            setListDocument(response?.data?.data);
          });
      })
      .catch((error) => {
        console.error("There was an error uploading the document!", error);
      });
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setDocumentState((prevState) => ({
      ...prevState,
      isNewDocument: value === "New",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const date = new Date(documentState.docOldValidityDate);
    let formattedDate = null;

    if (date != "Invalid Date") {
      formattedDate = date.toISOString();
    }

    const formattedDocumentState = {
      ...documentState,
      docOldValidityDate: formattedDate,
    };

    apiAuth
      .post("/DocMoc/CreateChangeRequest", formattedDocumentState)
      .then((response) => {
        console.log(response.data);
        setOpen(false);
      })
      .catch((error) => {
        setOpen(true);
        // Handle error (e.g., show an error message)
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      return format(date, "M/d/yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };

  const getRecords = async () => {
    try {
      const staffResponse = await apiAuth.get(`/Staff/LOV`);
      setDocController(staffResponse.data.data);

      const changeRequestResponse = await apiAuth.get(`/ChangeRequest/Create`);
      setDocContent(changeRequestResponse.data.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  useEffect(() => {
    if (Object.keys(docContent).length !== 0) {
      setDocumentState({
        requestNo: docContent.requestNo,
        divisionName: docContent.divisionName,
        siteInChargeName: docContent.siteInChargeName,
        siteName: docContent.siteName,
        functionName: docContent.functionName,
        divisionId: docContent.divisionId,
        functionId: docContent.functionId,
        siteId: docContent.siteId,
        siteInchargeId: docContent.siteInchargeId,
        type: "Document",
        documentId: "a18a0da0-b254-4862-a9b7-8caac0d620ec",
        documentStatus: 2,
        documentType: 0,
        docType: "1",
        requestDate: formatDate(docContent?.requestDate),
      });
    }
  }, [docContent]);

  return (
    <Root
      header={<MocHeader />}
      content={
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-40">
            <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
              <div
                _ngcontent-fyk-c288=""
                class="flex items-center w-full  border-b justify-between"
              >
                <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                  New Document MOC Request
                </h2>
              </div>
            </div>
            <div
              style={{ marginTop: "30px", justifyContent: "space-between" }}
              className="flex flex-row "
            >
              <Box
                sx={{
                  width: 480,
                  maxWidth: "50%",
                }}
              >
                <TextField
                  fullWidth
                  label="Request No"
                  id="Request No"
                  value={docContent.requestNo || ""}
                  disabled
                />
              </Box>
              <Box
                sx={{
                  width: 480,
                  maxWidth: "50%",
                }}
              >
                <TextField
                  fullWidth
                  label="Date"
                  id="Date"
                  value={formatDate(docContent?.requestDate)}
                  disabled
                />
              </Box>
              <Box
                sx={{
                  width: 480,
                  maxWidth: "50%",
                }}
              >
                <TextField
                  fullWidth
                  label="Site in charge"
                  id="Site in charge"
                  value={docContent.siteInChargeName || ""}
                  disabled
                />
              </Box>
            </div>
            <div
              style={{ marginTop: "30px", justifyContent: "space-between" }}
              className="flex flex-row "
            >
              <Box
                sx={{
                  width: 480,
                  maxWidth: "50%",
                }}
              >
                <TextField
                  fullWidth
                  label="Site"
                  id="Site
"
                  value={docContent.siteName || ""}
                  disabled
                />
              </Box>
              <Box
                sx={{
                  width: 480,
                  maxWidth: "50%",
                }}
              >
                <TextField
                  fullWidth
                  label="Division"
                  id="Division"
                  value={docContent.divisionName || ""}
                  disabled
                />
              </Box>
              <Box
                sx={{
                  width: 480,
                  maxWidth: "50%",
                }}
              >
                <TextField
                  fullWidth
                  label="Function"
                  id="Function"
                  value={docContent.functionName || ""}
                  disabled
                />
              </Box>
            </div>

            <div
              className="my-10"
              style={{ borderTopWidth: "2px", marginTop: "45px" }}
            ></div>
            <div style={{ marginTop: "20px" }}>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel>Document Name *</InputLabel>
                  <OutlinedInput
                    id="projectName"
                    name="projectName"
                    value={documentState.projectName}
                    onChange={handleChange}
                    label="Document Name *"
                  />
                </FormControl>
              </Box>
              <Box
                sx={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}
              >
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="projectDescription">
                    Document Description *
                  </InputLabel>
                  <OutlinedInput
                    id="projectDescription"
                    name="projectDescription"
                    value={documentState.projectDescription}
                    onChange={handleChange}
                    label="Document Description *"
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: "15px",
                  marginLeft: "10px",
                }}
              >
                <FormControl>
                  <FormLabel id="documentType">Document Type *</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="documentType"
                    name="documentType"
                    value={
                      documentState.isNewDocument == null
                        ? ""
                        : documentState.isNewDocument
                          ? "New"
                          : "Existing"
                    }
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="New"
                      control={<Radio />}
                      label="New"
                    />
                    <FormControlLabel
                      value="Existing"
                      control={<Radio />}
                      label="Existing"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              {documentState.isNewDocument === true && (
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}
                >
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="newDocumentField">
                      Reason For New Document *
                    </InputLabel>
                    <OutlinedInput
                      id="reasonForNewDocument"
                      name="reasonForNewDocument"
                      value={documentState.reasonForNewDocument}
                      onChange={handleChange}
                      label="Reason For New Document *"
                    />
                  </FormControl>
                </Box>
              )}
              {documentState.isNewDocument === false && (
                <>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <FormControl
                      sx={{
                        m: 1,
                        width: 480,
                        maxWidth: "50%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          marginTop: "15px",
                        }}
                      >
                        <DatePicker
                          label="Validity Expires On *"
                          value={documentState.docOldValidityDate}
                          onChange={handleChanges}
                          renderInput={(params) => (
                            <TextField fullWidth {...params} />
                          )}
                        />
                      </Box>
                    </FormControl>
                  </LocalizationProvider>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "15px",
                    }}
                  >
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel htmlFor="existingDocumentField2">
                        Reason For Change*
                      </InputLabel>
                      <OutlinedInput
                        id="reasonForNewDocument"
                        name="reasonForNewDocument"
                        value={documentState.reasonForNewDocument}
                        onChange={handleChange}
                        label="Reason For Change*"
                      />
                    </FormControl>
                  </Box>
                </>
              )}
              <Box
                sx={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}
              >
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel htmlFor="documentUrl">Document URL *</InputLabel>
                  <OutlinedInput
                    id="documentUrl"
                    name="documentUrl"
                    value={documentState.documentUrl}
                    onChange={handleChange}
                    label="Document URL *"
                  />
                </FormControl>
              </Box>
              <Box
                sx={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}
              >
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel id="functionName-label">
                    Document Controller *
                  </InputLabel>
                  <Select
                    labelId="functionName-label"
                    id="docControllerId"
                    name="docControllerId"
                    value={documentState.docControllerId}
                    onChange={handleChange}
                    label="Document Controller *"
                  >
                    {docController.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div
              className="my-10"
              style={{ borderTopWidth: "2px", marginTop: "40px" }}
            ></div>
            <div className="flex justify-between">
              <div
                className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                style={{ marginTop: "15px" }}
              >
                <Button
                  className="whitespace-nowrap mt-5"
                  style={{
                    border: "1px solid",
                    backgroundColor: "#0000",
                    color: "black",
                    borderColor: "rgba(203,213,225)",
                  }}
                  variant="contained"
                  color="warning"
                  startIcon={
                    <FuseSvgIcon size={20}>heroicons-solid:upload</FuseSvgIcon>
                  }
                  onClick={handleOpenDocModal}
                >
                  Document
                </Button>
              </div>
              <div
                className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                style={{ marginTop: "15px" }}
              >
                <div>
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={openDocModal}
                    onClose={handleOpenDocModalClose}
                    closeAfterTransition
                    // Customize backdrop appearance
                    BackdropComponent={Backdrop}
                    // Props for backdrop customization
                    BackdropProps={{
                      timeout: 500, // Adjust as needed
                      style: {
                        // Add backdrop styles here
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                      },
                    }}
                  >
                    <Fade in={openDocModal}>
                      <Box sx={style1}>
                        <Box sx={{ flex: 1 }}>
                          <Box
                            className="flex justify-between"
                            style={{ margin: "30px" }}
                          >
                            <Typography
                              id="transition-modal-title"
                              variant="h6"
                              component="h2"
                              style={{
                                fontSize: "3rem",
                              }}
                            >
                              File Manager
                              {/* <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                              >
                                0 Files
                              </Typography> */}
                            </Typography>
                            <Box>
                              <Button
                                className=""
                                variant="contained"
                                color="secondary"
                                onClick={toggleDrawer(true)}
                              >
                                <FuseSvgIcon size={20}>
                                  heroicons-outline:plus
                                </FuseSvgIcon>
                                <span className="mx-4 sm:mx-8">
                                  Upload File
                                </span>
                              </Button>
                            </Box>
                          </Box>
                          <Box>
                            <Typography
                              id="transition-modal-title"
                              variant="h6"
                              className="p-6 md:p-8 md:py-6 min-h-[415px] max-h-120 space-y-8 overflow-y-auto"
                              component="h2"
                              style={{
                                backgroundColor: "#e3eeff80",
                              }}
                            >
                              <div class="content">
                                <img src="/assets/images/etc/icon.png" />
                              </div>
                            </Typography>
                          </Box>
                        </Box>
                        {openDrawer && (
                          <Box sx={drawerStyle(openDrawer)}>
                            <div className="flex justify-end">
                              <Button
                                className=""
                                variant="contained"
                                style={{ backgroundColor: "white" }}
                                onClick={() => setOpenDrawer(false)}
                              >
                                <FuseSvgIcon size={20}>
                                  heroicons-outline:close
                                </FuseSvgIcon>
                                x
                              </Button>
                            </div>
                            <div>&nbsp;</div>
                            <div className="text-center">
                              <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  handelFileChange(e);
                                }}
                              />
                              <label htmlFor="fileInput">
                                <Button
                                  className=""
                                  variant="contained"
                                  color="secondary"
                                  style={{
                                    backgroundColor: "#3b82f680",
                                    borderRadius: "5px",
                                    paddingLeft: "50px",
                                    paddingRight: "50px",
                                  }}
                                  component="span"
                                >
                                  <FuseSvgIcon size={20}>
                                    heroicons-outline:plus
                                  </FuseSvgIcon>
                                  <span className="mx-4 sm:mx-8">
                                    Upload File
                                  </span>
                                </Button>
                              </label>
                              <Box
                                component="form"
                                sx={{
                                  "& > :not(style)": { m: 1, width: "25ch" },
                                }}
                                noValidate
                                autoComplete="off"
                              >
                                <TextField
                                  id="standard-basic"
                                  label="Information"
                                  variant="standard"
                                  disabled
                                />
                              </Box>
                              <Box
                                component="form"
                                sx={{
                                  "& > :not(style)": { m: 1, width: "25ch" },
                                }}
                                noValidate
                                autoComplete="off"
                              >
                                <TextField
                                  id="selectedFileName"
                                  label="Selecte File"
                                  variant="standard"
                                  disabled
                                  value={selectedFile.name}
                                />
                              </Box>
                              <Box
                                component="form"
                                sx={{
                                  "& > :not(style)": { m: 1, width: "25ch" },
                                }}
                                noValidate
                                autoComplete="off"
                              >
                                <TextField
                                  id="standard-basic"
                                  label=" Description"
                                  name="description"
                                  variant="standard"
                                  onChange={handelFileDiscriptionChange}
                                  value={selectedFile.description}
                                />
                              </Box>
                            </div>

                            <div
                              className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                              style={{
                                marginTop: "15px",
                                justifyContent: "end",
                                backgroundColor: " rgba(248,250,252)",
                                padding: "10px",
                              }}
                            >
                              <Button
                                className="whitespace-nowrap"
                                variant="contained"
                                color="primary"
                                style={{
                                  backgroundColor: "white",
                                  color: "black",
                                  border: "1px solid grey",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="whitespace-nowrap"
                                variant="contained"
                                color="secondary"
                                type="submit"
                                onClick={handleSubmitDocument}
                              >
                                Submit
                              </Button>
                            </div>
                          </Box>
                        )}
                      </Box>
                    </Fade>
                  </Modal>
                </div>
                <Button
                  className="whitespace-nowrap"
                  variant="contained"
                  color="secondary"
                  style={{ padding: "15px" }}
                  onClick={handleOpen}
                >
                  Submit
                </Button>

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
                            Submit request
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
                              Once submited you will not be able to revert ! Are
                              you sure you want to continue ?
                            </Typography>
                          </Typography>
                        </div>
                      </Box>
                      <div
                        className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                        style={{
                          marginTop: "15px",
                          justifyContent: "end",
                          backgroundColor: " rgba(248,250,252)",
                          padding: "10px",
                        }}
                      >
                        <Button
                          className="whitespace-nowrap"
                          variant="contained"
                          color="primary"
                          style={{
                            padding: "23px",
                            backgroundColor: "white",
                            color: "black",
                            border: "1px solid grey",
                          }}
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="whitespace-nowrap"
                          variant="contained"
                          color="secondary"
                          style={{ padding: "23px", backgroundColor: "red" }}
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    </Box>
                  </Fade>
                </Modal>
                <Button
                  className="whitespace-nowrap"
                  variant="contained"
                  color="primary"
                  style={{
                    padding: "15px",
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid grey",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      }
    />
  );
}

export default DocRequest;
