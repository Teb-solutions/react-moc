import { authRoles } from "src/app/auth";
import Department from "./department/Department";
import Error404Page from "../404/Error404Page";
import { decryptFeature } from "../sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
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
          path: feature.includes("MST") ? "/masters/department" : "404",
          element: feature.includes("MST") ? (
            <Department to="/masters/department" />
          ) : (
            <Error404Page />
          ),
        },
        {
          path: feature.includes("MST") ? "/masters/sdepartment" : "404",
          element: feature.includes("MST") ? <Department /> : <Error404Page />,
        },
      ],
    },
  ],
};
export default mastersConfig;
