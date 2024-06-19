import { authRoles } from "src/app/auth";
import PSSRCategory from "./PSSRCategory";

const PSSRCategoryConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/pssrcategory",
      element: <PSSRCategory />,
    },
  ],
};
export default PSSRCategoryConfig;
