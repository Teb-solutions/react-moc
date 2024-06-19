import { authRoles } from "src/app/auth";
import DesignationTask from "./DesignationTask";

const DesignationTaskConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/designationtask",
      element: <DesignationTask />,
    },
  ],
};
export default DesignationTaskConfig;
