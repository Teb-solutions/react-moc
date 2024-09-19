import { authRoles } from "src/app/auth";
import Role from "./role/Role";
import Error404Page from "../404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const SecurityConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("RLE") ? "/security/role" : "404",
      element: feature.includes("RLE") ? <Role to="role" /> : <Error404Page />,
      children: [
        {
          path: "",
          element: feature.includes("RLE") ? (
            <Role to="role" />
          ) : (
            <Error404Page />
          ),
        },
        {
          path: feature.includes("RLE") ? "role" : "404",
          element: feature.includes("RLE") ? <Role /> : <Error404Page />,
        },
      ],
    },
  ],
};
export default SecurityConfig;
