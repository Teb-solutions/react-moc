import { authRoles } from "src/app/auth";
import ChangeImpactHazards from "./ChangeImpactHazards";

const ChangeImpactHazardsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/changeimpacthazards",
      element: <ChangeImpactHazards />,
    },
  ],
};
export default ChangeImpactHazardsConfig;
