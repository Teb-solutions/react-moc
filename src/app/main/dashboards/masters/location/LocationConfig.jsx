import { authRoles } from "src/app/auth";
import Location from "./Location";

const LocationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/masters/location",
      element: <Location />,
    },
  ],
};
export default LocationConfig;
