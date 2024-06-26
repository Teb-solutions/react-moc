import { authRoles } from "src/app/auth";
import Staff from "./Staff";
import Error404Page from "../../404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const StaffConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("STA") ? "/staff" : "404",
      element: feature.includes("STA") ? <Staff /> : <Error404Page />,
    },
    {
      path: feature.includes("STAU") ? ":id/*" : "404",
      element: feature.includes("STAU") ? <Staff /> : <Error404Page />,
    },
    {
      path: feature.includes("STAU") ? "id" : "404",
      element: feature.includes("STAU") ? <Staff /> : <Error404Page />,
    },
  ],
};
export default StaffConfig;
