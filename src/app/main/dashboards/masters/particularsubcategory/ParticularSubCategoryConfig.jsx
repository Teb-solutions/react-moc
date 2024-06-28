import { authRoles } from "src/app/auth";
import ParticularSubCategory from "./ParticularSubCategory";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const ParticularSubCategoryConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/particularsubcategory" : "404",
      element: feature.includes("MST") ? (
        <ParticularSubCategory />
      ) : (
        <Error404Page />
      ),
    },
  ],
};
export default ParticularSubCategoryConfig;
