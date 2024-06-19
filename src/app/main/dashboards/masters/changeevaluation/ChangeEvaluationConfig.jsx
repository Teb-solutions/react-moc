import { authRoles } from "src/app/auth";
import ChangeEvaluation from "./ChangeEvaluation";

const ChangeEvaluationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/changeevaluation",
      element: <ChangeEvaluation />,
    },
  ],
};
export default ChangeEvaluationConfig;
