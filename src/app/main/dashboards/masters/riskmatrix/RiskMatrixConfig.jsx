import { authRoles } from "src/app/auth";
import RiskMatrix from "./RiskMatrix";

const RiskMatrixConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/riskmatrix",
      element: <RiskMatrix />,
    },
  ],
};
export default RiskMatrixConfig;
