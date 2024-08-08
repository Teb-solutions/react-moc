import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";
import SwipeableViews from "react-swipeable-views";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Badge,
  FormControlLabel,
  Radio,
  Link,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { apiAuth } from "src/utils/http";
import { makeStyles } from "@mui/styles";
import { withStyles } from "@mui/styles";
import { toast, ToastContainer } from "react-toastify";
import FuseLoading from "@fuse/core/FuseLoading";
import Initiation from "./Initiation";

const InitiationComplete = ({
  assetEvaluationId,
  AppActions,
  AppActivity,
  AssetDetails,
  currentActivityForm,
  currentSummeryById,
  setContent,
  contentDetails,
  CountApprove,
}) => {
  const StyledBadge = withStyles((theme) => ({
    badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);
  console.log(currentActivityForm, "8888", currentSummeryById);
  const [deletes, setDeletes] = useState(false);
  const [class1, setClass1] = useState([]);
  const [selectedClass, setSelectedClass] = useState(1);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "615px",
    maxWidth: "80vw",
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
  const handleClose = () => setOpen(false);

  const handleOpen = (btn) => {
    setOpen(true);
    setIniComp((prevState) => ({
      ...prevState,
      actionUID: btn.uid,
      executeActivity: {
        actionUID: btn.uid,
      },
    }));
  };

  const [IniComp, setIniComp] = useState({
    classCategory: "1",
    changeLeaderId: "",
    changeLocation: "",
    changeType: "",
    TerminationDate: new Date(),
    changeTerminationDate: new Date(),
    briefDescription: "",
    changeBenefits: "",
    documentType: "Activity",

    actionUID: "",
    formUID: "",
    token: AssetDetails.token,
  });

  console.log(IniComp, "IniComp");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIniComp((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getRecords = async (classType) => {
    try {
      const response = await apiAuth.get(
        `/ChangeSummary/changeleaders/lov/${assetEvaluationId}/${classType}`
      );
      setClass1(response.data?.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    getRecords(1);
  }, []);

  const handleChanges = (date) => {
    setIniComp({
      ...IniComp,
      TerminationDate: date,
      changeTerminationDate: date,
    });
  };

  const handleClassChange = (event) => {
    const selectedValue = event.target.value;
    setIniComp({
      ...IniComp,
      classCategory: event.target.value,
    });
    setSelectedClass(selectedValue);

    if (selectedValue == 1) {
      getRecords(1);
    } else if (selectedValue == 2) {
      getRecords(2);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const TermDate = new Date(IniComp.TerminationDate);
    const ChangeTermDate = new Date(IniComp.TerminationDate);

    let formattedTermDate = null;
    let formattedChangeTermDate = null;

    if (TermDate != "Invalid Date" && ChangeTermDate != "Invalid Date") {
      formattedTermDate = TermDate.toISOString();
      formattedChangeTermDate = ChangeTermDate.toISOString();
    }

    const formattedDocumentState = {
      ...IniComp,
      formattedTermDate: formattedTermDate,
      changeTerminationDate: formattedChangeTermDate,
      documentId: AppActivity.uid,
      documentStatus: AppActivity.form,
      activityUID: AppActivity.uid,
      token: assetEvaluationId,
      executeActivity: {
        actionUID: AppActions[0].uid,
        activityUID: AppActivity.uid,
      },
    };
    apiAuth
      .post("/ChangeSummary/Create", formattedDocumentState)
      .then((response) => {
        setIsLoading(false);

        toast?.success("Successfully Created");
        setOpen(false);
        apiAuth
          .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
          .then((resp) => {
            setContent(resp.data.data.phases);
          });
      })
      .catch((error) => {
        setIsLoading(false);

        toast?.error("Some error occured");
      });
  };
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [listDocument, setListDocument] = useState([]);
  const [selectedFile, setSelectedFile] = useState({
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

  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };

  const handleModalClose = () => {
    setOpen1(false);
    setOpenDrawer(false);
  };
  const ListDoc1 = (id, activeid) => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${id}/ChangeSummary?changeRequestToken=${activeid}`
      )
      .then((response) => {
        setListDocument(response?.data?.data);
      });
  };
  const handleOpen1 = (id) => {
    setOpen1(true);
    ListDoc1(id, assetEvaluationId);
    // ListDoc(assetEvaluationId, AssetDetails?.changeRequestId);
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
  const handelFileChange = (e) => {
    const file = e.target.files[0];

    setSelectedFile({
      name: e.target.files[0].name,
      description: "",
      type: e.target.files[0].type,
      document: e.target.files[0],
      documentType: "ChangeSummary",
      documentId: currentActivityForm.uid,
      changeRequestToken: assetEvaluationId,
    });
  };

  const handleSubmitAsset = (e) => {
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("description", selectedFile.description);
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
        if (response.data.statusCode === 200) {
          apiAuth
            .get(
              `/DocumentManager/DocList/${currentActivityForm.uid}/ChangeSummary?changeRequestToken=${assetEvaluationId}`
            )
            .then((response) => {
              setOpenDrawer(false);
              setListDocument(response?.data?.data);
              setSelectedFile({
                ...selectedFile,
                name: "",
                description: "",
              });
            });
        } else {
          toast.error(response.data.message);
          setOpen1(false);
          setOpenDrawer(false);
          setSelectedFile({
            ...selectedFile,
            name: "",
            description: "",
          });
        }
      })
      .catch((error) => {
        console.error("There was an error uploading the document!", error);
        if (error.errorsData) {
          if (error.errorsData.Name && error.errorsData.Name.length) {
            toast.error(error.errorsData.Name[0]);
            cli;
            setSelectedFile({
              ...selectedFile,
              name: "",
              description: "",
            });
          } else {
            toast.error("There was an error uploading the document!");
          }
        } else {
          toast.error("There was an error uploading the document!");
        }
        setOpen1(false);
        setOpenDocModal(false);
        setOpenDrawer(false);
        setSelectedFile({
          ...selectedFile,
          name: "",
          description: "",
        });
      });
  };

  if (isLoading) {
    return <FuseLoading />;
  }

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

  return (
    <div className="w-full">
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
            <Box mb={2}>
              <div className="flex">
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "15px",
                    marginRight: "5px",
                    marginTop: "5px",
                    color: "red",
                  }}
                >
                  <img src="/assets/images/etc/icon.png" alt="Icon" />
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "2rem",
                  }}
                >
                  Submit request
                  <Typography
                    variant="h6"
                    component="h2"
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "grey",
                    }}
                  >
                    Once submitted you will not be able to revert! Are you sure
                    you want to continue?
                  </Typography>
                </Typography>
              </div>
            </Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
                style={{
                  padding: "10px 20px",
                  marginRight: "10px",
                  borderColor: "grey",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                style={{ padding: "10px 20px" }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open1}
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
                    {listDocument?.length} Files
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
                  {listDocument.map((doc, index) => (
                    <div className="content " key={index}>
                      <div
                        onClick={() => handelDetailDoc(doc)}
                        style={{ textAlign: "-webkit-center" }}
                      >
                        <img src="/assets/images/etc/icon_N.png" style={{}} />
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
                    onChange={(e) => {
                      handelFileChange(e);
                    }}
                  />
                  <label htmlFor="fileInput">
                    <div className=" ">
                      <div
                        onClick={handelDetailDoc}
                        style={{ textAlign: "-webkit-center" }}
                      >
                        <img src="/assets/images/etc/icon_N.png" />
                      </div>
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
                      value={new Date(
                        selectedDocument.createdAt
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
                        selectedDocument?.descritpion === null
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
                    justifyContent: currentActivityForm.canExecute
                      ? "center"
                      : "end",
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
                  {currentActivityForm.canExecute && (
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
                          selectedDocument?.documentId,
                          selectedDocument?.token
                        )
                      }
                    >
                      Delete
                    </Button>
                  )}
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

      <SwipeableViews>
        <Paper className="w-full mx-auto rounded-16 shadow overflow-hidden lg:mt-16">
          <Typography
            variant="h4"
            component="h2"
            className="p-30 pt-24 pb-24 border-b"
            gutterBottom
          >
            <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
              Change Summary
            </h2>
          </Typography>
          <Grid className="p-30 pt-24 pb-24 border-b" container spacing={2}>
            {currentActivityForm.canEdit ? (
              <>
                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">
                      Class Category
                      <Link className="inline-flex ml-3 leading-6 text-primary hover:underline cursor-pointer text-blue">
                        (View Class Category Details)
                      </Link>
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="classCategory"
                      name="classCategory"
                      value={selectedClass}
                      onChange={handleClassChange}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Class I"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Class II"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Change Leader</FormLabel>
                    <Select
                      name="changeLeaderId"
                      value={IniComp?.changeLeaderId}
                      onChange={handleChange}
                    >
                      {class1.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>
                      Change Location (you can add multiple locations)
                    </FormLabel>
                    <OutlinedInput
                      name="changeLocation"
                      value={IniComp?.changeLocation}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormLabel>Change Type</FormLabel>
                    <RadioGroup
                      row
                      name="changeType"
                      value={IniComp?.changeType}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Permanent"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="Temporary"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Expected Change Completion Date</FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={IniComp?.TerminationDate}
                        onChange={handleChanges}
                        renderInput={(params) => (
                          <TextField fullWidth {...params} />
                        )}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Brief Description</FormLabel>
                    <OutlinedInput
                      name="briefDescription"
                      value={IniComp?.briefDescription}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Change Benefits</FormLabel>
                    <OutlinedInput
                      name="changeBenefits"
                      value={IniComp?.changeBenefits}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <FormLabel>Class Category</FormLabel>
                    <span>{currentSummeryById?.classCategoryString}</span>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <FormLabel>Change Leader</FormLabel>
                    <span>{currentSummeryById?.changeLeader}</span>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <FormLabel>Change Location</FormLabel>
                    <span>{currentSummeryById?.changeLocation}</span>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <FormLabel>Change Type</FormLabel>
                    <span>{currentSummeryById?.changeTypeString}</span>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <FormLabel>Expected Change Completion Date</FormLabel>
                    <span>
                      {new Date(
                        currentSummeryById?.changeTerminationDate
                      ).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <FormLabel>Brief Description</FormLabel>
                    <span>{currentSummeryById?.briefDescription}</span>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Change Benefits</FormLabel>
                    <span>{currentSummeryById?.changeBenefits}</span>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>

          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            className=" p-24 pt-10"
          >
            <StyledBadge
              badgeContent={
                listDocument.length ? listDocument.length : CountApprove
              }
            >
              <Button
                variant="outlined"
                style={{
                  padding: "10px 20px",
                  borderColor: "grey",
                }}
                startIcon={
                  <FuseSvgIcon size={20}>heroicons-solid:upload</FuseSvgIcon>
                }
                onClick={() =>
                  handleOpen1(
                    currentActivityForm.canEdit
                      ? currentActivityForm.uid
                      : currentSummeryById.id
                  )
                }
              >
                Document
              </Button>
            </StyledBadge>
            {currentActivityForm.canExecute && (
              <Box display="flex" gap={2}>
                {AppActions.map((btn) => (
                  <Button
                    key={btn.uid}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpen(btn)}
                  >
                    {btn.name}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        </Paper>
      </SwipeableViews>
    </div>
  );
};

export default InitiationComplete;
