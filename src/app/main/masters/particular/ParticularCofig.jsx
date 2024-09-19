import { authRoles } from "src/app/auth";
import Particular from "./Particular";
import Error404Page from "src/app/main/404/Error404Page";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const ParticularConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/particular" : "404",
      element: feature.includes("MST") ? <Particular /> : <Error404Page />,
    },
  ],
};
export default ParticularConfig;
