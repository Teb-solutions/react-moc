import { authRoles } from "src/app/auth";
import HighRiskActivity from "./HighRiskActivity";

const HighRiskActivityConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/highriskactivity",
      element: <HighRiskActivity />,
    },
  ],
};
export default HighRiskActivityConfig;
