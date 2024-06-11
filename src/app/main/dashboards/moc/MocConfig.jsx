import { lazy } from "react";
import authRoles from "../../../auth/authRoles";
import DocRequest from "./activity/docRequest";
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
    {
      path: "/moc/activity",
      element: <DocRequest />,
    },
  ],
};
export default MocConfig;
