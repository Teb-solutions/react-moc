import { authRoles } from "src/app/auth";
import Error404Page from "../404/Error404Page";
import { decryptFeature } from "../sign-in/tabs/featureEncryption";
import MocAnalytics from "./MocAnalytics";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

console.log(feature)

const MocAnalyticsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    // Staff list route
    {
      path:  "/mocanalytics",
      element:  <MocAnalytics />,
    },
    // Catch-all route for 404
    {
      path: "*", // This will match any invalid URL
      element: <Error404Page />,
    },
  ],
};

export default MocAnalyticsConfig;
