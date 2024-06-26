import { authRoles } from "src/app/auth";
import Role from "./role/Role";

const SecurityConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/security/role",
      element: <Role />,
      children: [
        {
          path: "",
          element: <Role to="role" />,
        },
        {
          path: "role",
          element: <Role />,
        },
      ],
    },
  ],
};
export default SecurityConfig;
