import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Button,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemText,
  Box,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiAuth } from "src/utils/http";
const NotificationPopup = ({ notification, setNotification, setAnchorEl }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/notifications`);
    setAnchorEl(null);
    // If you want to pass the notification id as a dynamic route
  };
  const handelMarkAllRead = () => {
    const payload = {
      notificationStatus: notification[0].notificationStatus,
      createdAt: notification[0].createdAt,
      updatedAt: notification[0].updatedAt,
      token: "0",
      changeRequestToken: null,
      notificationType: notification[0].notificationType,
      notificationContent: notification[0].notificationContent,
      notificationGroup: notification[0].notificationGroup,
      groupId: null,
      notificationSubject: notification[0].notificationSubject,
      userId: notification[0].userId,
      isActive: false,
      read: true,
    };
    if (notification.length) {
      apiAuth.put(`/NotificationManager/Update`, payload).then((resp) => {
        setNotification([]);
      });
    }
  };
  const handelMarkAsRead = (e, notification) => {
    e.preventDefault();
    const payload = {
      notificationStatus: notification.notificationStatus,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
      token: notification.token,
      changeRequestToken: notification.changeRequestToken,
      notificationType: notification.notificationType,
      notificationContent: notification.notificationContent,
      notificationGroup: notification.notificationGroup,
      groupId: notification.groupId,
      notificationSubject: notification.notificationSubject,
      userId: notification.userId,
      isActive: notification.isActive,
      read: true,
    };

    apiAuth.put(`/NotificationManager/Update`, payload).then((resp) => {
      apiAuth.get(`/NotificationManager/Notifications/`).then((resp) => {
        setNotification(resp.data.data);
      });
    });
  };
  return (
    <>
      <Box
        style={{
          padding: "30px",
          backgroundColor: "#4f46e5",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <div className="flex justify-between text-white">
          <h3>Notifications</h3>
          <Tooltip
            title="Mark as all read"
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
            <Typography
              className="text-11 font-medium capitalize cursor-pointer"
              onClick={handelMarkAllRead}
            >
              <FuseSvgIcon
                style={{ color: notification?.length ? "white" : "grey" }}
              >
                heroicons-outline:mail-open
              </FuseSvgIcon>
            </Typography>
          </Tooltip>
        </div>
      </Box>
      <div
        className="p-30 pt-24 pb-24 mb-24"
        style={{ maxHeight: "480px", overflowY: "auto" }}
      >
        <List className="pt-0">
          {notification?.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="16px"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="56px"
                height="56px"
                borderRadius="50%"
                backgroundColor="rgba(224,231,255)"
              >
                <FuseSvgIcon size={24}>heroicons-outline:bell</FuseSvgIcon>
              </Box>
              <Typography
                variant="h6"
                component="div"
                style={{ marginTop: "16px", fontWeight: "bold" }}
              >
                No notifications
              </Typography>
              <Typography
                variant="body2"
                component="div"
                style={{
                  marginTop: "8px",
                  textAlign: "center",
                  color: "#616161",
                }}
              >
                When you have notifications, they will appear here.
              </Typography>
            </Box>
          ) : (
            notification.map((notification) => (
              <ListItem
                key={notification.id}
                divider
                sx={{ position: "relative" }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="start"
                  width="100%"
                >
                  <Box>
                    <ListItemText
                      className="m-0"
                      primary={
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: "bold" }}
                          className="cursor-pointer"
                          onClick={handleRedirect}
                        >
                          {notification.notificationSubject}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="div"
                            variant="body2"
                            color="textPrimary"
                          >
                            {notification.notificationContent}
                          </Typography>
                          <Typography
                            component="div"
                            variant="caption"
                            color="textSecondary"
                            style={{ marginTop: "8px" }}
                          >
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </Box>
                  <Tooltip
                    title="Mark as read"
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
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        position: "absolute",
                        top: "20px",
                        right: 0,
                        backgroundColor: "blue",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={(e) => handelMarkAsRead(e, notification)}
                    ></span>
                  </Tooltip>
                </Box>
              </ListItem>
            ))
          )}
        </List>
      </div>
    </>
  );
};

export default NotificationPopup;
