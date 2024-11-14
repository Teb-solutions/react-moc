import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { authRoles } from "src/app/auth";

const RiskEvaluation = lazy(() => import("./RiskEvaluation"));

/**
 * The Academy app config.
 */
const RiskEvaluationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "risk/riskevaluation",
      element: <RiskEvaluation />,
      children: [
        {
          path: ":riskId/*",
          element: <RiskEvaluation />,
        },
      ],
    },
  ],
};
export default RiskEvaluationConfig;
