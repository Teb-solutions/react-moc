import {
    Backdrop,
    Modal,

    Button,
    Badge,
    Typography,
    Fade,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { withStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";



const DocumentModal = (props) => {

    const { step, CountApprove, open, handleModalClose, listDocument, toggleDrawer, handelDetailDoc, openDrawer, handelFileChange, setOpenDrawer, fileDetails, setFileDetails, selectedFile, handelFileDiscriptionChange, handleSubmitDocument, selectedDocument, handleDownload, formatDate, contentDetails, canExecute, handleDelete } = props
    const StyledBadge = withStyles((theme) => ({
        Badge: {
            right: 0,
            top: 5,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: "0 4px",
            backgroundColor: "#000", // Adjust background color to match the image
            color: "white",
        },
    }))(Badge);
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "121rem",
        maxWidth: "95vw",
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
        overflow: "auto",
    });

    return (


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
                <Box sx={style}>
                    <div
                        className="flex justify-end mx-4 sm:mx-8"
                        style={{
                            marginTop: "-32px",
                            marginRight: "-29px",
                            padding: "0 0 -24px ",
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

                    <Box sx={{ flex: 1 }}>
                        <Box
                            className="flex justify-between"
                            style={{ margin: "0", paddingTop: "0" }}
                        >
                            <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                                style={{
                                    fontSize: "3rem",
                                }}
                            >
                                File Manager63
                                <Typography
                                    id="transition-modal-subtitle"
                                    component="h2"
                                >
                                    {contentDetails?.length > 0 ? contentDetails?.documentCount : CountApprove ? CountApprove : listDocument?.length} Files
                                </Typography>
                            </Typography>
                            {step != 1 ? (
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
                                </Box>) : canExecute ? (<Box>
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
                                </Box>) : <></>}
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
                                {listDocument?.map((doc, index) => (
                                    <div className="content " key={index}>
                                        <div
                                            onClick={() => handelDetailDoc(doc)}
                                            style={{ textAlign: "-webkit-center" }}
                                        >
                                            <img
                                                src="/assets/images/etc/icon_N.png"
                                                style={{}}
                                            />
                                            <h6 className="truncate-text">
                                                {doc?.name}
                                            </h6>
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
                                    // style={{ backgroundColor: "white" }}
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
                                        disabled
                                        value={selectedFile?.name}
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
                                        value={selectedFile?.descritpion}

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
                                    onClick={handleModalClose}
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
                                    disabled

                                />
                                <label htmlFor="fileInput">
                                    <div className=" ">
                                        <div

                                            style={{ textAlign: "-webkit-center" }}
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
                                        value={selectedDocument?.staffName}
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
                                        value={formatDate(
                                            selectedDocument?.createdAt
                                        )}
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
                                    justifyContent: step === 1 ? "center" : canExecute
                                        ? "end"
                                        : "center",
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
                                {step != 1 ?
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
                                                selectedDocument.documentId,
                                                selectedDocument.token
                                            )
                                        }
                                    >
                                        Delete
                                    </Button> : canExecute && (<Button
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
                                                selectedDocument.documentId,
                                                selectedDocument.token
                                            )
                                        }
                                    >
                                        Delete
                                    </Button>)}
                            </div>
                        </Box>
                    )}
                </Box>
            </Fade>
        </Modal>


    )
}

export default DocumentModal;