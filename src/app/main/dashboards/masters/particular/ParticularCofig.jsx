import { authRoles } from "src/app/auth";
import Particular from "./Particular";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
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
