import { authRoles } from "src/app/auth";
import HumanCS from "./HumanCS";
import Error404Page from "src/app/main/404/Error404Page";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const HumanCSConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/humancs" : "404",
      element: feature.includes("MST") ? <HumanCS /> : <Error404Page />,
    },
  ],
};
export default HumanCSConfig;
