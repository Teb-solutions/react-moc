import { authRoles } from "src/app/auth";
import Activity from "./Activity";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const ActivityConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/activity" : "404",
      element: feature.includes("MST") ? <Activity /> : <Error404Page />,
    },
  ],
};
export default ActivityConfig;
