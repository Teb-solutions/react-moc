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
import SwipeableViews from "react-swipeable-views";
import { withStyles } from "@mui/styles";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { styled } from "@mui/material/styles";
import { apiAuth } from "src/utils/http";
import DeleteModal from "../common_modal/delete_modal/DeleteModal";

function MainComponent({ contentDetails, contentChanges, assetEvaluationId }) {
  const formatDates = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };
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
  const StyledBadge = withStyles((theme) => ({
    Badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);
  const BoldLabel = styled("label")({
    fontWeight: "bold",
    color: "black",
  });
  const [deletes, setDeletes] = useState(false);
  const [open, setOpen] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  const formatDate1 = (dateString) => {
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
  const ListDoc = (id) => {
    apiAuth.get(`/DocumentManager/SummaryDoclist/${id}`).then((Resp) => {
      setListDocument(Resp?.data?.data);
    });
  };
  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };
  const handleOpen = () => {
    setOpen(true);
    ListDoc(assetEvaluationId);
  };
  const handleModalClose = () => {
    setOpen(false);
    setOpenDrawer(false);
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

      <SwipeableViews style={{ overflow: "hidden" }}>
        <Paper className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden">
          <div>
            <div
              _ngcontent-fyk-c288=""
              class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
            >
              <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                {contentChanges
                  ? "MOC Organisation Request"
                  : "Summary Details"}
              </h2>
              {contentChanges ? (
                <></>
              ) : (
                <div>
                  <StyledBadge
                    badgeContent={
                      listDocument.length
                        ? listDocument.length
                        : contentDetails.documentCount
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
                      onClick={handleOpen}
                    >
                      Document History
                    </Button>
                  </StyledBadge>
                </div>
              )}
            </div>
            <div
              _ngcontent-fyk-c288=""
              class="p-30 pt-24 pb-24 mb-6 ng-star-inserted"
            >
              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Request No{" "}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentDetails?.requestNo}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Date" : "Initiator"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? new Date(
                        contentDetails?.requestDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : contentDetails?.initiatorName}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Site In Charge" : "Initiated On"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.siteInChargeName
                      : formatDates(contentDetails?.requestDate)}
                  </div>
                </div>
              </div>

              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Site" : "Type"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.siteName
                      : contentDetails?.requestTypeName}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Division" : "Expense Nature"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.divisionName
                      : contentDetails?.expenseNature}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Function" : "Expense Type"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.functionName
                      : contentDetails?.expenseType}
                  </div>
                </div>
              </div>

              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Type" : "Change Type"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.typeString
                      : contentDetails?.changeType}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges ? "Employee Type" : " Project Value"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails.isNewStaff == true
                        ? "New"
                        : "Existing"
                      : contentDetails?.changeType}
                  </div>
                </div>
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges
                      ? "Employee Name"
                      : "Date of termination of change"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.changeStaffName
                      : formatDates(contentDetails?.changeTerminationDate)}
                  </div>
                </div>
              </div>

              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
              >
                {!contentChanges && (
                  <div className="my-6">
                    <div
                      _ngcontent-fyk-c288=""
                      class="mt-3 leading-6 text-secondary"
                    >
                      Location of change
                    </div>
                    <div
                      _ngcontent-fyk-c288=""
                      class="text-lg leading-6 font-medium"
                    >
                      {contentDetails?.changeLocationString}
                    </div>
                  </div>
                )}

                {!contentChanges && (
                  <div _ngcontent-fyk-c288="" className="my-6">
                    <div
                      _ngcontent-fyk-c288=""
                      class="mt-3 leading-6 text-secondary"
                    >
                      Change Benefits
                    </div>
                    <div
                      _ngcontent-fyk-c288=""
                      class="text-lg leading-6 font-medium"
                    >
                      {" "}
                      {contentDetails?.changeBenefits}
                    </div>
                  </div>
                )}
              </div>
              <div
                _ngcontent-fyk-c288=""
                class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
              >
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    {contentChanges
                      ? "Employee Designation"
                      : "Project Description"}
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? contentDetails?.changeStaffDesignationName
                      : contentDetails?.projectDescription}
                  </div>
                </div>
              </div>
              {contentChanges && (
                <div className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Program Completion Date
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    {contentChanges
                      ? new Date(
                        contentDetails?.programCompletionDate
                      ).toLocaleDateString("en-GB")
                      : contentDetails?.changeLocationString}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Paper>
      </SwipeableViews>
    </div>
  );
}

export default MainComponent;
