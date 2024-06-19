import { authRoles } from "src/app/auth";
import PSSRSubCategory from "./PSSRSubCategory";

const PSSRSubCategoryConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/pssrsubcategory",
      element: <PSSRSubCategory />,
    },
  ],
};
export default PSSRSubCategoryConfig;
