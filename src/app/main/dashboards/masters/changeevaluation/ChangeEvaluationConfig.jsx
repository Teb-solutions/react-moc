import { authRoles } from "src/app/auth";
import ChangeEvaluation from "./ChangeEvaluation";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const ChangeEvaluationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/changeevaluation" : "404",
      element: feature.includes("MST") ? (
        <ChangeEvaluation />
      ) : (
        <Error404Page />
      ),
    },
  ],
};
export default ChangeEvaluationConfig;
