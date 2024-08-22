import { useEffect, useState } from "react";
import {
  Backdrop,
  Badge,
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { withStyles } from "@mui/styles";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@mui/styles";
import SwipeableViews from "react-swipeable-views";
import { parseISO, format } from "date-fns";
import { apiAuth } from "src/utils/http";

const useStyles = makeStyles({
  documentList: {
    backgroundColor: "#e3eeff80",
  },
  documentItem: {
    textAlign: "center",
    padding: "16px",
  },
  documentImage: {
    width: "50px", // Adjust the size as needed
    height: "50px",
  },
  documentDetails: {
    marginTop: "8px",
  },
});

function Initiation(props) {
  const classes = useStyles();
  const {
    contentDetails,
    assetEvaluationId,
    contentDetailsini,
    appActivity,
    contentDetailsT,
    contentDetailsDocu,
  } = props;
  const StyledBadge = withStyles((theme) => ({
    badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);

  const [open, setOpen] = useState(false);
  const [documentState, setDocumentState] = useState({
    docControllerId: "",
    isNewDocument: null,
    projectDescription: "",
    projectName: "",
    documentUrl: "",
    reasonForNewDocument: "",
    docOldValidityDate: null,
  });
  const [deletes, setDeletes] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [listDocument, setListDocument] = useState([]);
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  const [selectedFile, setSelectedFile] = useState({
    name: "",
    description: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });

  const [open1, setOpen1] = useState(false);
  const [openDrawer1, setOpenDrawer1] = useState(false);
  const [fileDetails1, setFileDetails1] = useState(false);
  const [listDocument1, setListDocument1] = useState([]);
  const [selectedDocument1, setSelectedDocument1] = useState(null);
  const [documenDowToken1, setDocumenDowToken1] = useState("");

  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1200px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };
  const style2 = {
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
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      return format(date, "MMMM dd, yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };
  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
  const BoldLabel = styled("label")({
    fontWeight: "bold",
    color: "black",
  });
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
    transition: "right 0.3s ease",
    overflow: "auto", // Smooth transition for opening/closing
  });

  const handleDownload = () => {
    apiAuth
      .get(`/DocumentManager/download/${documenDowToken}`, {
        responseType: "blob",
      })
      .then((response) => {
        setFileDetails(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", selectedDocument.name); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
  };
  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };

  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
    fileDetails(false)
  };

  const ListDoc = (id, changeRequestId) => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${changeRequestId}/ChangeRequest?changeRequestToken=${id}`
      )
      .then((Resp) => {
        setListDocument(Resp?.data?.data);
      });
  };

  const handleOpen = () => {
    setOpen(true);
    ListDoc(assetEvaluationId, contentDetails?.changeRequestId);
    // const newGuid = uuidv4();
    // setSelectedFile((prevState) => ({
    //   ...prevState,
    //   documentId: newGuid,
    // }));
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

  const handleSubmitAsset = (e) => {
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("descritpion", selectedFile.description);
    formData.append("type", selectedFile.type);
    formData.append("document", selectedFile.document);
    formData.append("documentType", selectedFile.documentType);
    formData.append("documentId", selectedFile.documentId);
    formData.append("changeRequestToken", selectedFile.changeRequestToken);
  };

  const handleCloseDelete = () => {
    setDeletes(false);
  };
  const handleDelete = (e, id, token) => {
    e.preventDefault();
    setDocId(id);
    setDocToken(token);
    setDeletes(true);
  };

  const handleSubmitDelete = () => {
    apiAuth.delete(`DocumentManager/Delete/${docToken}`).then((response) => {
      apiAuth
        .get(
          `/DocumentManager/DocList/${docId}/ChangeRequest?changeRequestToken=${selectedDocument?.changeRequestToken}`
        )
        .then((response) => {
          setOpenDrawer(false);
          setListDocument(response?.data?.data);
          setDeletes(false);
          setFileDetails(false);
          setSelectedDocument("");
        });
    });
  };
  useEffect(() => {
    apiAuth
      .get(`/DocumentManager/SummaryDoclist/${assetEvaluationId}`)
      .then((Resp) => {
        setListDocument1(Resp?.data?.data);
      });
  }, []);

  const ListDoc1 = (id) => {
    apiAuth.get(`/DocumentManager/SummaryDoclist/${id}`).then((Resp) => {
      setListDocument1(Resp?.data?.data);
    });
  };
  const handleModalClose1 = () => {
    setOpen1(false);
    setOpenDrawer1(false);
    fileDetails(false)
    fileDetails1(false)
  };

  const handleOpen1 = () => {
    setOpen1(true);
    ListDoc1(assetEvaluationId);
  };

  const handelDetailDoc1 = (doc) => {
    setSelectedDocument1(doc);
    setFileDetails1(true);
    setDocumenDowToken1(doc.token);
  };

  const handleDownload1 = () => {
    apiAuth
      .get(`/DocumentManager/download/${documenDowToken1}`, {
        responseType: "blob",
      })
      .then((response) => {
        setFileDetails(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", selectedDocument1.name); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
  };

  return (
    <div className="w-full">
      {/* <ModalView open={open} 1={1} handleSubmit={handleSubmit} /> */}

      {/* ..................DocumentHistroy  start................... */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open1}
        onClose={handleModalClose1}
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
        <Fade in={open1}>
          <Box sx={style1}>
            <div className="flex justify-end mx-4 sm:mx-8" style={{ marginTop: "-32px", marginRight: "-29px", padding: "0 0 -24px " }} >
              <Button
                className=""
                variant="contained"
                style={{ backgroundColor: "white" }}
                onClick={handleModalClose1}
              >
                <FuseSvgIcon size={20}>
                  heroicons-outline:x
                </FuseSvgIcon>
              </Button>
            </div>
            <Box sx={{ flex: 1 }}>
              <Box className="flex justify-between" style={{ margin: "0", paddingTop: "0" }}>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  File Manager
                  <Typography id="transition-modal-subtitle" component="h2">
                    {listDocument1.length
                      ? listDocument1.length
                      : contentDetailsDocu?.documentCount}{" "}
                    Files
                  </Typography>
                </Typography>
                <Box></Box>
              </Box>
              <Box>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  className="d-flex flex-wrap p-6 md:p-8 md:py-6 min-h-[415px] max-h-120 space-y-8 overflow-y-auto custom_height"
                  component="div"
                  style={{
                    backgroundColor: "#e3eeff80",
                  }}
                >
                  {listDocument1.map((doc, index) => (
                    <div className="content " key={index}>
                      <div
                        onClick={() => handelDetailDoc1(doc)}
                        style={{ textAlign: "-webkit-center" }}
                      >
                        {doc.fileType === "JPG" ? (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        ) : doc.fileType === "JPG" ? (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        ) : (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        )}
                        <h6 className="truncate-text">{doc?.name}</h6>
                        <h6>by {doc?.staffName}</h6>
                      </div>
                    </div>
                  ))}
                </Typography>
              </Box>
            </Box>
            {openDrawer && !fileDetails && (
              <Box sx={drawerStyle(openDrawer)}>
                <div className="flex justify-end">
                  <Button
                    className=""
                    variant="contained"
                    style={{ backgroundColor: "white" }}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
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
                        backgroundColor: "#24a0ed",
                        borderRadius: "5px",
                        paddingLeft: "50px",
                        paddingRight: "50px",
                      }}
                      component="span"
                    >
                      <FuseSvgIcon size={20}>
                        heroicons-outline:plus
                      </FuseSvgIcon>
                      <span className="mx-4 sm:mx-8">Upload File</span>
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
                      label={<BoldLabel>Information</BoldLabel>}
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
                      value={selectedFile1.name}
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
                      label={<BoldLabel>Description</BoldLabel>}
                      name="description"
                      variant="standard"
                      onChange={handelFileDiscriptionChange1}
                      value={selectedFile1.descritpion}
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
                    onClick={handleSubmitAsset}
                  >
                    Submit
                  </Button>
                </div>
              </Box>
            )}

            {fileDetails1 && (
              <Box sx={drawerStyle(fileDetails1)}>
                <div className="flex justify-end">
                  <Button
                    className=""
                    variant="contained"
                    style={{ backgroundColor: "white" }}
                    onClick={() => setFileDetails1(false)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
                  </Button>
                </div>
                <div>&nbsp;</div>
                <div className="text-center">
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    // onChange={(e) => {
                    //   handelFileChange(e);
                    // }}
                    disabled
                  />
                  <label htmlFor="fileInput">
                    <div className=" ">
                      <div
                        // onClick={handelDetailDoc}
                        style={{
                          textAlign: "-webkit-center",
                        }}
                      >
                        <img src="/assets/images/etc/icon_N.png" />
                      </div>
                      {selectedDocument1?.name}
                    </div>
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
                      label={<BoldLabel>Information</BoldLabel>}
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
                      label="Created By"
                      variant="standard"
                      disabled
                      value={selectedDocument1.staffName}
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
                      label=" Created At"
                      name="description"
                      variant="standard"
                      disabled
                      value={new Date(
                        selectedDocument1.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
                      label={<BoldLabel>Description</BoldLabel>}
                      name="Description"
                      variant="standard"
                      disabled
                      value={
                        selectedDocument1?.description === null
                          ? ""
                          : selectedDocument1?.descritpion
                      }
                    />
                  </Box>
                </div>

                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{
                    marginTop: "15px",
                    justifyContent: "center",
                    backgroundColor: " rgba(248,250,252)",
                    padding: "10px",
                  }}
                >
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    type="submit"
                    onClick={handleDownload1}
                  >
                    Download
                  </Button>
                  {/* <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="primary"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid grey",
                    }}
                    onClick={(e) =>
                      handleDelete(
                        e,
                        selectedDocument?.documentId,
                        selectedDocument?.token
                      )
                    }
                  >
                    Delete
                  </Button> */}
                </div>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* ............................................ */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={deletes}
        onClose={handleCloseDelete}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={deletes}>
          <Box sx={style2}>
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
                onClick={handleCloseDelete}
              >
                Cancel
              </Button>
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                style={{
                  padding: "23px",
                  backgroundColor: "red",
                }}
                type="submit"
                onClick={handleSubmitDelete}
              >
                Confirm
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleModalClose}
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
        <Fade in={open}>
          <Box sx={style1}>
            <div className="flex justify-end mx-4 sm:mx-8" style={{ marginTop: "-32px", marginRight: "-32px", padding: "0 0 -24px " }} >
              <Button
                className=""
                variant="contained"
                style={{ backgroundColor: "white" }}
                onClick={handleModalClose}
              >
                <FuseSvgIcon size={20}>
                  heroicons-outline:x
                </FuseSvgIcon>
              </Button>
            </div>
            <Box sx={{ flex: 1 }}>
              <Box className="flex justify-between" style={{ margin: "0" }}>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "3rem",
                  }}
                >
                  File Manager
                  <Typography id="transition-modal-subtitle" component="h2">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.documentCount
                    }{" "}
                    Files
                  </Typography>
                </Typography>
                <Box>
                  {/* <Button
                    className=""
                    variant="contained"
                    color="secondary"
                    onClick={toggleDrawer(true)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                    <span className="mx-4 sm:mx-8">Upload File</span>
                  </Button> */}
                </Box>
              </Box>
              <Box>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  className="d-flex flex-wrap p-6 md:p-8 md:py-6 min-h-[415px] max-h-120 space-y-8 overflow-y-auto custom_height"
                  component="div"
                  style={{
                    backgroundColor: "#e3eeff80",
                  }}
                >
                  {listDocument.map((doc, index) => (
                    <div className="content " key={index}>
                      <div
                        onClick={() => handelDetailDoc(doc)}
                        style={{ textAlign: "-webkit-center" }}
                      >
                        {doc.fileType === "JPG" ? (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        ) : doc.fileType === "JPG" ? (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        ) : (
                          <img src="/assets/images/etc/icon_N.png" style={{}} />
                        )}
                        <h6 className="truncate-text">{doc?.name}</h6>
                        <h6>by {doc?.staffName}</h6>
                      </div>
                    </div>
                  ))}
                </Typography>
              </Box>
            </Box>
            {openDrawer && !fileDetails && (
              <Box sx={drawerStyle(openDrawer)}>
                <div className="flex justify-end">
                  <Button
                    className=""
                    variant="contained"
                    style={{ backgroundColor: "white" }}
                    onClick={() => setOpenDrawer(false)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
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
                        backgroundColor: "#24a0ed",
                        borderRadius: "5px",
                        paddingLeft: "50px",
                        paddingRight: "50px",
                      }}
                      component="span"
                    >
                      <FuseSvgIcon size={20}>
                        heroicons-outline:plus
                      </FuseSvgIcon>
                      <span className="mx-4 sm:mx-8">Upload File</span>
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
                      label={<BoldLabel>Information</BoldLabel>}
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
                      label={<BoldLabel>Description</BoldLabel>}
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
                    onClick={handleSubmitAsset}
                  >
                    Submit
                  </Button>
                </div>
              </Box>
            )}

            {fileDetails && (
              <Box sx={drawerStyle(fileDetails)}>
                <div className="flex justify-end">
                  <Button
                    className=""
                    variant="contained"
                    style={{ backgroundColor: "white" }}
                    onClick={() => setFileDetails(false)}
                  >
                    <FuseSvgIcon size={20}>heroicons-outline:x</FuseSvgIcon>
                  </Button>
                </div>
                <div>&nbsp;</div>
                <div className="text-center">
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    disabled
                  // onChange={(e) => {
                  //   handelFileChange(e);
                  // }}
                  />
                  <label htmlFor="fileInput">
                    <div className=" ">
                      <div
                        // onClick={handelDetailDoc}
                        style={{
                          textAlign: "-webkit-center",
                        }}
                      >
                        <img src="/assets/images/etc/icon_N.png" />
                      </div>
                      {selectedDocument?.name}
                    </div>
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
                      label={<BoldLabel>Information</BoldLabel>}
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
                      label="Created By"
                      variant="standard"
                      disabled
                      value={selectedDocument.staffName}
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
                      label=" Created At"
                      name="description"
                      variant="standard"
                      disabled
                      value={formatDate(selectedDocument.createdAt)}
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
                      label={<BoldLabel>Description</BoldLabel>}
                      name="Description"
                      variant="standard"
                      disabled
                      value={
                        selectedDocument?.description === null
                          ? ""
                          : selectedDocument?.descritpion
                      }
                    />
                  </Box>
                </div>

                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{
                    marginTop: "15px",
                    justifyContent: "center",
                    backgroundColor: " rgba(248,250,252)",
                    padding: "10px",
                  }}
                >
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    type="submit"
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                  {/* <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="primary"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid grey",
                    }}
                    onClick={(e) =>
                      handleDelete(
                        e,
                        selectedDocument?.documentId,
                        selectedDocument?.token
                      )
                    }
                  >
                    Delete
                  </Button> */}
                </div>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>

      <SwipeableViews>
        <Paper className="w-full mx-auto my-8 lg:mt-16  rounded-16 shadow overflow-hidden">
          <div>
            <div className="flex items-center w-full border-b justify-between p-30 pt-12 pb-12">
              <h2 className="text-2xl font-semibold">MOC Request</h2>
              <div>
                <StyledBadge
                  badgeContent={
                    listDocument1.length
                      ? listDocument1.length
                      : contentDetailsDocu?.documentCount
                  }
                >
                  <Button
                    className="whitespace-nowrap"
                    style={{
                      border: "1px solid",
                      backgroundColor: "transparent",
                      color: "black",
                      borderColor: "rgba(203,213,225)",
                    }}
                    variant="contained"
                    color="warning"
                    startIcon={
                      <FuseSvgIcon size={20}>
                        heroicons-solid:upload
                      </FuseSvgIcon>
                    }
                    onClick={handleOpen1}
                  >
                    Document History
                  </Button>
                </StyledBadge>
              </div>
            </div>
            <div className="p-30 pt-24 pb-24">
              <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Request No
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.requestNo
                    }
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">Date</div>
                  <div className="text-lg leading-6 font-medium">
                    {formatDate(
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.requestDate
                    )}
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">Initiator</div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.initiatorName
                    }
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Site In Charge
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.siteInChargeName
                    }
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">Site</div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.siteName
                    }
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">Division</div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.divisionName
                    }
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">Type</div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.typeString
                    }
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">Function</div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.functionName
                    }
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Project Value
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.projectValue
                    }
                  </div>
                </div>

                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Expense Type
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.expenseTypeString
                    }
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Expense Nature
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.expenseNatureString
                    }
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Purchase Category
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.purchaseCategoryString
                    }
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    {/* Doc Controller */}
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.docControllerName
                    }
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                {contentDetailsT && (
                  <>
                    <div className="my-3">
                      <div className="mt-3 leading-6 text-secondary">
                        Location of change
                      </div>
                      <div className="text-lg leading-6 font-medium">
                        {contentDetailsT?.changeLocationString}
                      </div>
                    </div>

                    <div className="my-3">
                      <div className="mt-3 leading-6 text-secondary">
                        Date of termination of change
                      </div>
                      <div className="text-lg leading-6 font-medium">
                        {formatDates(contentDetailsT?.changeTerminationDate)}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full">
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Project Name
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.projectName
                    }
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full">
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Project Description
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.projectDescription
                    }
                  </div>
                </div>
              </div>
              {contentDetailsT?.changeBenefits && (
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full">
                  <div className="my-3">
                    <div className="mt-3 leading-6 text-secondary">
                      Change Benefits
                    </div>
                    <div className="text-lg leading-6 font-medium">
                      {contentDetailsT?.changeBenefits}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {appActivity?.code == "START" && (
              <div className="flex items-center justify-between w-full p-30 pt-24 pb-24 border-t">
                <div>
                  <StyledBadge
                    badgeContent={
                      (contentDetails ? contentDetails : contentDetailsini)
                        ?.documentCount
                    }
                  >
                    <Button
                      className="whitespace-nowrap "
                      style={{
                        border: "1px solid",
                        backgroundColor: "transparent",
                        color: "black",
                        borderColor: "rgba(203,213,225)",
                      }}
                      variant="contained"
                      color="warning"
                      startIcon={
                        <FuseSvgIcon size={20}>
                          heroicons-solid:upload
                        </FuseSvgIcon>
                      }
                      onClick={handleOpen}
                    >
                      Document
                    </Button>
                  </StyledBadge>
                </div>
              </div>
            )}
          </div>
        </Paper>
      </SwipeableViews>
    </div>
  );
}

export default Initiation;
