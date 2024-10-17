import { authRoles } from "src/app/auth";
import TaskList from "./TaskList";
import Error404Page from "../404/Error404Page";
import { decryptFeature } from "../sign-in/tabs/featureEncryption";
const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const taskListConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  // routes: [
  //   {
  //     path: "/tasklist",
  //     element: <TaskList />,
  //   },
  // ],
  routes: [
    {
      path: feature.includes("REQDEL") ? "/tasklist" : "404",
      element: feature.includes("REQDEL") ? <TaskList /> : <Error404Page />,
      children: [
        {
          path: feature.includes("REQDEL") ? "" : "404",
          element: feature.includes("REQDEL") ? (
            <TaskList to="tasklist" />
          ) : (
            <Error404Page />
          ),
        },
        {
          path: feature.includes("REQDEL") ? "tasklist" : "404",
          element: feature.includes("REQDEL") ? <TaskList /> : <Error404Page />,
        },
      ],
    },
  ],
};
export default taskListConfig;
