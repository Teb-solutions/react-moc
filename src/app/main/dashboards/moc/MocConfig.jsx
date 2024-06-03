import { lazy } from "react";
import authRoles from "../../../auth/authRoles";
const MocApp = lazy(() => import("./Moc"));
// const DocApp = lazy(() => import('./docevaluation/Doc'));
/**
 * The ProjectDashboardApp configuration.
 */
const MocConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "moc",
      element: <MocApp />,
    },
  ],
};
export default MocConfig;
