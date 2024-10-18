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
      path: feature.includes("REQD") ? "/tasklist" : "404",
      element: feature.includes("REQD") ? <TaskList /> : <Error404Page />,
      children: [
        {
          path: feature.includes("REQD") ? "" : "404",
          element: feature.includes("REQD") ? (
            <TaskList to="tasklist" />
          ) : (
            <Error404Page />
          ),
        },
        {
          path: feature.includes("REQD") ? "tasklist" : "404",
          element: feature.includes("REQD") ? <TaskList /> : <Error404Page />,
        },
      ],
    },
  ],
};
export default taskListConfig;
