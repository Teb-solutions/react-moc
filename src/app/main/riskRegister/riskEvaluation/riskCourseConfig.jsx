import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { authRoles } from "src/app/auth";

const AcademyApp = lazy(() => import("./riskCourse"));
const Course = lazy(() => import("./riskCourse"));

/**
 * The Academy app config.
 */
const riskCouseConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "moc/riskEvaluation",
      element: <AcademyApp />,
      children: [
        {
          path: "",
          element: <Navigate to="/moc/riskEvaluation" />,
        },
        {
          path: ":riskEvaluationId/*",
          element: <Course />,
        },
        {
          path: "riskEvaluation",
          element: <Course />,
        },
      ],
    },
  ],
};
export default riskCouseConfig;
