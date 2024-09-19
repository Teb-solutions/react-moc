import { authRoles } from "src/app/auth";
import ChangePassword from "./ChangePassword";

const ChangePasswordConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/change-password",
      element: <ChangePassword />,
    },
  ],
};
export default ChangePasswordConfig;
