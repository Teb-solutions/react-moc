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
        link.setAttribute("download", fileName); // or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
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
                    href={contentDetailsIni?.documentUrl}
                  >
                    {contentDetailsIni?.documentUrl}
                  </a>
                </div>
              </div>
            </div>
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
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={openMoc}
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
                  <Fade in={openMoc}>
                    <Box sx={style1}>
                      <Box sx={{ flex: 1 }}>
                        <div
                          className="flex justify-end "
                          style={{
                            marginTop: "-16px",
                            marginRight: "-16px",
                          }}
                        >
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
                        <Box
                          className="flex justify-between"
                          style={{ margin: "0", padddingTop: "0" }}
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
                            <Typography
                              id="transition-modal-subtitle"
                              component="h2"
                            >
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
                                <span className="mx-4 sm:mx-8">
                                  Upload File
                                </span>
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
                                  onClick={() => handelDetailDoc(doc)}
                                  style={{
                                    textAlign: "-webkit-center",
                                  }}
                                >
                                  <img
                                    src="/assets/images/etc/icon_N.png"
                                    style={{}}
                                  />
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
                              <FuseSvgIcon size={20}>
                                heroicons-outline:x
                              </FuseSvgIcon>
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
                                <span className="mx-4 sm:mx-8">
                                  Upload File
                                </span>
                              </Button>
                            </label>
                            <Box
                              component="form"
                              sx={{
                                "& > :not(style)": {
                                  m: 1,
                                  width: "25ch",
                                },
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
                                "& > :not(style)": {
                                  m: 1,
                                  width: "25ch",
                                },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <TextField
                                id="selectedFileName"
                                label="Select File"
                                variant="standard"
                                name="name"
                                disabled
                                value={selectedFile.name}
                              />
                            </Box>
                            <Box
                              component="form"
                              sx={{
                                "& > :not(style)": {
                                  m: 1,
                                  width: "25ch",
                                },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <TextField
                                id="standard-basic"
                                label={<>Description</>}
                                name="descritpion"
                                variant="standard"
                                onChange={handelFileDiscriptionChange}
                                value={selectedFile.descritpion}
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
                              <FuseSvgIcon size={20}>
                                heroicons-outline:x
                              </FuseSvgIcon>
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
                                  style={{
                                    textAlign: "-webkit-center",
                                  }}
                                >
                                  <img src="/assets/images/etc/icon_N.png" />
                                </div>
                                <h6>{selectedDocument?.name}</h6>
                              </div>
                            </label>
                            <Box
                              component="form"
                              sx={{
                                "& > :not(style)": {
                                  m: 1,
                                  width: "25ch",
                                },
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
                                "& > :not(style)": {
                                  m: 1,
                                  width: "25ch",
                                },
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
                                "& > :not(style)": {
                                  m: 1,
                                  width: "25ch",
                                },
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
                                "& > :not(style)": {
                                  m: 1,
                                  width: "25ch",
                                },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <TextField
                                id="standard-basic"
                                label={<>Description</>}
                                name="description"
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
                {/* <Modal
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
                          </Typography>
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
                    </Box>
                  </Fade>
                </Modal> */}
              </span>
            </button>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default Initiation;
