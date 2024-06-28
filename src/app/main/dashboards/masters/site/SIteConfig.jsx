import { authRoles } from "src/app/auth";
import Site from "./Site";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const SiteConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/site" : "404",
      element: feature.includes("MST") ? <Site /> : <Error404Page />,
    },
  ],
};
export default SiteConfig;
