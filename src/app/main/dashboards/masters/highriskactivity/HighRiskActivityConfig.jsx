import { authRoles } from "src/app/auth";
import HighRiskActivity from "./HighRiskActivity";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const HighRiskActivityConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/highriskactivity" : "404",
      element: feature.includes("MST") ? (
        <HighRiskActivity />
      ) : (
        <Error404Page />
      ),
    },
  ],
};
export default HighRiskActivityConfig;
