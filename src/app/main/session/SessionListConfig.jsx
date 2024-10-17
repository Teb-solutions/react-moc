import { authRoles } from "src/app/auth";
import SessionList from "./Session";
import Error404Page from "../404/Error404Page"; // Make sure to import your 404 page

const sessionListConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/Session",
      element: <SessionList />,
    },
    {
      path: "/Session/:id", // This ensures that only valid session IDs are matched
      element: <SessionList />,
    },
    // Catch-all route for 404
    {
      path: "*", // Matches any other URL
      element: <Error404Page />, // Redirect to the 404 page
    },
  ],
};

export default sessionListConfig;
