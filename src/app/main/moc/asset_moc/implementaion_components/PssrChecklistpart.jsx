import {
  Backdrop,
  Badge,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { withStyles } from "@mui/styles";

const PssrCheckListPart = (props) => {
  const StyledBadge = withStyles((theme) => ({
    Badge: {
      background: "#2c3e50",
      color: "#fff",
      top: "3px",
      right: "8px",
    },
  }))(Badge);
  const {
    PssrCheckListData,
    documentCountsImp,
    checklistData,
    radioState,
    handleRadioChange,
    showPssrEdit,
    remarksState,
    handleCommentsChange,
    handleOpenPssR,
    handleSubmitCheckList,
    setShowPssrCheckList,
    setShowPssrEdit,
  } = props;

  return (
    <Box className="p-30 pt-24 pb-24" sx={{ width: "100%" }}>
      {PssrCheckListData?.parentData?.map((parent, index) => {
        // Filter childData based on the matching parentId
        const matchingChildData = PssrCheckListData?.childData?.filter(
          (child) => child.parentId === parent.value
        );

        return (
          <>
            <Box key={index} mb={4}>
              <Typography
                variant="h6"
                gutterBottom
                style={{ backgroundColor: "rgba(241,245,249, 1)" }}
                className="p-8"
              >
                {parent.text}
              </Typography>

              {matchingChildData.map((child) => {
                let matchingPssrData;
                let documentCount = 0;

                if (
                  PssrCheckListData &&
                  PssrCheckListData?.pssrData &&
                  PssrCheckListData?.pssrData.length !== 0
                ) {
                  matchingPssrData = PssrCheckListData.pssrData.find(
                    (pssrItem) => pssrItem.particular === child.value
                  );
                  documentCount = documentCountsImp[matchingPssrData?.id] || 0;
                } else {
                  matchingPssrData = checklistData.find(
                    (pssrItem) => pssrItem.value === child.value
                  );
                  let bombayData = checklistData.filter(
                    (e) => e.particular === child.value
                  );
                  documentCount =
                    documentCountsImp[bombayData[0]?.documentId] || 0;
                }

                return (
                  <Box
                    key={child.value}
                    mb={3}
                    p={2}
                    border={1}
                    borderColor="grey.300"
                    borderRadius={2}
                  >
                    <Typography variant="body1" gutterBottom>
                      {child.text}
                    </Typography>

                    <RadioGroup
                      row
                      value={
                        radioState[child.value] ||
                        matchingPssrData?.checklistReviewStatus ||
                        ""
                      }
                      onChange={(e) =>
                        handleRadioChange(child.value, e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                        disabled={
                          radioState[child.value] === "Yes" && !showPssrEdit
                        }
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                        disabled={
                          radioState[child.value] === "No" && !showPssrEdit
                        }
                      />
                      <FormControlLabel
                        value="N/A"
                        control={<Radio />}
                        label="N/A"
                        disabled={
                          radioState[child.value] === "N/A" && !showPssrEdit
                        }
                      />
                    </RadioGroup>

                    {matchingPssrData?.remarks && !showPssrEdit ? (
                      <h4 className="p-8">{matchingPssrData?.remarks}</h4>
                    ) : (
                      <TextField
                        label="Add comments"
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        defaultValue={
                          remarksState[child.value] ||
                          matchingPssrData?.remarks ||
                          ""
                        }
                        onChange={(e) =>
                          handleCommentsChange(e, child.value, e.target.value)
                        }
                      />
                    )}

                    <StyledBadge badgeContent={documentCount}>
                      <Button
                        disabled={
                          (radioState[child.value] ||
                            matchingPssrData?.checklistReviewStatus ||
                            "") === ""
                        }
                        className="whitespace-nowrap"
                        style={{
                          border: "1px solid",
                          backgroundColor:
                            (radioState[child.value] ||
                              matchingPssrData?.checklistReviewStatus ||
                              "") === ""
                              ? "rgb(237 233 233)"
                              : "#0000",
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
                        onClick={() => {
                          let bombayData = checklistData.filter(
                            (e) => e.particular === child.value
                          );
                          handleOpenPssR(
                            matchingPssrData?.id
                              ? matchingPssrData?.id
                              : bombayData[0]?.documentId
                          );
                        }}
                      >
                        Document
                      </Button>
                    </StyledBadge>
                  </Box>
                );
              })}
            </Box>
          </>
        );
      })}

      <div
        className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
        style={{
          display: "flex",
          marginTop: "15px",
          justifyContent: "end",
          padding: "10px",
        }}
      >
        {PssrCheckListData?.pssrData?.length > 0 ? (
          showPssrEdit && (
            <>
              {" "}
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
                onClick={() => {
                  setShowPssrCheckList(false);
                  setShowPssrEdit(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                style={{
                  padding: "23px",
                }}
                type="submit"
                onClick={handleSubmitCheckList}
              >
                Update
              </Button>
            </>
          )
        ) : (
          <>
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
              onClick={() => {
                setShowPssrCheckList(false);
                setShowPssrEdit(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              style={{
                padding: "23px",
              }}
              type="submit"
              onClick={handleSubmitCheckList}
            >
              Save
            </Button>
          </>
        )}
      </div>
    </Box>
  );
};

export default PssrCheckListPart;
