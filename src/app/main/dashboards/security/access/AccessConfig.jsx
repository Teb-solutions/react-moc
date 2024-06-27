import { authRoles } from "src/app/auth";
import Access from "./Access";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const AccessConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("ACC") ? "/security/access" : "404",
      element: feature.includes("ACC") ? <Access /> : <Error404Page />,
    },
  ],
};
export default AccessConfig;
