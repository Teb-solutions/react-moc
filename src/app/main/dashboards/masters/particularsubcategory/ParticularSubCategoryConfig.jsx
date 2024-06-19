import { authRoles } from "src/app/auth";
import ParticularSubCategory from "./ParticularSubCategory";

const ParticularSubCategoryConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/particularsubcategory",
      element: <ParticularSubCategory />,
    },
  ],
};
export default ParticularSubCategoryConfig;
