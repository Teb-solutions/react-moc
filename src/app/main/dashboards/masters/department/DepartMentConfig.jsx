import { authRoles } from "src/app/auth";
import Department from "./Department";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const DepartmentConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/department" : "404",
      element: feature.includes("MST") ? <Department /> : <Error404Page />,
    },
  ],
};
export default DepartmentConfig;
