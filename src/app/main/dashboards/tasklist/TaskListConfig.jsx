import { authRoles } from "src/app/auth";
import TaskList from "./TaskList";

const taskListConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/tasklist",
      element: <TaskList />,
    },
  ],
};
export default taskListConfig;
