import { Backdrop, Box, Modal, Button, Fade, Typography } from "@mui/material";

const ModalView = (props) => {
  const { open, setOpen, handleSubmit } = props;
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "615px",
    maxWidth: "80vw",
    borderRadius: "16px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  return (
    <>
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
            <Box mb={2}>
              <div className="flex">
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "15px",
                    marginRight: "5px",
                    marginTop: "5px",
                    color: "red",
                  }}
                >
                  <img src="/assets/images/etc/icon.png" alt="Icon" />
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "2rem",
                  }}
                >
                  Submit request
                  <Typography
                    variant="h6"
                    component="h2"
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "grey",
                    }}
                  >
                    Once submitted you will not be able to revert! Are you sure
                    you want to continue?
                  </Typography>
                </Typography>
              </div>
            </Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
                style={{
                  padding: "10px 20px",
                  marginRight: "10px",
                  borderColor: "grey",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                style={{ padding: "10px 20px" }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ModalView;
