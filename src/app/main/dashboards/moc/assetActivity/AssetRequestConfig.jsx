import { authRoles } from "src/app/auth";
import AssetRequest from "./AssetRequest";

const AssetRequestConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/moc/Assetactivity",
      element: <AssetRequest />,
    },
  ],
};
export default AssetRequestConfig;
