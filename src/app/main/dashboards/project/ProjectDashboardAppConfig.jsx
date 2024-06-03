import { lazy } from "react";
import authRoles from "../../../auth/authRoles";

const ProjectDashboardApp = lazy(() => import("./ProjectDashboardApp"));
/**
 * The ProjectDashboardApp configuration.
 */
const ProjectDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "dashboards/project",
      element: <ProjectDashboardApp />,
    },
  ],
};
export default ProjectDashboardAppConfig;
