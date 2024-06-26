import { lazy } from "react";
import authRoles from "../../../auth/authRoles";
import DocRequest from "./activity/docRequest";
import Task from "../task/Task";
import Error404Page from "../../404/Error404Page";
const MocApp = lazy(() => import("./Moc"));
// const DocApp = lazy(() => import('./docevaluation/Doc'));
/**
 * The ProjectDashboardApp configuration.
 */
const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];
const MocConfig1 = {
  settings: {
    layout: {
      config: {},
    },
  },

  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("REQ") ? "moc" : "404",
      element: feature.includes("REQ") ? <MocApp /> : <Error404Page />,
      feature: "REQ",
    },
    {
      path: "/moc/activity",
      element: <DocRequest />,
    },
  ],
};
const shouldIncludeRoute = (route) => {
  // Include the route if it has no feature requirement or if the feature is in the feature array
  return !route.feature || feature.includes(route.feature);
};

// Filter the routes based on the feature array
const filteredRoutes = MocConfig1.routes.filter(shouldIncludeRoute);

// Update MocConfig with the filtered routes
const MocConfig = {
  ...MocConfig1,
  routes: filteredRoutes,
};

export default MocConfig;
