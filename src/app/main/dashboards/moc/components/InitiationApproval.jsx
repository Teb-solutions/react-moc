import { Button, FormControl } from "@mui/base";
import { OutlinedInput, Paper } from "@mui/material";
import { Box } from "@mui/system";

const InitiationApproval = (props) => {
  const { ApprovalDetails } = props;
  const handleOpen = () => {};
  return (
    <>
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
                  {ApprovalDetails?.requestNo}
                </div>
              </div>
              <div _ngcontent-fyk-c288="">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  initiator
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {ApprovalDetails?.initiator}
                </div>
              </div>
              <div _ngcontent-fyk-c288="">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  initiated on
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {ApprovalDetails?.siteInChargeName}
                </div>
              </div>
            </div>
            <div>&nbsp;</div>
            <div
              _ngcontent-fyk-c288=""
              class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
            >
              <div _ngcontent-fyk-c288="">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Type
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {ApprovalDetails?.siteName}
                </div>
              </div>
              <div _ngcontent-fyk-c288="">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Expence Nature
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {ApprovalDetails?.divisionName}
                </div>
              </div>
              <div _ngcontent-fyk-c288="">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Expence Type
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {ApprovalDetails?.functionName}
                </div>
              </div>
            </div>
            <div>&nbsp;</div>
            <div
              _ngcontent-fyk-c288=""
              class="grid grid-cols-1 gap-x-6 gap-y-6  sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 w-full"
            >
              <div _ngcontent-fyk-c288="">
                <div
                  _ngcontent-fyk-c288=""
                  class="mt-3 leading-6 text-secondary"
                >
                  Project Description
                </div>
                <div
                  _ngcontent-fyk-c288=""
                  class="text-lg leading-6 font-medium"
                >
                  {" "}
                  {ApprovalDetails?.projectName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Paper>
      <div className="flex justify-center p-16 pb-64 sm:p-24 ">
        <Paper
          className="w-full  mx-auto sm:my-8 lg:mt-16 p-24  rounded-16 shadow overflow-hidden"
          style={{ marginRight: "15px", width: "100%" }}
        >
          <div
            _ngcontent-fyk-c288=""
            class="flex items-center w-full  border-b justify-between"
          >
            <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
              Approval
            </h2>
          </div>
          <div>&nbsp;</div>

          <div
            className="inventory-grid grid items-center gap-4 py-3 px-2 md:px-2"
            style={{ width: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <FormControl
                fullWidth
                sx={{
                  m: 1,
                  maxWidth: "100%",
                }}
              >
                <span className="font-semibold leading-none">Comment</span>
                <OutlinedInput
                  id="reasonForNewDocument"
                  name="reasonForNewDocument"
                  //   onChange={handleChangeRemark}
                  label="Reason For Change*"
                  className="mt-5"
                  //   value={valueRemark}
                />
              </FormControl>
            </Box>

            <div className="flex justify-end ">
              <Button
                className="whitespace-nowrap ms-5 "
                variant="contained"
                color="secondary"
                style={{
                  marginTop: "10px",
                }}
                //   onClick={(e) =>
                //     SubmitApprovelCreate(
                //       e,
                //       btn.uid,
                //       btn.name,
                //       btn.type
                //     )
                //   }
              >
                Click
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default InitiationApproval;
