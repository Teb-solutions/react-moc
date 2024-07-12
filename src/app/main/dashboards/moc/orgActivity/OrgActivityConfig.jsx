import { authRoles } from "src/app/auth";
import OrgActivity from "./OrgActivity";

const OrgActivityConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/moc/orgactivity",
      element: <OrgActivity />,
    },
  ],
};
export default OrgActivityConfig;
