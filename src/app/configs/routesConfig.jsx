import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import SignInConfig from "../main/sign-in/SignInConfig";

import Error404Page from "../main/404/Error404Page";
import DashboardsConfigs from "../main/dashboards/dashboardsConfigs";
import AppsConfigs from "../main/apps/appsConfigs";
import UserInterfaceConfigs from "../main/user-interface/UserInterfaceConfigs";
import DocumentationConfig from "../main/documentation/DocumentationConfig";
import authRoleExamplesConfigs from "../main/auth/authRoleExamplesConfigs";
import ForgotConfig from "../main/forgot-password/FogotConfig";

const routeConfigs = [
  SignInConfig,
  ForgotConfig,
  DocumentationConfig,
  ...UserInterfaceConfigs,
  ...DashboardsConfigs,
  ...AppsConfigs,
  ...authRoleExamplesConfigs,
];
/**
 * The routes of the application.
 */
const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/dashboards/project" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];
export default routes;
