import { authRoles } from "src/app/auth";
import InitiateRisk from "./InitiateRisk";
import ApproveRisk from "./ApproveRisk";

const InitiateRiskConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/risk/transportactivity",
      element: <InitiateRisk />,
    },
    {
      path: "/risk/routineactivity",
      element: <InitiateRisk />,
    },
    {
      path: "/risk/nonroutineactivity",
      element: <InitiateRisk />,
    },
    {
      path: "/risk/approverisk",
      element: <ApproveRisk />,
      children: [
        {
          path: ":riskId/*",
          element: <ApproveRisk />,
        },
      ],
    },
  ],
};
export default InitiateRiskConfig;
