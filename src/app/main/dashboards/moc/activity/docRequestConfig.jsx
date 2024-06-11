import { authRoles } from "src/app/auth";
import DocRequest from "./docRequest";

const docRequestConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/moc/activity",
      element: <DocRequest />,
    },
  ],
};
export default docRequestConfig;
