import { authRoles } from "src/app/auth";
import ChangeImpactHazards from "./ChangeImpactHazards";
import Error404Page from "src/app/main/404/Error404Page";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const ChangeImpactHazardsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/changeimpacthazards" : "404",
      element: feature.includes("MST") ? (
        <ChangeImpactHazards />
      ) : (
        <Error404Page />
      ),
    },
  ],
};
export default ChangeImpactHazardsConfig;
