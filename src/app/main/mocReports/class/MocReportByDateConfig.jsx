import { authRoles } from "src/app/auth";
import Error404Page from "../../404/Error404Page";
import { decryptFeature } from "../../sign-in/tabs/featureEncryption";
import MocReportByDate from "./MocReportByDate";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const MocReportByDateConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    // Staff list route
    {
      path: "/reportdate",
      element: <MocReportByDate />,
    },
   
    // Staff list route
    {
      path: "/reportdate/:id/*",
      element: <MocReportByDate />,
    },
    // Catch-all route for 404
    {
      path: "*", // This will match any invalid URL
      element: <Error404Page />,
    },
  ],
};

export default MocReportByDateConfig;
