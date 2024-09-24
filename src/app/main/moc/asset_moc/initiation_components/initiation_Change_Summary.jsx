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
import { parseISO, format } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import FuseLoading from "@fuse/core/FuseLoading";
import Initiation from "../../common_components/Initiation";
import DocumentModal from "../../common_modal/documentModal";
import DeleteModal from "../../common_modal/delete_modal/DeleteModal";

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
  contentDetailsT,
}) => {
  const StyledBadge = withStyles((theme) => ({
    badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);

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
  const styleClass = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "45%",
    maxWidth: "90vw",
    height: "30%",
    maxHeight: "90vh",
    borderRadius: "16px",
    bgcolor: "background.paper",
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
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

    setErrors((prevErrors) => ({
      ...prevErrors,
      TerminationDate: "",
    }));
  };

  const handleClassChange = (event) => {
    const selectedValue = event.target.value;
    setIniComp({
      ...IniComp,
      classCategory: event.target.value,
    });
    setSelectedClass(selectedValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      classCategory: "",
    }));
    if (selectedValue == 1) {
      getRecords(1);
    } else if (selectedValue == 2) {
      getRecords(2);
    }
  };
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    let errors = {};

    // Validation checks
    if (!formData.classCategory)
      errors.classCategory = "Class Category is required";
    if (!formData.changeLeaderId)
      errors.changeLeaderId = "Change Leader is required";
    if (!formData.changeLocation)
      errors.changeLocation = "Change Location is required";
    if (!formData.changeType) errors.changeType = "Change Type is required";
    if (!formData.TerminationDate)
      errors.TerminationDate = "Expected Change Completion Date is required";
    if (!formData.briefDescription)
      errors.briefDescription = "Brief Description is required";
    if (!formData.changeBenefits)
      errors.changeBenefits = "Change Benefits are required";

    return errors;
  };

  const handleOpen = (btn) => {
    const formErrors = validateForm(IniComp);

    // If there are errors, set them and stop form submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }
    setOpen(true);
    setIniComp((prevState) => ({
      ...prevState,
      actionUID: btn.uid,
      executeActivity: {
        actionUID: btn.uid,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Call the validation function and pass the form data (IniComp)

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

        setTimeout(
          () =>
            apiAuth
              .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
              .then((resp) => {
                setContent(resp.data.data.phases);
              }),
          1000
        );
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
  const [openClass, setOpenClass] = useState(false);
  const [classType, setClassType] = useState("");

  const handleOpenClass = (type) => {
    setClassType(type);
    setOpenClass(true);
  };

  const handleCloseClass = () => {
    setOpenClass(false);
  };
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
    setFileDetails(false);
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
    setSelectedFile({
      ...selectedFile,
      [name]: value,
    });
  };
  const handelFileChange = (e) => {
    const file = e.target.files[0];

    const fileType = e.target.files[0].type.startsWith("image/")
      ? e.target.files[0].type?.split("/")[1]
      : e.target.files[0].type;

    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");

    setSelectedFile({
      ...selectedFile,
      name: fileNameWithoutExtension,

      type: fileType,
      document: e.target.files[0],
      documentType: "ChangeSummary",
      documentId: currentActivityForm.uid,
      changeRequestToken: assetEvaluationId,
    });
  };

  const handleSubmitAsset = (e) => {
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("descritpion", selectedFile.descritpion);
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
                descritpion: "",
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
          `/DocumentManager/DocList/${currentActivityForm.uid}/ChangeSummary?changeRequestToken=${assetEvaluationId}`
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
      <ToastContainer
        className="toast-container"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openClass}
        onClose={handleCloseClass}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openClass}>
          <Box sx={styleClass}>
            <Box
              style={{
                padding: "20px",
                backgroundColor: "#4f46e5",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            >
              <div className="flex justify-between text-white">
                <span className="text-popup font-medium">Class Category</span>
                <span onClick={handleCloseClass} style={{ cursor: "pointer" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    height="24"
                    width="24"
                    preserveAspectRatio="xMidYMid meet"
                    focusable="false"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </span>
              </div>
            </Box>

            {/* Conditionally render the table for classType 'class1' */}
            {classType === "class1" && (
              <div
                className="flex flex-auto overflow-hidden"
                style={{
                  height: "100%",
                  borderBottomLeftRadius: "16px",
                  borderBottomRightRadius: "16px",
                }}
              >
                <table style={{ width: "100%", height: "100%" }}>
                  <thead>
                    <tr
                      style={{ backgroundColor: "#ffc800", fontWeight: "bold" }}
                    >
                      <td></td>
                      <td></td>
                      <td>LPG + LUBES</td>
                      <td>HSE</td>
                      <td>LPG</td>
                      <td>LUBES</td>
                      <td>Corp HSE</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ backgroundColor: "#ffebcb" }}>
                      <td></td>
                      <td></td>
                      <td>Site</td>
                      <td>Site</td>
                      <td>DIV Project</td>
                      <td>DIV Project</td>
                      <td></td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f0e4" }}>
                      <td className="p-10">Class II</td>
                      <td>Low Risk +</td>
                      <td>X</td>
                      <td>X</td>
                      <td colSpan="2"></td>
                      <td>X</td>
                    </tr>
                    <tr style={{ backgroundColor: "#ffebcb" }}>
                      <td rowSpan="2" className="p-10">
                        Class I
                      </td>
                      <td>Medium Risk</td>
                      <td></td>
                      <td></td>
                      <td>X</td>
                      <td>X</td>
                      <td>X</td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f0e4" }}>
                      <td>High Risk</td>
                      <td></td>
                      <td></td>
                      <td>X</td>
                      <td>X</td>
                      <td>X</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Conditionally render the table for classType 'class2' */}
            {classType === "class2" && (
              <div
                className="flex flex-auto overflow-hidden"
                style={{
                  height: "100%",
                  borderBottomLeftRadius: "16px",
                  borderBottomRightRadius: "16px",
                }}
              >
                <table style={{ width: "100%", height: "100%" }}>
                  <thead>
                    <tr
                      style={{ backgroundColor: "#ffc800", fontWeight: "bold" }}
                    >
                      <td></td>
                      <td colSpan="2">PROJECT I/C / Change</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ backgroundColor: "#ffebcb" }}>
                      <td></td>
                      <td>LPG DIV</td>
                      <td>LUBES DIV</td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f0e4" }}>
                      <td rowSpan="4" className="p-10">
                        Operations & LOG
                      </td>
                      <td>Sakthivel</td>
                      <td>Reginald</td>
                    </tr>
                    <tr style={{ backgroundColor: "#ffebcb" }}>
                      <td>Venkat</td>
                      <td>Nikhil</td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f0e4" }}>
                      <td>Rajesh C</td>
                      <td></td>
                    </tr>
                    <tr style={{ backgroundColor: "#ffebcb" }}>
                      <td>Umashankar</td>
                      <td></td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8f0e4" }}>
                      <td rowSpan="2" className="p-10">
                        S & M
                      </td>
                      <td>Manjunath</td>
                      <td>Digant</td>
                    </tr>
                    <tr style={{ backgroundColor: "#ffebcb" }}>
                      <td>Thiyagarajan</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
      <DeleteModal
        openDelete={deletes}
        handleCloseDelete={handleCloseDelete}
        title=""
      >
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
            style={{ padding: "23px", backgroundColor: "red" }}
            type="submit"
            onClick={handleSubmitDelete}
          >
            Confirm
          </Button>
        </div>
      </DeleteModal>

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
                  padding: "23px",
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
                style={{
                  padding: "23px",
                  backgroundColor: "red",
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <DocumentModal
        open={open1}
        step={1}
        handleModalClose={handleModalClose}
        selectedDocument={selectedDocument}
        toggleDrawer={toggleDrawer}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
        selectedFile={selectedFile}
        handelFileChange={handelFileChange}
        listDocument={listDocument}
        handelDetailDoc={handelDetailDoc}
        handelFileDiscriptionChange={handelFileDiscriptionChange}
        handleSubmitDocument={handleSubmitAsset}
        handleDownload={handleDownload}
        canExecute={currentActivityForm.canExecute}
        formatDate={formatDate}
        handleDelete={handleDelete}
      />

      <Initiation
        contentDetails={contentDetails}
        assetEvaluationId={assetEvaluationId}
        contentDetailsT={contentDetailsT}
        contentDetailsDocu={contentDetails}
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
                      <Link
                        className="inline-flex ml-3 leading-6 text-primary hover:underline cursor-pointer text-blue"
                        onClick={() => handleOpenClass("class1")}
                      >
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
                    {errors.classCategory && (
                      <span className="error-text">{errors.classCategory}</span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Link
                    className="inline-flex ml-3 leading-6 text-primary hover:underline cursor-pointer text-blue"
                    onClick={() => handleOpenClass("class2")}
                  >
                    View Class I Category Details
                  </Link>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Change Leader *</FormLabel>
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
                    {errors.changeLeaderId && (
                      <span className="error-text">
                        {errors.changeLeaderId}
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>
                      Change Location * (you can add multiple locations)
                    </FormLabel>
                    <OutlinedInput
                      name="changeLocation"
                      value={IniComp?.changeLocation}
                      onChange={handleChange}
                    />
                    {errors.changeLocation && (
                      <span className="error-text">
                        {errors.changeLocation}
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormLabel>Change Type *</FormLabel>
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
                    {errors.changeType && (
                      <span className="error-text">{errors.changeType}</span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Expected Change Completion Date *</FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={IniComp?.TerminationDate}
                        onChange={handleChanges}
                        renderInput={(params) => (
                          <TextField fullWidth {...params} />
                        )}
                      />
                    </LocalizationProvider>
                    {errors.TerminationDate && (
                      <span className="error-text">
                        {errors.TerminationDate}
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Brief Description *</FormLabel>
                    <OutlinedInput
                      name="briefDescription"
                      value={IniComp?.briefDescription}
                      onChange={handleChange}
                    />
                    {errors.briefDescription && (
                      <span className="error-text">
                        {errors.briefDescription}
                      </span>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>Change Benefits *</FormLabel>
                    <OutlinedInput
                      name="changeBenefits"
                      value={IniComp?.changeBenefits}
                      onChange={handleChange}
                    />
                    {errors.changeBenefits && (
                      <span className="error-text">
                        {errors.changeBenefits}
                      </span>
                    )}
                  </FormControl>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <FormLabel>
                      Class Category{" "}
                      <Link
                        className="inline-flex ml-3 leading-6 text-primary hover:underline cursor-pointer text-blue"
                        onClick={() => handleOpenClass("class1")}
                      >
                        (View Class Category Details)
                      </Link>
                    </FormLabel>
                    <span>{currentSummeryById?.classCategoryString}</span>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <FormLabel>
                      Change Leader{" "}
                      <Link
                        className="inline-flex ml-3 leading-6 text-primary hover:underline cursor-pointer text-blue"
                        onClick={() => handleOpenClass("class2")}
                      >
                        View Class I Category Details
                      </Link>
                    </FormLabel>
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
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
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
