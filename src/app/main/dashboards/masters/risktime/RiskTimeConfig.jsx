import { authRoles } from "src/app/auth";
import RiskTime from "./RiskTime";

const RiskTimeConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/risktime",
      element: <RiskTime />,
    },
  ],
};
export default RiskTimeConfig;
