import { authRoles } from "src/app/auth";
import Designation from "./Designation";

const DesignationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/designation",
      element: <Designation />,
    },
  ],
};
export default DesignationConfig;
