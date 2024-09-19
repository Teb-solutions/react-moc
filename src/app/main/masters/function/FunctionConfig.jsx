import { authRoles } from "src/app/auth";
import Function from "./Function";
import Error404Page from "src/app/main/404/Error404Page";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const FunctionConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/function" : "404",
      element: feature.includes("MST") ? <Function /> : <Error404Page />,
    },
  ],
};
export default FunctionConfig;
