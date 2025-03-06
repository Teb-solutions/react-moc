import { useEffect } from "react";
// import MainComponent from "../common_components/mainContent.jsx/index.js";
import {
  Backdrop,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Fade,
  Button,
  FormControl,
  FormLabel,
  InputAdornment,
  OutlinedInput,
  Paper,
  Badge,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SwipeableViews from "react-swipeable-views";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { parseISO, format } from "date-fns";
import { apiAuth } from "src/utils/http.js";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon.jsx";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Initiation from "../../common_components/Initiation";
import { withStyles } from "@mui/styles";
import DocumentModal from "../../common_modal/documentModal";
import DeleteModal from "../../common_modal/delete_modal/DeleteModal";
import { ImplementationTaskListView } from "./ImplementationTaskListView";

const ImplementationApprovalSite = ({
  contentDetails,
  currentActivityForm,
  assetEvaluationId,
  lastActCode,
  AppActions,
  AppActivity,
  ApprovalManager,
  setContent,
  setContentDetails,
  contentDetailsini,
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
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [reviewed, setReviewed] = useState({});
  const [valueRemark, setValueRemark] = useState("");
  const [showReview, setshowReview] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [deletes, setDeletes] = useState(false);
  const [handelCommentRemark, setHandelCommentRemark] = useState("");
  const [docId, setDocId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [docToken, setDocToken] = useState("");
  const handleExpansionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeRemark = (event) => {
    setValueRemark(event.target.value);
    if (event.target.value.trim() !== "") {
      setErrorMessage(""); // Clear error message on input change
    }
  };

  function getRecords() {
    apiAuth
      .get(
        `/SummaryDetails/List?id=${assetEvaluationId}&&code=${lastActCode.code}&&version=${lastActCode.version}&&refVersion=${lastActCode.refVersion}`
      )
      .then((resp) => {
        setContentDetails(resp.data.data);
        setExpanded(false);
      });
  }

  const hasAddedComment = (comments) => {
    return comments.some((comment) => comment.isCreatedByMe);
  };

  const isMyComment = (comment) => {
    return comment.isCreatedByMe;
  };

  const formatDatess = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };
  const [clickedTasks, setClickedTasks] = useState({});
  const handelImpactreview = (id) => {
    apiAuth
      .put(`/SummaryDetails/ImpReviewStatus/${assetEvaluationId}`, {
        isActive: true,
        task: [id],
        activityCode: lastActCode.code,
      })
      .then((response) => {
        toast?.success("Successfully marked the item as reviewed");
        setReviewed((prevReviewed) => ({
          ...prevReviewed,
          [id]: true,
        }));
        setClickedTasks((prevClickedTasks) => ({
          ...prevClickedTasks,
          [id]: true,
        }));

      });
  };
  const handelCommentImp = (id, value) => {
    const remark = handelCommentRemark[id];
    if (value == 1) {
      apiAuth
        .put(`/Task/ImpAddReview/${id}/${lastActCode.code}`, {
          remark: remark,
        })
        .then((resp) => {
          // setshowReview(true);
          getRecords();
          toast?.success("Review successfully added");

          setHandelCommentRemark("");
        });
    } else {
      apiAuth
        .put(`/Task/ImpAddReview/${id}/${lastActCode.code}`, {
          remark: remark,
        })
        .then((resp) => {
          // setshowReview(true);
          toast?.success("Review successfully Updated");
          getRecords();

          setHandelCommentRemark("");
        });
    }
  };
  const setHandelCommentRemarks = (id, value) => {
    setHandelCommentRemark((prevRemarks) => ({
      ...prevRemarks,
      [id]: value,
    }));
  };

  const SubmitApprovelCreate = (e, uid, name, type) => {
    if (valueRemark.trim() === "") {
      setErrorMessage("Comments are required.");
      return;
    }
    setErrorMessage("");
    apiAuth
      .post(`/ApprovalManager/Create/${assetEvaluationId}`, {
        actionUID: uid,
        actionUid: uid,
        formUID: AppActivity.formUID,
        actionName: name,
        actionType: type,
        activityCode: AppActivity.code,
        activityId: AppActivity.uid,
        consultaioncomment: "",
        formType: AppActivity.form,
        remark: valueRemark,
        taskscomment: "",
        version: AppActivity.version,
      })
      .then((resp) => {
        if (resp.data.statusCode != 400) {
          apiAuth
            .get(`/Activity/RequestLifecycle/${assetEvaluationId}`)
            .then((resp) => {
              setContent(resp.data.data.phases);
            });
          setValueRemark("");
        } else {
          toast?.error(resp.data.message);
        }
      })
      .catch((error) => { });
  };
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");

  const [selectedFile, setSelectedFile] = useState({
    name: "",

    descritpion: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });

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
  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
    setFileDetails(false);
    setErrors({})
    setSelectedFile({
      ...selectedFile,
      name: "",
      descritpion: "",
    })
  };
  const ListDoc = (id, activeid) => {
    apiAuth
      .get(
        `/DocumentManager/DocList/${id}/Approval?changeRequestToken=${activeid}`
      )
      .then((response) => {
        setListDocument(response?.data?.data);
      });
  };
  const handleOpen = (id) => {
    setOpen(true);
    ListDoc(id, assetEvaluationId);
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const handelFileChange = (e) => {
    setErrors({
      ...errors,
      name: "",
    });
    const file = e.target.files[0];

    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");
    const fileType = e.target.files[0].type.startsWith("image/")
      ? e.target.files[0].type?.split("/")[1]
      : e.target.files[0].type;

    setSelectedFile({
      ...selectedFile,
      name: fileNameWithoutExtension,

      type: fileType,
      document: e.target.files[0],
      documentType: " Approval",
      documentId: AppActivity.uid,
      changeRequestToken: assetEvaluationId,
    });
  };
  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };

  const validateForm = () => {
    let tempErrorsDoc = {};
    if (!selectedFile.name)
      tempErrorsDoc.name = "File is required";

    if (!selectedFile.descritpion)
      tempErrorsDoc.descritpion = "Description is required";

    setErrors(tempErrorsDoc);
    return Object.keys(tempErrorsDoc).length === 0;
  };

  const handleSubmitAsset = (e) => {
    if (!validateForm()) {
      return;
    }

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
              `/DocumentManager/DocList/${AppActivity.uid}/Approval?changeRequestToken=${assetEvaluationId}`
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
          setOpen(false);
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
          } else {
            toast.error("There was an error uploading the document!");
          }
        } else {
          toast.error("There was an error uploading the document!");
        }
        setOpen(false);
        setOpenDrawer(false);
        setSelectedFile({
          ...selectedFile,
          name: "",
          description: "",
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
          `/DocumentManager/DocList/${docId}/Approval?changeRequestToken=${assetEvaluationId}`
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
      <Initiation
        contentDetailsini={contentDetailsini}
        contentDetailsT={contentDetails}
        assetEvaluationId={assetEvaluationId}
        contentDetailsDocu={contentDetails}
      />
      {/* <MainComponent
        contentDetails={contentDetails}
        assetEvaluationId={assetEvaluationId}
      /> */}
      <SwipeableViews>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full border-b p-30 pt-24 pb-24 justify-between"
          >
            <h2 className="text-2xl font-semibold">Implementation Tasks</h2>
            <TextField
              variant="filled"
              fullWidth
              placeholder="Search"
              style={{ marginBottom: "0" }}
              //   value={searchTerm}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ marginTop: "0px" }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 320 }}
            />
          </div>
          <div className="p-30 pt-24 pb-24">
            <ImplementationTaskListView
            handelCommentImp={handelCommentImp}
             handelImpactreview={handelImpactreview}
             isMyComment={isMyComment}
            hasAddedComment={hasAddedComment}
            reviewed={reviewed}
            setReviewed={setReviewed}
            setClickedTasks={setClickedTasks}
            clickedTasks={clickedTasks}
            assetEvaluationId={assetEvaluationId} 
            setHandelCommentRemarks={setHandelCommentRemarks}
             handelCommentRemark={handelCommentRemark} 
             handleExpansionChange={handleExpansionChange}
             expanded={expanded}
             AppActivity={AppActivity} 
             showReview={showReview} 
             currentActivityForm={currentActivityForm} 
             implementationTask={contentDetails?.implementationTask} />
            
          </div>
        </Paper>
      </SwipeableViews>
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
          <div className="flex items-center w-full border-b p-30 pt-24 pb-24 justify-between">
            <h2 className="text-2xl font-semibold">Approval</h2>
          </div>
          <div>
            {AppActivity.isComplete && AppActivity.status !== "Pending" ? (
              <div className="p-30 pt-24 pb-24">
                <div
                  className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
                  style={{ width: "40%" }}
                >
                  <span className="leading-none">
                    <b>Approver Comment:</b> {ApprovalManager?.remark}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="inventory-grid grid items-center gap-4 "
                style={{ width: "100%" }}
              >
                <div className="p-30 pt-24 pb-24 w-full border-b">
                  {currentActivityForm.canEdit && (
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      <FormControl fullWidth sx={{ m: 1, maxWidth: "100%" }}>
                        <FormLabel
                          htmlFor="reasonForNewDocument"
                          className="font-semibold leading-none"
                        >
                          Comment *
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
                        {errorMessage && (
                          <div className="text-red-500 text-sm mt-1">
                            {errorMessage}
                          </div>
                        )}
                      </FormControl>
                    </Box>
                  )}
                  {/* <div className="flex items-center w-full border-b justify-between"></div> */}
                </div>
                <div className="p-30 pt-24 pb-24">
                  {currentActivityForm.canExecute && (
                    <div className="flex justify-end">
                      <StyledBadge
                        badgeContent={
                          listDocument.length
                            ? listDocument.length
                            : CountApprove
                        }
                      >
                        <Button
                          className="whitespace-nowrap"
                          style={{
                            border: "1px solid",
                            backgroundColor: "#0000",
                            color: "black",
                            borderColor: "rgba(203,213,225)",
                          }}
                          variant="contained"
                          color="warning"
                          onClick={() => handleOpen(AppActivity.uid)}
                        >
                          <FuseSvgIcon
                            className="text-48"
                            size={24}
                            color="action"
                          >
                            heroicons-outline:upload
                          </FuseSvgIcon>
                          Document
                        </Button>
                      </StyledBadge>
                      {AppActions.map((btn) => (
                        <Button
                          key={btn.uid}
                          className="whitespace-nowrap ms-5"
                          variant="contained"
                          color="secondary"
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
              </div>
            )}
          </div>
        </Paper>
      </SwipeableViews>
      <DocumentModal
        step={1}
        open={open}
        handleModalClose={handleModalClose}
        selectedFile={selectedFile}
        selectedDocument={selectedDocument}
        handleDelete={handleDelete}
        handelDetailDoc={handelDetailDoc}
        errors={errors}
        setErrors={setErrors}
        handleSubmitDocument={handleSubmitAsset}
        listDocument={listDocument}
        CountApprove={CountApprove}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
        handelFileChange={handelFileChange}
        canExecute={AppActivity?.canExecute}
        toggleDrawer={toggleDrawer}
        handelFileDiscriptionChange={handelFileDiscriptionChange}
        formatDate={formatDate}
        documenDowToken={documenDowToken}
      />

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
    </div>
  );
};

export default ImplementationApprovalSite;
