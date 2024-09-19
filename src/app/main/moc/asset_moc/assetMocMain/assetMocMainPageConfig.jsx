import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { authRoles } from "src/app/auth";

const AcademyApp = lazy(() => import("./assetMocMainPage"));
const Course = lazy(() => import("./assetMocMainPage"));

/**
 * The Academy app config.
 */
const AssetCouseConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "moc/assetEvaluation",
      element: <AcademyApp />,
      children: [
        {
          path: "",
          element: <Navigate to="/moc/assetEvaluation" />,
        },
        {
          path: ":assetEvaluationId/*",
          element: <Course />,
        },
        {
          path: "assetEvaluation",
          element: <Course />,
        },
      ],
    },
  ],
};
export default AssetCouseConfig;
