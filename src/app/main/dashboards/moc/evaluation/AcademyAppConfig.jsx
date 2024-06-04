import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { authRoles } from "src/app/auth";

const AcademyApp = lazy(() => import("./AcademyApp"));
const Course = lazy(() => import("./course/Course"));
const Courses = lazy(() => import("../evaluation/Courses"));
/**
 * The Academy app config.
 */
const AcademyAppConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "moc/evaluation",
      element: <AcademyApp />,
      children: [
        {
          path: "",
          element: <Navigate to="/moc/evaluation" />,
        },
        {
          path: ":courseId/*",
          element: <Course />,
        },
        {
          path: "evaluation",
          element: <Courses />,
        },
      ],
    },
  ],
};
export default AcademyAppConfig;
