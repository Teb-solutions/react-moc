import ProjectDashboardAppConfig from "./project/ProjectDashboardAppConfig";
import taskConfig from "../task/TasksConfig";
import sessionListConfig from "../session/SessionListConfig";
import notificationConfig from "../notifications/NotificationConfig";
import DesignationConfig from "../masters/designation/DesignationConfig";
import DivisionConfig from "../masters/division/DivisionConfig";
import FunctionConfig from "../masters/function/FunctionConfig";
import LocationConfig from "../masters/location/LocationConfig";
import ActivityConfig from "../masters/activity/ActivityConfig";
import HighRiskActivityConfig from "../masters/highriskactivity/HighRiskActivityConfig";
import ChangeEvaluationConfig from "../masters/changeevaluation/ChangeEvaluationConfig";
import ParticularConfig from "../masters/particular/ParticularCofig";
import ParticularSubCategoryConfig from "../masters/particularsubcategory/ParticularSubCategoryConfig";
import ChangeImpactHazardsConfig from "../masters/changeimpacthazards/ChangeImpactHazardsConfig";
import SiteConfig from "../masters/site/SIteConfig";
import ImplementationReviewConfig from "../masters/implemntationreview/ImplementationReviewCofig";
import PSSRCategoryConfig from "../masters/pssrcategory/PSSRCategoryConfig";
import PSSRSubCategoryConfig from "../masters/pssrsubcategory/PSSRSubCategoryConfig";
import RiskTimeConfig from "../masters/risktime/RiskTimeConfig";
import RiskFrequencyDetailsConfig from "../masters/riskfrequencydetails/RiskFrequencyDetailsConfig";
import RiskMatrixConfig from "../masters/riskmatrix/RiskMatrixConfig";
import DesignationTaskConfig from "../masters/designationtask/DesignationTaskConfig";
import StaffConfig from "../staff/StaffConfig";
import ChangePasswordConfig from "../changepassword/ChangePasswordConfig";
import TicketConfig from "../ticketlist/TicketConfig";
import taskListConfig from "../tasklist/TaskListConfig";
import RecycleConfig from "../masters/recycle/RecycleConfig";
import StaffRoleConfig from "../masters/staffrole/StaffRoleConfig";
import RiskAppConfig from "../riskRegister/riskRegisterConfig";
import TransportActivityConfig from "../riskRegister/TransportActivity/TransportConfig";
import RoleConfig from "../security/role/RoleConfig";
import AccessConfig from "../security/access/AccessConfig";
import SecurityConfig from "../security/SecurityConfig";
import MocConfig from "../moc/MocConfig";
import OrgActivityConfig from "../moc/organization_moc/orgMocCreate/OrgActivityConfig";
import errorPageConfig from "../404/ErrorPageConfig";

/**
 * Dashboards
 */
const dashboardsConfigs = [
  ProjectDashboardAppConfig,
  MocConfig,
  RiskAppConfig,
  taskConfig,
  errorPageConfig,
  sessionListConfig,
  TicketConfig,
  notificationConfig,
  StaffConfig,
  SecurityConfig,
  DesignationConfig,
  DivisionConfig,
  FunctionConfig,
  LocationConfig,
  ActivityConfig,
  RecycleConfig,
  HighRiskActivityConfig,
  ChangeEvaluationConfig,
  ParticularConfig,
  ParticularSubCategoryConfig,
  ChangeImpactHazardsConfig,
  SiteConfig,
  StaffRoleConfig,
  ImplementationReviewConfig,
  PSSRCategoryConfig,
  PSSRSubCategoryConfig,
  RiskTimeConfig,
  RiskFrequencyDetailsConfig,
  RiskMatrixConfig,
  DesignationTaskConfig,
  ChangePasswordConfig,
  RoleConfig,
  AccessConfig,
  OrgActivityConfig,
  TransportActivityConfig,
  taskListConfig,
];
export default dashboardsConfigs;
