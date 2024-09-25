import {
  Backdrop,
  Button,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const MasterAddEditModal = ({
  open,
  handleClose,
  lookupAdd,
  handleAdd,
  errors,
  handleSubmit,
  particularShow,
  particularList,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
    padding: "0px",
  };
  return (
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
          <Box
            style={{
              padding: "30px",
              backgroundColor: "#4f46e5",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <div className="flex justify-between text-white">
              <span className="text-popup font-medium">
                {lookupAdd.crudMode === "INSERT" ? "Add" : "Edit"}
              </span>
              <span
                onClick={handleClose}
                style={{ cursor: "pointer" }}
                className="cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fit=""
                  height="24"
                  width="24"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </span>
            </div>
          </Box>
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              marginTop: "0",
              paddingBottom: "0",
            }}
          >
            {particularShow && (
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <FormControl sx={{ m: 1 }}>
                  <InputLabel id="functionName-label" className="custom_label">
                    Particular *
                  </InputLabel>

                  <Select
                    labelId="functionName-label"
                    id="parentId"
                    name="parentId"
                    value={lookupAdd.parentId}
                    onChange={handleAdd}
                    label="Particular"
                    fullWidth
                    error={!!errors.parentId}
                  >
                    {particularList.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        {option.text}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.parentId && (
                    <span style={{ color: "red" }}>{errors.parentId}</span>
                  )}
                </FormControl>
              </Box>
            )}
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, marginTop: "30px" },
              }}
              noValidate
              autoComplete="off"
              sty
            >
              <TextField
                id="outlined-basic"
                className="flex-grow-1 "
                label="Code *"
                name="code"
                inputProps={{
                  maxLength: 5, // Limit to 30 characters, which approximates 5 words
                }}
                value={lookupAdd.code}
                variant="outlined"
                onChange={(e) => {
                  // Remove whitespaces and update value
                  const newValue = e.target.value.replace(/\s/g, "");
                  handleAdd({ target: { name: "code", value: newValue } });
                }}
                error={!!errors.code}
                helperText={errors.code}
              />
            </Box>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, marginTop: "30px" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                className="flex-grow-1 "
                label="Description *"
                name="description"
                value={lookupAdd.description}
                variant="outlined"
                onChange={handleAdd}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Box>
          </div>

          <div
            className="flex items-center space-x-12"
            style={{
              marginTop: "0",
              marginBottom: "0",
              justifyContent: "end",
              // backgroundColor: " rgba(248,250,252)",
              padding: "30px",
              paddingBottom: "30px",
            }}
          >
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="primary"
              style={{
                padding: "15px",
                backgroundColor: "white",
                color: "black",
                border: "1px solid grey",
                paddingLeft: "25px",
                paddingRight: "25px",
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              style={{
                padding: "15px",
                backgroundColor: "#4f46e5",
                paddingLeft: "25px",
                paddingRight: "25px",
              }}
              type="submit"
              onClick={handleSubmit}
            >
              {lookupAdd.crudMode === "UPDATE" ? "Update" : "Add"}
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MasterAddEditModal;
