import { authRoles } from "src/app/auth";
import Error404Page from "../404/Error404Page";
import { decryptFeature } from "../sign-in/tabs/featureEncryption";
import MocReports from "./MocReports";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const MocReportsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    // Staff list route
    {
      path: "/reports",
      element: <MocReports />,
    },
    
    // Staff list route
    {
      path: "/reports/:id/*",
      element: <MocReports />,
    },
    
    // Catch-all route for 404
    {
      path: "*", // This will match any invalid URL
      element: <Error404Page />,
    },
  ],
};

export default MocReportsConfig;
