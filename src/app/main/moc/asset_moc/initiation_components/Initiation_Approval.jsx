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
import Initiation from "../../common_components/Initiation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DocumentModal from "../../common_modal/documentModal";
import DeleteModal from "../../common_modal/delete_modal/DeleteModal";
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
    errorMessage,
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
    descritpion: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });
  const [selectedFile1, setSelectedFile1] = useState({
    name: "",
    descritpion: "",
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
    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");

    const fileType = e.target.files[0].type.startsWith("image/")
      ? e.target.files[0].type?.split("/")[1]
      : e.target.files[0].type;
    setSelectedFile1({
      ...selectedFile1,
      name: fileNameWithoutExtension,

      type: fileType,
      document: e.target.files[0],
      documentType: "ChangeRequest",
      documentId: selectedFile1.documentId,
      changeRequestToken: assetEvaluationId,
    });
  };

  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
    setFileDetails(false);
  };
  const handleModalClose1 = () => {
    setOpen1(false);
    setOpenDrawer1(false);
    setFileDetails1(false);
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
    setSelectedFile1({
      name: "",
      descritpion: "",
    });
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


  const handleSubmitAsset = (e) => {

    if (
      !selectedFile1.name.trim() ||
      !selectedFile1.type.trim() ||
      !selectedFile1.document ||
      !selectedFile1.documentType.trim()

    ) {
      toast.error("Please select your file.");
      handleModalClose1()
      setSelectedFile({
        ...selectedFile1,
        name: "",
        description: "",
      });
      return;
    }

    // Validation: If description field is empty
    if (!selectedFile1?.descritpion?.trim()) {
      toast.error("Please add a description.");
      handleModalClose1()
      setSelectedFile({
        ...selectedFile1,
        name: "",
        description: "",
      });
      return;
    }
    const formData = new FormData();
    formData.append("name", selectedFile1.name);
    formData.append("descritpion", selectedFile1.descritpion);
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
        if (response.data.statusCode === 200) {
          apiAuth
            .get(
              `/DocumentManager/DocList/${Activity.uid}/Approval?changeRequestToken=${assetEvaluationId}`
            )
            .then((response) => {
              setOpenDrawer1(false);
              setListDocument1(response?.data?.data);

              setSelectedFile1({
                ...selectedFile1,
                name: "",
                descritpion: "",
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
        setOpen1(false);
        setOpenDrawer(false);
        setSelectedFile({
          ...selectedFile,
          name: "",
          description: "",
        });
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
          `/DocumentManager/DocList/${Activity.uid}/Approval?changeRequestToken=${assetEvaluationId}`
        )
        .then((response) => {
          setOpenDrawer1(false);
          setListDocument1(response?.data?.data);
          setDeletes(false);
          setFileDetails1(false);
          setSelectedDocument1({
            ...selectedFile1,
            name: "",
            descritpion: "",
          });
        });
    });
  };

  return (
    <div className="w-full h-full">
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
      <DeleteModal
        openDelete={deletes1}
        handleCloseDelete={handleCloseDelete1}
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
            onClick={handleCloseDelete1}
          >
            Cancel
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            style={{ padding: "23px", backgroundColor: "red" }}
            type="submit"
            onClick={handleSubmitDelete1}
          >
            Confirm
          </Button>
        </div>
      </DeleteModal>


      <DocumentModal
        open={open1}
        step={1}
        formatDate={formatDate}

        handleModalClose={handleModalClose1}
        listDocument={listDocument1}
        selectedDocument={selectedDocument1}
        toggleDrawer={toggleDrawer}
        openDrawer={openDrawer1}
        setOpenDrawer={setOpenDrawer1}
        fileDetails={fileDetails1}
        setFileDetails={setFileDetails1}
        selectedFile={selectedFile1}
        handelDetailDoc={handelDetailDoc1}
        handelFileChange={handelFileChange1}
        handelFileDiscriptionChange={handelFileDiscriptionChange1}
        canExecute={currentActivityForm?.canExecute}
        handleSubmitDocument={handleSubmitAsset}
        handleDelete={handleDelete}
        documenDowToken={documenDowToken1}
      />


      <Initiation
        contentDetails={contentDetails}
        assetEvaluationId={assetEvaluationId}
        contentDetailsDocu={ApprovalDetails}
      />
      {/* <SwipeableViews style={{ overflow: "hidden" }}>
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
      </SwipeableViews> */}
      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full mx-auto sm:my-8 lg:mt-16 rounded-16 shadow">
          <div className="flex items-center w-full border-b p-30 pt-24 pb-24 justify-between">
            <h2 className="text-2xl font-semibold">Approval</h2>
          </div>

          {Activity.isComplete && Activity.status !== "Pending" ? (
            <>
              <div
                className="inventory-grid grid items-center gap-4 p-30 pt-24 pb-24"
                style={
                  {
                    // whiteSpace: "nowrap",
                    // overflow: "hidden",
                    // textOverflow: "ellipsis",
                  }
                }
              >
                <span className="leading-none">
                  <b>Approver Comment:</b> {ApprovalManager?.remark}
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
