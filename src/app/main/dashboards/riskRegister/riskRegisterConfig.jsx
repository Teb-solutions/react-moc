import { lazy } from "react";
import authRoles from "../../../auth/authRoles";
import Task from "../task/Task";
import Error404Page from "../../404/Error404Page";
import { decryptFeature } from "../../sign-in/tabs/featureEncryption";
import RiskApp from "./riskRegister";
import DocRequest from "../moc/activity/docRequest";
import AssetRequest from "../moc/assetActivity/AssetRequest";
// const DocApp = lazy(() => import('./docevaluation/Doc'));
/**
 * The ProjectDashboardApp configuration.
 */
const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];
const RiskAppConfig1 = {
  settings: {
    layout: {
      config: {},
    },
  },

  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("REQ") ? "risk" : "404",
      element: feature.includes("REQ") ? <RiskApp /> : <Error404Page />,
      feature: "REQ",
    },
    {
      path: "/moc/activity",
      element: <DocRequest />,
    },
    {
      path: "/moc/Assetactivity",
      element: <AssetRequest />,
    },
  ],
};
const shouldIncludeRoute = (route) => {
  // Include the route if it has no feature requirement or if the feature is in the feature array
  return !route.feature || feature.includes(route.feature);
};

// Filter the routes based on the feature array
const filteredRoutes = RiskAppConfig1.routes.filter(shouldIncludeRoute);

// Update MocConfig with the filtered routes
const RiskAppConfig = {
  ...RiskAppConfig1,
  routes: filteredRoutes,
};

export default RiskAppConfig;
