import { authRoles } from "src/app/auth";
import Error404Page from "../404/Error404Page";
import { decryptFeature } from "../sign-in/tabs/featureEncryption";
import ControlMeasuresReport from "./ControlMeasuresReport";
import TasksReport from "./TasksReport";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const HiraReportsConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
  
    {
      path: "/hira/controlmeasures",
      element: <ControlMeasuresReport />,
    },
    {
      path:'/hira/tasks',  
      element: <TasksReport/>
    },
    
    // Catch-all route for 404
    {
      path: "*", // This will match any invalid URL
      element: <Error404Page />,
    },
  ],
};
export default HiraReportsConfig;