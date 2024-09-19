import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { authRoles } from "src/app/auth";

const Course = lazy(() => import("./docMocMainPage"));
/**
 * The Academy app config.
 */
const DocMainConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "moc/evaluation",
      element: <Course />,
      children: [
        {
          path: "",
          element: <Navigate to="/moc/evaluation" />,
        },
        {
          path: ":evaluationId/*",
          element: <Course />,
        },
        {
          path: "evaluation",
          element: <Course />,
        },
      ],
    },
  ],
};
export default DocMainConfig;
