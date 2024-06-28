import { authRoles } from "src/app/auth";
import RiskTime from "./RiskTime";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const RiskTimeConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/risktime" : "404",
      element: feature.includes("MST") ? <RiskTime /> : <Error404Page />,
    },
  ],
};
export default RiskTimeConfig;
