import { authRoles } from "src/app/auth";
import RiskFrequencyDetails from "./RiskFrequencyDetails";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const RiskFrequencyDetailsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/riskfrequencydetails" : "404",
      element: feature.includes("MST") ? (
        <RiskFrequencyDetails />
      ) : (
        <Error404Page />
      ),
    },
  ],
};
export default RiskFrequencyDetailsConfig;
