import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button } from "@mui/base";
import { Paper } from "@mui/material";
import React from "react";

const Initiation = (props) => {
  const { contentDetails } = props;
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
  const handleOpen = () => {};
  return (
    <Paper className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden">
      <div>
        <div
          _ngcontent-fyk-c288=""
          class="flex items-center w-full  border-b justify-between"
        >
          <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
            MOC Document Request
          </h2>
        </div>
        <div _ngcontent-fyk-c288="" class="px-6 mb-6 ng-star-inserted">
          <div>&nbsp;</div>
          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Request No{" "}
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.requestNo}
              </div>
            </div>
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Date
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {formatDate(contentDetails?.requestDate)}
              </div>
            </div>
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Site In Charge
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.siteInChargeName}
              </div>
            </div>
          </div>
          <div>&nbsp;</div>
          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Site
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.siteName}
              </div>
            </div>
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Division
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.divisionName}
              </div>
            </div>
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Function
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.functionName}
              </div>
            </div>
          </div>
          <div>&nbsp;</div>
          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Type{" "}
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.typeString}
              </div>
            </div>
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Document Name
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.projectName}
              </div>
            </div>
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Document Description
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.projectDescription}
              </div>
            </div>
          </div>
          <div>&nbsp;</div>
          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Document Type
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails.isNewDocument == true ? "New" : "Existing"}
              </div>
            </div>
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Reason for New Document
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.reasonForNewDocument}
              </div>
            </div>
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Doc Controller
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                {contentDetails?.docControllerName}
              </div>
            </div>
          </div>
          <div>&nbsp;</div>
          <div
            _ngcontent-fyk-c288=""
            class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
          >
            <div _ngcontent-fyk-c288="">
              <div _ngcontent-fyk-c288="" class="mt-3 leading-6 text-secondary">
                Document Url
              </div>
              <div _ngcontent-fyk-c288="" class="text-lg leading-6 font-medium">
                {" "}
                <a
                  _ngcontent-fyk-c288=""
                  target="_blank"
                  class="text-blue-500 hover:text-blue-800"
                  style={{ background: "none", color: "blue" }}
                  href={contentDetails?.documentUrl}
                >
                  {contentDetails?.documentUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>&nbsp;</div>

        <div className="flex items-center justify-between w-full mt-8 px-6 py-3 border-t">
          <div>
            <button className="ml-1 sm:inline-flex cursor-pointer mat-button mat-stroked-button mat-button-base">
              <span className="mat-button-wrapper">
                <h1 className="mat-icon notranslate icon-size-4 mat-icon-no-color mr-3 justify-center" />
                <Button
                  className="whitespace-nowrap mt-5"
                  style={{
                    border: "1px solid",
                    backgroundColor: "#0000",
                    color: "black",
                    borderColor: "rgba(203,213,225)",
                  }}
                  variant="contained"
                  color="warning"
                  startIcon={
                    <FuseSvgIcon size={20}>heroicons-solid:upload</FuseSvgIcon>
                  }
                  onClick={handleOpen}
                >
                  Document
                </Button>

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
                        <h6>{doc?.name}</h6>
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
      </div>
    </Paper>
  );
};

export default Initiation;
