import { authRoles } from "src/app/auth";
import Error404Page from "./Error404Page";

const errorPageConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest, // Adjust this based on who should see the 404 page
  routes: [
    {
      path: "/404",
      element: <Error404Page />,
    },
    {
      path: "*", // This matches all other routes not defined elsewhere
      element: <Error404Page />,
    },
  ],
};

export default errorPageConfig;
