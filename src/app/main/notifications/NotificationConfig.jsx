import { authRoles } from "src/app/auth";
import Notification from "./Notification";

const notificationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/notifications",
      element: <Notification />,
    },
  ],
};
export default notificationConfig;
