import { authRoles } from "src/app/auth";
import Task from "./Task";

const taskConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/task",
      element: <Task />,
    },
    {
      path: ":id/*",
      element: <Task />,
    },
    {
      path: "id",
      element: <Task />,
    },
  ],
};
export default taskConfig;
