import FusePageSimple from "@fuse/core/FusePageSimple";
import { useEffect, useRef, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Container,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon, Key as KeyIcon } from "@mui/icons-material";
import { apiAuth } from "src/utils/http";
import { useNavigate } from "react-router";
import Loader from "../../loader/Loader";
import { useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

/**
 * The Course page.
 */
function Course() {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "rgba(229,238,255)",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "32px 24px",
    marginBottom: "40px",
  };

  const titleStyle = {
    fontSize: "3.25rem",
    fontWeight: "800",
    letterSpacing: "-0.025em",
    lineHeight: "1",
  };

  const buttonWrapperStyle = {
    display: "none", // Initially hidden for lg screens and up
    "@media (max-width: 1024px)": {
      display: "block",
    },
  };

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
    borderRadius: "0.375rem",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  };

  const iconStyle = {
    height: "24px",
    width: "24px",
  };

  const itemStyle = {
    display: "flex",
    alignItems: "center",
    padding: "25px 32px",
    backgroundColor: "rgba(229,238,255)",
    cursor: "pointer",
  };

  const iconContainerStyle = {
    height: "25px",
    width: "49px",
    color: "#3b82f6",
  };

  const textContainerStyle = {
    marginLeft: "12px",
  };

  const titleTextStyle = {
    fontSize: "1.5rem",
    fontWeight: "500",
    lineHeight: "1.5",
    color: "#3b82f6",
  };

  const subtitleTextStyle = {
    marginTop: "0.125rem",
    fontSize: "1.1rem",
    color: "#6b7280",
  };

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    // Add validation and save logic here
    setIsLoading(true);
    if (
      passwords.currentPassword === "" ||
      passwords.newPassword === "" ||
      passwords.confirmPassword === ""
    ) {
      setErrors({
        currentPassword: passwords.currentPassword === "",
        newPassword: passwords.newPassword === "",
        confirmPassword: passwords.confirmPassword === "",
      });
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      setErrors({
        ...errors,
        newPassword: true,
        confirmPassword: true,
      });
    } else {
      apiAuth
        .post(`/Staff/ChangePassword`, {
          newPassword: passwords.newPassword,
          password: passwords.currentPassword,
        })
        .then((resp) => {
          if (resp.data.statusCode == 400) {
            setIsLoading(false);
            setPasswords({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            toast.error(resp.data.message);
          } else if (resp.data.statusCode == 500) {
            setIsLoading(false);
            setPasswords({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            toast.error(resp.data.message);
          } else {
            setIsLoading(false);
            toast.success("Successfully Changed");
            setTimeout(() => navigate("/dashboards/project"), 1000);
          }
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [leftSidebarOpenSmall, setLeftSidebarOpenSmall] = useState(false);

  const handleResize = useCallback(() => {
    if (window.innerWidth <= 768) {
      // Adjust this width as needed
      setLeftSidebarOpen(false);
    } else {
      setLeftSidebarOpenSmall(false);
      setLeftSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    // Set initial state
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const isSaveDisabled =
    passwords.currentPassword === "" ||
    passwords.newPassword === "" ||
    passwords.confirmPassword === "" ||
    passwords.newPassword !== passwords.confirmPassword;

  // const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FusePageSimple
      content={
        <div className="w-full">
          <ToastContainer className="toast-container" />
          <Container style={{ marginLeft: "0px" }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={3}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                ml={2}
                style={{ marginLeft: "0px" }}
              >
                Security
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ display: { lg: "none" } }}
                onClick={() => setLeftSidebarOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box mt={3}>
              <Typography variant="h6" style={{ fontWeight: "0px" }}>
                Change your password
              </Typography>
            </Box>
            <Box mt={3} component="form" onSubmit={handleSave}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    type="password"
                    required
                    label="Current Password"
                    fullWidth
                    name="currentPassword"
                    error={errors.currentPassword}
                    helperText={
                      errors.currentPassword
                        ? "Current Password is required"
                        : ""
                    }
                    value={passwords.currentPassword}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="password"
                    required
                    label="New Password"
                    fullWidth
                    name="newPassword"
                    error={errors.newPassword}
                    value={passwords.newPassword}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ backgroundColor: "white" }}
                  />
                  <h6 className="text-grey pt-5">
                    Password should contain a minimum 10 characters, at least 1
                    Uppercase, 1 lowercase letter, 1 number and special
                    character (!@#$%&*)
                  </h6>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    type="password"
                    required
                    label="Confirm Password"
                    fullWidth
                    name="confirmPassword"
                    error={errors.confirmPassword}
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Box display="flex" justifyContent="flex-end">
                <Button variant="outlined" type="button">
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    ml: 2,
                    backgroundColor: "blue",
                    paddingLeft: "25px",
                    paddingRight: "25px",
                  }}
                  disabled={isSaveDisabled}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Container>
        </div>
      }
      leftSidebarWidth={300}
      leftSidebarOpen={leftSidebarOpen}
      leftSidebarContent={
        <div>
          <div style={headerStyle}>
            <div style={titleStyle}>Profile</div>
            <div className="desktop_hide text-end p-30 pt-24 pb-24">
              {!leftSidebarOpenSmall && (
                <FuseSvgIcon
                  className="text-48 cursor-pointer "
                  size={24}
                  style={{ display: "inline-block;" }}
                  color="action"
                  onClick={() => setLeftSidebarOpen(false)}
                >
                  heroicons-outline:x
                </FuseSvgIcon>
              )}
            </div>
            <div style={buttonWrapperStyle}>
              <button style={buttonStyle}>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={iconStyle}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
          <div style={containerStyle}>
            <div style={itemStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={iconContainerStyle}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              <div style={textContainerStyle}>
                <div style={titleTextStyle}>Security</div>
                <div style={subtitleTextStyle}>Manage your password</div>
              </div>
            </div>
          </div>
        </div>
      }
      scroll="content"
      ref={pageLayout}
    />
  );
}

export default Course;
