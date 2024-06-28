import { authRoles } from "src/app/auth";
import Task from "./Task";
import { decryptFeature } from "../../sign-in/tabs/featureEncryption";
import Error404Page from "../../404/Error404Page";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const taskConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("TSK") ? "/task" : "404",
      element: feature.includes("TSK") ? <Task /> : <Error404Page />,
    },
    {
      path: feature.includes("TASK") ? ":id/*" : "404",
      element: feature.includes("TASK") ? <Task /> : <Error404Page />,
    },
    {
      path: feature.includes("TASK") ? "id" : "404",
      element: feature.includes("TASK") ? <Task /> : <Error404Page />,
    },
  ],
};
export default taskConfig;
