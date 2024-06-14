import { authRoles } from "src/app/auth";
import Function from "./Function";

const FunctionConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/function",
      element: <Function />,
    },
  ],
};
export default FunctionConfig;
