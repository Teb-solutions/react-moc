import { authRoles } from "src/app/auth";
import Error404Page from "../404/Error404Page";
import { decryptFeature } from "../sign-in/tabs/featureEncryption";
import MocReports from "./MocReports";
import MocReportsDeleted from "./MocReportsDeleted";
import MocAiReport from "./MocAiReport";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const MocReportsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
  
    {
      path: "/reports/status",
      element: <MocReports />,
    },
    {
      path: "/reports/category",
      element: <MocReports />,
    },
    {
      path: "/reports/type",
      element: <MocReports />,
    },
    {
      path: "/reports/class",
      element: <MocReports />,
    },
    {
      path: "/reports/deleted",
      element: <MocReportsDeleted />,
    },
    {
      path: "/reports/ai",
      element: <MocAiReport />,
    },
    
    // Catch-all route for 404
    {
      path: "*", // This will match any invalid URL
      element: <Error404Page />,
    },
  ],
};
export default MocReportsConfig;