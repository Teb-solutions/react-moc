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
import { decryptFeature } from "../main/sign-in/tabs/featureEncryption"; // Ensure you have feature decryption logic

const routeConfigs = [
  SignInConfig,
  ForgotConfig,
  DocumentationConfig,
  ...UserInterfaceConfigs,
  ...DashboardsConfigs,
  ...AppsConfigs,
  ...authRoleExamplesConfigs,
];

const feature = decryptFeature() || [];

// Utility function to check if the route should be included based on features
const shouldIncludeRoute = (route) => {
  if (route.feature) {
    const routeFeatures = route.feature.split(",");
    return routeFeatures.some((f) => feature.includes(f.trim()));
  }
  return true; // If no feature is specified, allow the route
};

/**
 * The routes of the application.
 * This section ensures routes are only allowed if the user has the correct feature.
 */
const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs.filter(shouldIncludeRoute), // Filter routes based on features
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
    path: "/404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];

// Block routes if no token is available in local storage
const token = localStorage.getItem("jwt_access_token");
if (!token) {
  routes.unshift({
    path: "*",
    element: <Navigate to="/sign-in" />, // Redirect to sign-in if not authenticated
  });
}

export default routes;
