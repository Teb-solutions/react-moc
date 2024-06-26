import { authRoles } from "src/app/auth";
import Role from "./Role";

const RoleConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/security/role",
      element: <Role />,
    },
  ],
};
export default RoleConfig;
