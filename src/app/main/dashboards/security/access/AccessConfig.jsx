import { authRoles } from "src/app/auth";
import Access from "./Access";

const AccessConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/security/access",
      element: <Access />,
    },
  ],
};
export default AccessConfig;
