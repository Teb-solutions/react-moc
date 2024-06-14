import { authRoles } from "src/app/auth";
import Masters from "./Masters";
import Department from "./department/Department";

const mastersConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/department",
      element: <Department />,
      children: [
        {
          path: "",
          element: <Department to="department" />,
        },
        {
          path: "department",
          element: <Department />,
        },
      ],
    },
  ],
};
export default mastersConfig;
