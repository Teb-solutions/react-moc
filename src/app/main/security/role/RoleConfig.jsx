import { authRoles } from "src/app/auth";
import Role from "./Role";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const RoleConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("RLE") ? "/security/role" : "404",
      element: feature.includes("RLE") ? <Role /> : <Error404Page />,
    },
  ],
};
export default RoleConfig;
