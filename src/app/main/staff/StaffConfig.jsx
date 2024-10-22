import { authRoles } from "src/app/auth";
import Staff from "./Staff";
import Error404Page from "../404/Error404Page";
import { decryptFeature } from "../sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const StaffConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    // Staff list route
    {
      path: feature.includes("STA") ? "/staff" : "/404",
      element: feature.includes("STA") ? <Staff /> : <Error404Page />,
    },
    // Specific staff details route
    {
      path: feature.includes("STAU") ? "/staff/:id/*" : "/404",
      element: feature.includes("STAU") ? <Staff /> : <Error404Page />,
    },
    // Catch-all route for 404
    {
      path: "*", // This will match any invalid URL
      element: <Error404Page />,
    },
  ],
};

export default StaffConfig;
