import { authRoles } from "src/app/auth";
import ImplementationReview from "./ImplementationReview";
import Error404Page from "src/app/main/404/Error404Page";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const ImplementationReviewConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/implementationreview" : "404",
      element: feature.includes("MST") ? (
        <ImplementationReview />
      ) : (
        <Error404Page />
      ),
    },
  ],
};
export default ImplementationReviewConfig;
