import { authRoles } from "src/app/auth";
import SessionList from "./Session";

const sessionListConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/Session",
      element: <SessionList />,
    },
    {
      path: ":id/*",
      element: <SessionList />,
    },
    {
      path: "id",
      element: <SessionList />,
    },
  ],
};
export default sessionListConfig;
