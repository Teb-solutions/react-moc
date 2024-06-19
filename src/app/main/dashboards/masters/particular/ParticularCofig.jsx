import { authRoles } from "src/app/auth";
import Particular from "./Particular";

const ParticularConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/particular",
      element: <Particular />,
    },
  ],
};
export default ParticularConfig;
