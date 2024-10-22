import { authRoles } from "src/app/auth";
import Department from "./Department";
import Error404Page from "src/app/main/404/Error404Page";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const DepartmentConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    // Department list route
    {
      path: feature.includes("MST") ? "/masters/department" : "/404",
      element: feature.includes("MST") ? <Department /> : <Error404Page />,
    },
    // Department details route by ID
    {
      path: feature.includes("MSTU") ? "/department/:id/*" : "/404",
      element: feature.includes("MSTU") ? <Department /> : <Error404Page />,
    },
    // Catch-all route for 404
    {
      path: "*", // This will match any invalid URL
      element: <Error404Page />,
    },
  ],
};

export default DepartmentConfig;
