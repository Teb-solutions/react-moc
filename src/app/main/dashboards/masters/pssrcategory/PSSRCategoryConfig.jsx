import { authRoles } from "src/app/auth";
import PSSRCategory from "./PSSRCategory";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const PSSRCategoryConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/pssrcategory" : "404",
      element: feature.includes("MST") ? <PSSRCategory /> : <Error404Page />,
    },
  ],
};
export default PSSRCategoryConfig;
