import { authRoles } from "src/app/auth";
import RiskFrequencyDetails from "./RiskFrequencyDetails";

const RiskFrequencyDetailsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/riskfrequencydetails",
      element: <RiskFrequencyDetails />,
    },
  ],
};
export default RiskFrequencyDetailsConfig;
