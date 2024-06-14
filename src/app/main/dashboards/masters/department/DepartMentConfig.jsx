import { authRoles } from "src/app/auth";
import Department from "./Department";

const DepartmentConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/department",
      element: <Department />,
    },
  ],
};
export default DepartmentConfig;
