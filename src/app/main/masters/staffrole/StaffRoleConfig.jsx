import { authRoles } from "src/app/auth";
import Error404Page from "src/app/main/404/Error404Page";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";
import StaffRole from "./StaffRole";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const StaffRoleConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/staffrole" : "404",
      element: feature.includes("MST") ? <StaffRole /> : <Error404Page />,
    },
  ],
};
export default StaffRoleConfig;
