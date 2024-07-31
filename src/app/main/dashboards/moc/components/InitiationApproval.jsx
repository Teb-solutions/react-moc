import { useState } from "react";
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
  FormControl,
  FormLabel,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { styled } from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import { withStyles } from "@mui/styles";
import { apiAuth } from "src/utils/http";
import { parseISO, format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import Initiation from "./Initiation";

function InitiationApproval(props) {
  const {
    ApprovalDetails,
    ApprovalManager,
    currentActivityForm,
    Actions,
    Activity,
    SubmitApprovelCreate,
    handleChangeRemark,
    valueRemark,
    assetEvaluationId,
    contentDetails,
    CountApprove,
  } = props;
  const [deletes, setDeletes] = useState(false);
  const [deletes1, setDeletes1] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [openDrawer1, setOpenDrawer1] = useState(false);
  const [open, setOpen] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [listDocument1, setListDocument1] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [fileDetails1, setFileDetails1] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocument1, setSelectedDocument1] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [documenDowToken1, setDocumenDowToken1] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
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
  const [selectedFile1, setSelectedFile1] = useState({
    name: "",
    description: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });
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
  const StyledBadge = withStyles((theme) => ({
    Badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);
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
  const BoldLabel = styled("label")({
    fontWeight: "bold",
    color: "black",
  });
  const handelFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setFileName(file.name);
    }
    setSelectedFile1({
      name: e.target.files[0].name,
      description: "",
      type: e.target.files[0].type,
      document: e.target.files[0],
      documentType: "ChangeRequest",
      documentId: selectedFile1.documentId,
      changeRequestToken: assetEvaluationId,
    });
  };

  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
  };
  const handleModalClose1 = () => {
    setOpen1(false);
    setOpenDrawer1(false);
  };
  const toggleDrawer = (open) => () => {
    setOpenDrawer1(open);
  };
  const ListDoc = (id) => {
    apiAuth.get(`/DocumentManager/SummaryDoclist/${id}`).then((Resp) => {
      setListDocument(Resp?.data?.data);
    });
  };

  const ListDoc1 = (id) => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${Activity.uid}/Approval?changeRequestToken=${id}`
      )
      .then((Resp) => {
        setListDocument1(Resp?.data?.data);
      });
  };

  const handleOpen = () => {
    setOpen(true);
    ListDoc(assetEvaluationId);
  };
  const handleOpen1 = () => {
    setOpen1(true);

    ListDoc1(assetEvaluationId);
  };
  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handelFileDiscriptionChange1 = (event) => {
    const { name, value } = event.target;
    setSelectedFile1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };
  const handelDetailDoc1 = (doc) => {
    setSelectedDocument1(doc);
    setFileDetails1(true);
    setDocumenDowToken1(doc.token);
  };

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

  const handleSubmitAsset = (e) => {
    const formData = new FormData();
    formData.append("name", selectedFile1.name);
    formData.append("descritpion", selectedFile1.description);
    formData.append("type", selectedFile1.type);
    formData.append("document", selectedFile1.document);
    formData.append("documentType", "Approval");
    formData.append("documentId", Activity.uid);
    formData.append("changeRequestToken", selectedFile1.changeRequestToken);
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
            `/DocumentManager/DocList/${Activity.uid}/Approval?changeRequestToken=${assetEvaluationId}`
          )
          .then((response) => {
            setOpenDrawer1(false);
            setListDocument1(response?.data?.data);
            setSelectedFile1("");
          });
      })
      .catch((error) => {
        console.error("There was an error uploading the document!", error);
      });
  };

  const handleCloseDelete1 = () => {
    setDeletes1(false);
  };
  const handleDelete1 = (e, id, token) => {
    e.preventDefault();
    setDocId(id);
    setDocToken(token);
    setDeletes1(true);
  };

  const handleSubmitDelete1 = () => {
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
          setOpenDrawer1(false);
          setListDocument1(response?.data?.data);
          setDeletes(false);
          setFileDetails1(false);
          setSelectedDocument1("");
        });
    });
  };

  return (
    <div className="w-full h-full">
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
        open={deletes1}
        onClose={handleCloseDelete1}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={deletes1}>
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
                onClick={handleCloseDelete1}
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
                onClick={handleSubmitDelete1}
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
            <Box sx={{ flex: 1 }}>
              <Box className="flex justify-between" style={{ margin: "30px" }}>
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
                    {ApprovalDetails.documentCount} Files
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
                        <h6>{doc?.name}</h6>
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
                    onChange={(e) => {
                      handelFileChange(e);
                    }}
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
                    justifyContent: "end",
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
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="primary"
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid grey",
                    }}
                    onClick={(e) =>
                      handleDelete1(
                        e,
                        selectedDocument?.documentId,
                        selectedDocument?.token
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>

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
            <Box sx={{ flex: 1 }}>
              <Box className="flex justify-between" style={{ margin: "30px" }}>
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
                    {listDocument1.length} Files
                  </Typography>
                </Typography>
                {currentActivityForm.canExecute && (
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
                      <span className="mx-4 sm:mx-8">Upload File</span>
                    </Button>
                  </Box>
                )}
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
                        <h6>{doc?.name}</h6>
                        <h6>by {doc?.staffName}</h6>
                      </div>
                    </div>
                  ))}
                </Typography>
              </Box>
            </Box>
            {openDrawer1 && !fileDetails1 && (
              <Box sx={drawerStyle(openDrawer1)}>
                <div className="flex justify-end">
                  <Button
                    className=""
                    variant="contained"
                    style={{ backgroundColor: "white" }}
                    onClick={() => setOpenDrawer1(false)}
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
                      handelFileChange1(e);
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
                      value={selectedFile1.description}
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
                    onChange={(e) => {
                      handelFileChange1(e);
                    }}
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
                      value={selectedDocument1?.staffName}
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
                      value={formatDate(selectedDocument1?.createdAt)}
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
                    justifyContent: "end",
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
                  <Button
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
                        selectedDocument1?.documentId,
                        selectedDocument1?.token
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
      <Initiation
        contentDetails={contentDetails}
        assetEvaluationId={assetEvaluationId}
      />
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow overflow-hidden">
          <div>
            <div className="flex items-center w-full border-b justify-between p-30 pt-24 pb-24">
              <h2 className="text-2xl font-semibold">Summary Details</h2>
              <div>
                <StyledBadge badgeContent={ApprovalDetails.documentCount}>
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
                    onClick={handleOpen}
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
                    {ApprovalDetails?.requestNo}
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">Initiator</div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.initiatorName}
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Initiated On
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {new Date(ApprovalDetails?.requestDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">Type</div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.requestTypeName}
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Expense Nature
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.expenseNature}
                  </div>
                </div>
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Expense Type
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.expenseType}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full">
                <div className="my-3">
                  <div className="mt-3 leading-6 text-secondary">
                    Project Description
                  </div>
                  <div className="text-lg leading-6 font-medium">
                    {ApprovalDetails?.projectDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </SwipeableViews>
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
          <div className="flex items-center w-full border-b p-30 pt-24 pb-24 justify-between">
            <h2 className="text-2xl font-semibold">Approval</h2>
          </div>

          {Activity.isComplete && Activity.status !== "Pending" ? (
            <>
              <div
                className="inventory-grid grid items-center gap-4 p-30 pt-24 pb-24"
                style={{ width: "40%" }}
              >
                <span className="font-semibold leading-none">
                  Approver Comment: {ApprovalManager?.remark}
                </span>
              </div>
              <div className="flex items-center justify-between w-full mt-8 p-30 pt-24 pb-24 border-t">
                <StyledBadge
                  badgeContent={
                    listDocument1.length ? listDocument1.length : CountApprove
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
                    Document
                  </Button>
                </StyledBadge>
              </div>
            </>
          ) : (
            <div
              className="inventory-grid grid items-center gap-4 "
              style={{ width: "100%" }}
            >
              {currentActivityForm.canEdit && (
                <Box
                  sx={{ display: "flex", flexWrap: "wrap" }}
                  className="p-30 pt-24 pb-24"
                >
                  <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                    <FormLabel
                      htmlFor="reasonForNewDocument"
                      className="font-semibold leading-none"
                    >
                      Comment
                    </FormLabel>
                    <OutlinedInput
                      id="reasonForNewDocument"
                      name="reasonForNewDocument"
                      onChange={handleChangeRemark}
                      label="Reason For Change*"
                      className="mt-5"
                      value={valueRemark}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#f0f0f0",
                          "& fieldset": {
                            borderColor: "#ccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#333",
                          },
                        },
                      }}
                    />
                  </FormControl>
                </Box>
              )}

              <div className="flex items-center w-full border-b justify-between"></div>

              {currentActivityForm.canExecute && (
                <div className="flex justify-end p-30 pt-24 pb-24">
                  <StyledBadge
                    badgeContent={
                      listDocument1.length ? listDocument1.length : CountApprove
                    }
                  >
                    <Button
                      className="whitespace-nowrap my-1"
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
                      Document
                    </Button>
                  </StyledBadge>
                  {Actions.map((btn) => (
                    <Button
                      key={btn.uid}
                      className="whitespace-nowrap ms-5 my-1"
                      variant="contained"
                      color="secondary"
                      // style={{ marginTop: "10px" }}
                      onClick={(e) =>
                        SubmitApprovelCreate(e, btn.uid, btn.name, btn.type)
                      }
                    >
                      {btn.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Paper>
      </SwipeableViews>
    </div>
  );
}

export default InitiationApproval;
