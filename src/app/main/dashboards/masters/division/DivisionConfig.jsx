import { authRoles } from "src/app/auth";
import Division from "./Division";

const DivisionConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/division",
      element: <Division />,
    },
  ],
};
export default DivisionConfig;
