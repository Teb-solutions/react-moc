import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { authRoles } from "src/app/auth";

const AcademyApp = lazy(() => import("./orgMainPage"));
const Course = lazy(() => import("./orgMainPage"));

/**
 * The Academy app config.
 */
const orgCouseConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "moc/orgEvaluation",
      element: <AcademyApp />,
      children: [
        {
          path: "",
          element: <Navigate to="/moc/orgEvaluation" />,
        },
        {
          path: ":orgEvaluationId/*",
          element: <Course />,
        },
        {
          path: "orgEvaluation",
          element: <Course />,
        },
      ],
    },
  ],
};
export default orgCouseConfig;
