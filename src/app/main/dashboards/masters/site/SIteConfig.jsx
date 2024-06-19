import { authRoles } from "src/app/auth";
import Site from "./Site";

const SiteConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/site",
      element: <Site />,
    },
  ],
};
export default SiteConfig;
