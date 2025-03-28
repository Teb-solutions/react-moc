import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { selectUser } from "src/app/auth/user/store/userSlice";
import { useAuth } from "src/app/auth/AuthRouteProvider";
import { darken } from "@mui/material/styles";
import { useAppSelector } from "app/store/hooks";
import { Badge, Tooltip } from "@mui/material";
import NotificationPopup from "./NotificationPopup";
import { useEffect } from "react";
import { apiAuth } from "src/utils/http";
import BookmarkPopup from "./BookmarkPopup";
import TicketModal from "src/app/main/moc/common_modal/TicketModal";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

/**
 * The user menu.
 */
function UserMenu() {
  const user = useAppSelector(selectUser);
  const { signOut } = useAuth();
  const [userMenu, setUserMenu] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };
  const userMenuClose = () => {
    setUserMenu(null);
  };

  if (!user) {
    return null;
  }
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [bookmarkAnchorEl, setBookmarkAnchorEl] = useState(null);
  const [errors, setErrors] = useState({});
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setErrors({});
  };

  const open = Boolean(anchorEl);
  const openBookmarkPopover = Boolean(bookmarkAnchorEl);
  const id = open ? "simple-popover" : undefined;
  const [notification, setNotification] = useState(null);

  function getRecords() {
    apiAuth.get(`/NotificationManager/Notifications/`).then((resp) => {
      setNotification(resp.data.data);
    });
  }

  const handleBookmarkClick = (event) =>
    setBookmarkAnchorEl(event.currentTarget);
  const handleBookmarkClose = () => setBookmarkAnchorEl(null);

  const [fileName, setFileName] = useState(null);
  const [ticketData, setTicketData] = useState({
    projectId: "5EC94E1B-E058-4008-EC12-08DC9C361D1D",
    customerName: "",
    customerMobile: "string",
    customerLocation: "string",
    subject: "",
    message: "",
    ticketCategory: "",
    ticketPriority: "",
    referenceOrder: "string",
    remarks: "created ticket11",
    ticketSource: 5,
    dueDate: "2024-08-02T06:50:53.617Z",
    status: 1,
  });

  const validateForm = () => {
    let tempErrors = {};
    if (!ticketData.subject) tempErrors.subject = "Subject is required.";
    if (!ticketData.customerName)
      tempErrors.customerName = "CustomerName is required.";
    if (!ticketData.message) tempErrors.message = "Description is required.";
    if (!ticketData.ticketCategory)
      tempErrors.ticketCategory = "Ticket Category is required.";
    if (!ticketData.ticketPriority && ticketData.ticketPriority !== 0)
      tempErrors.ticketPriority = "Ticket Priority is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const tokenTicket = localStorage.getItem("jwt_access_ticket_token");
    try {
      const response = await axios.post(
        "https://pmcrm.tebs.co.in/api/v1/tickets",
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${tokenTicket}`,
            Tenant: "root",
            Accept: "application/json",
          },
        }
      );
      toast.success("Successfully created");
      handleModalClose();
      setTicketData({
        projectId: "5EC94E1B-E058-4008-EC12-08DC9C361D1D",
        customerName: "",
        customerMobile: "string",
        customerLocation: "string",
        subject: "",
        message: "",
        ticketCategory: "",
        ticketPriority: "",
        referenceOrder: "string",
        remarks: "created ticket11",
        ticketSource: 5,
        dueDate: "2024-08-02T06:50:53.617Z",
        status: 1,
      });
      setFileName("");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleLogout = () => {
    // Clear tokens from local storage
    localStorage.removeItem("jwt_access_token");
    localStorage.removeItem("jwt_access_ticket_token");
    localStorage.removeItem("username"); // Include other relevant keys

    // Redirect to sign-in page
    navigate("/sign-in", { replace: true }); // Use replace to prevent back navigation
  };

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <>
      <Badge badgeContent={notification?.length} color="success">
        <Button
          className="min-h-40 min-w-40 p-0  md:py-6"
          onClick={handleBookmarkClick}
          color="inherit"
        >
          <div className="mx-4  flex-col items-end md:flex">
            <Typography
              className="text-11 font-medium capitalize"
              color="text.secondary"
            >
              <FuseSvgIcon>heroicons-outline:bookmark</FuseSvgIcon>
            </Typography>
          </div>
        </Button>
        <Tooltip
          title="Create Ticket"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: "black",
                color: "white",
                fontSize: 12,
              },
            },
          }}
        >
          <Button
            className="min-h-40 min-w-40 p-0  md:py-6"
            onClick={handleModalOpen}
            color="inherit"
          >
            <div className="mx-4  flex-col items-end md:flex">
              <Typography
                className="text-11 font-medium capitalize"
                color="text.secondary"
              >
                <FuseSvgIcon>heroicons-outline:ticket</FuseSvgIcon>
              </Typography>
            </div>
          </Button>
        </Tooltip>
        <Tooltip
          title="Notification"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: "black",
                color: "white",
                fontSize: 12,
              },
            },
          }}
        >
          <Button
            className="min-h-40 min-w-40 p-0  md:py-6"
            onClick={handleClick}
            color="inherit"
          >
            <div className="mx-4  flex-col items-end md:flex">
              <Typography
                className="text-11 font-medium capitalize"
                color="text.secondary"
              >
                <FuseSvgIcon>heroicons-outline:bell</FuseSvgIcon>
              </Typography>
            </div>
          </Button>
        </Tooltip>
      </Badge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClick}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            width: "400px", // Set the width of the popover
          },
        }}
      >
        {notification && (
          <NotificationPopup
            notification={notification}
            setNotification={setNotification}
            setAnchorEl={setAnchorEl}
          />
        )}
      </Popover>
      <Popover
        id="bookmark-popover"
        open={openBookmarkPopover}
        anchorEl={bookmarkAnchorEl}
        onClose={handleBookmarkClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ style: { width: "350px", borderRadius: "18px" } }}
      >
        <BookmarkPopup onClose={handleBookmarkClose} />
      </Popover>
      <Button
        className="min-h-40 min-w-40 p-0  md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="mx-4  flex-col items-end md:flex">
          <Typography
            className="text-11 font-medium capitalize"
            color="text.secondary"
          >
            {user.role?.toString()}
            {(!user.role ||
              (Array.isArray(user.role) && user.role.length === 0)) && (
              <>
                <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
              </>
            )}
          </Typography>
        </div>

        {/* {user.data.photoURL ? (
          <Avatar
            sx={{
              background: (theme) => theme.palette.background.default,
              color: (theme) => theme.palette.text.secondary,
            }}
            className="md:mx-4"
            alt="user photo"
            src={user.data.photoURL}
          />
        ) : (
          <Avatar
            sx={{
              background: (theme) =>
                darken(theme.palette.background.default, 0.05),
              color: (theme) => theme.palette.text.secondary,
            }}
            className="md:mx-4"
          >
            {user?.data?.displayName?.[0]}
          </Avatar>
        )} */}
      </Button>
      <Tooltip
        title={localStorage.getItem("username")}
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: "black",
              color: "white",
              fontSize: 12,
            },
          },
        }}
      >
        <Typography component="span" className="flex hidden-small">
          Hi, {localStorage.getItem("username")?.split(" ")[0]}
        </Typography>
      </Tooltip>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-8",
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/change-password" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </MenuItem>
            <MenuItem
              component={Link}
              onClick={handleLogout}
              to="/sign-in"
              role="button"
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
            {/* <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem> */}
          </>
        ) : (
          <>
            <MenuItem
              component={Link}
              to="/apps/profile"
              onClick={userMenuClose}
              role="button"
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            <MenuItem
              component={Link}
              to="/apps/mailbox"
              onClick={userMenuClose}
              role="button"
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:mail-open</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                signOut();
              }}
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </MenuItem>
          </>
        )}
      </Popover>
      <TicketModal
        errors={errors}
        setErrors={setErrors}
        setModalOpen={setModalOpen}
        open={modalOpen}
        fileName={fileName}
        setFileName={setFileName}
        ticketData={ticketData}
        setTicketData={setTicketData}
        handleSubmit={handleSubmit}
        validateForm={validateForm}
      />
    </>
  );
}

export default UserMenu;
