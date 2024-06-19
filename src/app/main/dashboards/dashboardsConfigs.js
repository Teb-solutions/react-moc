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
import ChangeEvaluationConfig from "./masters/changeevaluation/ChangeEvaluationConfig";
import ParticularConfig from "./masters/particular/ParticularCofig";
import ParticularSubCategoryConfig from "./masters/particularsubcategory/ParticularSubCategoryConfig";
import ChangeImpactHazardsConfig from "./masters/changeimpacthazards/ChangeImpactHazardsConfig";
import SiteConfig from "./masters/site/SIteConfig";
import ImplementationReviewConfig from "./masters/implemntationreview/ImplementationReviewCofig";
import PSSRCategoryConfig from "./masters/pssrcategory/PSSRCategoryConfig";
import PSSRSubCategoryConfig from "./masters/pssrsubcategory/PSSRSubCategoryConfig";
import RiskTimeConfig from "./masters/risktime/RiskTimeConfig";
import RiskFrequencyDetailsConfig from "./masters/riskfrequencydetails/RiskFrequencyDetailsConfig";
import RiskMatrixConfig from "./masters/riskmatrix/RiskMatrixConfig";
import DesignationTaskConfig from "./masters/designationtask/DesignationTaskConfig";
import StaffConfig from "./staff/StaffConfig";
/**
 * Dashboards
 */
const dashboardsConfigs = [
  ProjectDashboardAppConfig,
  MocConfig,
  taskConfig,
  sessionListConfig,
  notificationConfig,
  StaffConfig,
  mastersConfig,
  DesignationConfig,
  DivisionConfig,
  FunctionConfig,
  LocationConfig,
  ActivityConfig,
  HighRiskActivityConfig,
  ChangeEvaluationConfig,
  ParticularConfig,
  ParticularSubCategoryConfig,
  ChangeImpactHazardsConfig,
  SiteConfig,
  ImplementationReviewConfig,
  PSSRCategoryConfig,
  PSSRSubCategoryConfig,
  RiskTimeConfig,
  RiskFrequencyDetailsConfig,
  RiskMatrixConfig,
  DesignationTaskConfig,
];
export default dashboardsConfigs;
