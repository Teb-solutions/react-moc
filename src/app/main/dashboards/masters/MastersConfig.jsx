import { authRoles } from "src/app/auth";
import Masters from "./Masters";
import Department from "./department/Department";
import Error404Page from "../../404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const mastersConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/department" : "404",
      element: feature.includes("MST") ? <Department /> : <Error404Page />,
      children: [
        {
          path: feature.includes("MST") ? "" : "404",
          element: feature.includes("MST") ? (
            <Department to="department" />
          ) : (
            <Error404Page />
          ),
        },
        {
          path: feature.includes("MST") ? "department" : "404",
          element: feature.includes("MST") ? <Department /> : <Error404Page />,
        },
      ],
    },
  ],
};
export default mastersConfig;
