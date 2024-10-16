import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { apiAuth } from "src/utils/http";
import { styled } from "@mui/material/styles";
import { Box, Button, Fade, Modal, Paper, Typography } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Backdrop from "@mui/material/Backdrop";
import { parseISO, format } from "date-fns";
import DeleteModal from "../../common_modal/delete_modal/DeleteModal";

const Initiation = ({
  contentDetailsIni,
  listDocument1,
  currentActivityForm,
  evaluationId,
  setListDocument1,
}) => {
  const [openMoc, setOpenMoc] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [fileDetails, setFileDetails] = useState(false);
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  const [deletes, setDeletes] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [fileName, setFileName] = useState("");

  const [selectedFile, setSelectedFile] = useState({
    name: "",
    descritpion: "",
    type: "",
    document: "binary",
    documentType: "DocImplTrSheet",
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
    setFileName(doc.name);
  };

  const handleModalClose = () => {
    setOpenMoc(false);
    setOpenDrawer(false);
    setFileDetails(false);
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

  const handleDelete = (e, id, token) => {
    e.preventDefault();
    setDocId(id);
    setDocToken(token);
    setDeletes(true);
  };

  const handleCloseDelete = () => {
    setDeletes(false);
  };

  const handelFileChange = (e) => {
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
      documentType: "DocImplTrSheet",
      documentId: evaluationId,
      changeRequestToken: evaluationId,
    });
  };

  const handleSubmitAsset = (e) => {
    if (
      !selectedFile.name.trim() ||
      // !selectedFile.type.trim() ||
      !selectedFile.document ||
      !selectedFile.documentType.trim() ||
      !selectedFile.documentId.trim()
    ) {
      toast.error("Please select your file.");
      handleModalClose();
      setSelectedFile({
        ...selectedFile,
        name: "",
        description: "",
      });
      return;
    }

    // Validation: If description field is empty
    if (!selectedFile?.descritpion?.trim()) {
      toast.error("Please add a description.");
      handleModalClose();
      setSelectedFile({
        ...selectedFile,
        name: "",
        description: "",
      });
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
              `/DocumentManager/DocList/${evaluationId}/DocImplTrSheet?changeRequestToken=${evaluationId}`
            )
            .then((response) => {
              setOpenDrawer(false);
              setListDocument1(response?.data?.data);
              setSelectedFile({
                ...selectedFile,
                name: "",
                descritpion: "",
              });
            });
        } else {
          toast.error(response.data.message);
          setOpenMoc(false);
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
        setOpenDrawer(false);
        setSelectedFile({
          ...selectedFile,
          name: "",
          description: "",
        });
      });
  };

  const handleSubmitDelete = () => {
    apiAuth.delete(`DocumentManager/Delete/${docToken}`).then((response) => {
      apiAuth
        .get(
          `/DocumentManager/DocList/${docId}/ChangeRequest?changeRequestToken=${selectedDocument?.changeRequestToken}`
        )
        .then((response) => {
          setOpenDrawer(false);
          setListDocument1(response?.data?.data);
          setDeletes(false);
          setFileDetails(false);
          setSelectedDocument("");
        });
    });
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
  return (
    <>
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
      <Paper className="w-full  mx-auto sm:my-8 lg:mt-16  rounded-16 shadow overflow-hidden">
        <div>
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full p-30 pt-24 pb-24 border-b justify-between"
          >
            <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
              MOC Document Request
            </h2>
          </div>
          <div _ngcontent-fyk-c288="" class="p-30 pt-24 pb-24 ng-star-inserted">
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
                  {contentDetailsIni?.requestNo}
                </div>
              </div>
              <div _ngcontent-fyk-c288="" className="my-6">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Date
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {formatDate(contentDetailsIni?.requestDate)}
                </div>
              </div>
              <div _ngcontent-fyk-c288="" className="my-6">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Site In Charge
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni?.siteInChargeName}
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
                  Site
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni?.siteName}
                </div>
              </div>
              <div _ngcontent-fyk-c288="" className="my-6">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Division
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni?.divisionName}
                </div>
              </div>
              <div _ngcontent-fyk-c288="" className="my-6">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Function
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni?.functionName}
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
                  Type{" "}
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni?.typeString}
                </div>
              </div>
              <div _ngcontent-fyk-c288="" className="my-6">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Document Name
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni?.projectName}
                </div>
              </div>
              {/* <div _ngcontent-fyk-c288="" className="my-6">
            <div
              _ngcontent-fyk-c288=""
              class="mt-3 leading-6 text-secondary"
            >
              Document Description
            </div>
            <div
              _ngcontent-fyk-c288=""
              class="text-lg leading-6 font-medium"
            >
              {" "}
              {contentDetailsIni?.projectDescription}
            </div>
          </div> */}
              <div _ngcontent-fyk-c288="" className="my-6">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Document Type
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni.isNewDocument == true ? "New" : "Existing"}
                </div>
              </div>
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
                  Doc Controller
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni?.docControllerName}
                </div>
              </div>
            </div>
            <div
              _ngcontent-fyk-c288=""
              class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
            >
              <div _ngcontent-fyk-c288="" className="my-6">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Document Description
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni?.projectDescription}
                </div>
              </div>
            </div>
            <div
              _ngcontent-fyk-c288=""
              class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
            >
              <div _ngcontent-fyk-c288="" className="my-6">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Reason for New Document
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {contentDetailsIni?.reasonForNewDocument}
                </div>
              </div>
            </div>

            <div
              _ngcontent-fyk-c288=""
              class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 lg:grid-cols-1 lg:gap-16 w-full"
            >
              <div _ngcontent-fyk-c288="" className="my-6">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Document Url
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  <a
                    _ngcontent-fyk-c288=""
                    target="_blank"
                    class="text-blue-500 hover:text-blue-800"
                    style={{ background: "none", color: "blue" }}
                    href={
                      contentDetailsIni?.documentUrl &&
                      contentDetailsIni.documentUrl.startsWith("http")
                        ? contentDetailsIni.documentUrl
                        : `http://${contentDetailsIni?.documentUrl}`
                    }
                  >
                    {contentDetailsIni?.documentUrl}
                  </a>
                </div>
              </div>
            </div>
            {localStorage.getItem("consolidatedDocumentUrl") && (
              <div _ngcontent-fyk-c288="" class="grid  w-full">
                <div _ngcontent-fyk-c288="" className="my-6">
                  <div
                    _ngcontent-fyk-c288=""
                    class="mt-3 leading-6 text-secondary"
                  >
                    Consolidated Document Url
                  </div>
                  <div
                    _ngcontent-fyk-c288=""
                    class="text-lg leading-6 font-medium"
                  >
                    {" "}
                    <a
                      style={{ background: "none", color: "blue" }}
                      href={
                        localStorage.getItem("consolidatedDocumentUrl") &&
                        localStorage
                          .getItem("consolidatedDocumentUrl")
                          .startsWith("http")
                          ? localStorage.getItem("consolidatedDocumentUrl")
                          : `http://${localStorage.getItem("consolidatedDocumentUrl")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue"
                    >
                      {localStorage.getItem("consolidatedDocumentUrl")}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between w-full p-30 pt-24 pb-24 border-t">
            <button className="ml-1 sm:inline-flex cursor-pointer mat-button mat-stroked-button mat-button-base">
              <span className="mat-button-wrapper">
                {/* <h1 className="mat-icon notranslate icon-size-4 mat-icon-no-color mr-3 justify-center" /> */}
                {/* <Button
              className="whitespace-nowrap"
              style={{
                border: "1px solid",
                backgroundColor: "#0000",
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
              onClick={handleOpenMoc}
            >
              Document
            </Button> */}
              </span>
            </button>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default Initiation;
