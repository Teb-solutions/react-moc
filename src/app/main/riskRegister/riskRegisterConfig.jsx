import { lazy } from "react";
import Error404Page from "../404/Error404Page";
import RiskApp from "./riskRegister";
import { authRoles } from "src/app/auth";
import { decryptFeature } from "../sign-in/tabs/featureEncryption";

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
