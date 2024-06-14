import ProjectDashboardAppConfig from "./project/ProjectDashboardAppConfig";

import MocConfig from "./moc/MocConfig";
import taskConfig from "./task/TasksConfig";
import sessionListConfig from "./session/SessionListConfig";
import notificationConfig from "./notification/NotificationConfig";
import mastersConfig from "./masters/MastersConfig";
import DesignationConfig from "./masters/designation/DesignationConfig";
import DivisionConfig from "./masters/division/DivisionConfig";
import FunctionConfig from "./masters/function/FunctionConfig";
import LocationConfig from "./masters/location/LocationConfig";
import ActivityConfig from "./masters/activity/ActivityConfig";
import HighRiskActivityConfig from "./masters/highriskactivity/HighRiskActivityConfig";
/**
 * Dashboards
 */
const dashboardsConfigs = [
  ProjectDashboardAppConfig,
  MocConfig,
  taskConfig,
  sessionListConfig,
  notificationConfig,
  mastersConfig,
  DesignationConfig,
  DivisionConfig,
  FunctionConfig,
  LocationConfig,
  ActivityConfig,
  HighRiskActivityConfig,
];
export default dashboardsConfigs;
