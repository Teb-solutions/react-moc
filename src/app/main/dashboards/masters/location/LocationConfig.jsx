import { authRoles } from "src/app/auth";
import Location from "./Location";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const LocationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/location" : "404",
      element: feature.includes("MST") ? <Location /> : <Error404Page />,
    },
  ],
};
export default LocationConfig;
