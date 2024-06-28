import { authRoles } from "src/app/auth";
import DesignationTask from "./DesignationTask";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const DesignationTaskConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/designationtask" : "404",
      element: feature.includes("MST") ? <DesignationTask /> : <Error404Page />,
    },
  ],
};
export default DesignationTaskConfig;
