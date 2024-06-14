import { authRoles } from "src/app/auth";
import Activity from "./Activity";

const ActivityConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/activity",
      element: <Activity />,
    },
  ],
};
export default ActivityConfig;
