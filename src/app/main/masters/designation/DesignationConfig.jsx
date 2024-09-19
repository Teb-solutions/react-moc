import { authRoles } from "src/app/auth";
import Designation from "./Designation";
import Error404Page from "src/app/main/404/Error404Page";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const DesignationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/designation" : "404",
      element: feature.includes("MST") ? <Designation /> : <Error404Page />,
    },
  ],
};
export default DesignationConfig;
