import { authRoles } from "src/app/auth";
import ImplementationReview from "./ImplementationReview";

const ImplementationReviewConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/implementationreview",
      element: <ImplementationReview />,
    },
  ],
};
export default ImplementationReviewConfig;
