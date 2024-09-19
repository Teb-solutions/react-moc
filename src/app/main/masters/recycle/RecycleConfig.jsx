import { authRoles } from "src/app/auth";

import Recycle from "./Recycle";

const RecycleConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/recycle",
      element: <Recycle />,
    },
  ],
};
export default RecycleConfig;
