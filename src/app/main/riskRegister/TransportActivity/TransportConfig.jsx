import { authRoles } from "src/app/auth";
import TransportApp from "./Transport";

const TransportActivityConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/risk/transportactivity",
      element: <TransportApp />,
    },
    {
      path: "/risk/routineactivity",
      element: <TransportApp />,
    },
    {
      path: "/risk/nonroutineactivity",
      element: <TransportApp />,
    },
  ],
};
export default TransportActivityConfig;
