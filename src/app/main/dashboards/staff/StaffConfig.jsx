import { authRoles } from "src/app/auth";
import Staff from "./Staff";

const StaffConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/staff",
      element: <Staff />,
    },
    {
      path: ":id/*",
      element: <Staff />,
    },
    {
      path: "id",
      element: <Staff />,
    },
  ],
};
export default StaffConfig;
