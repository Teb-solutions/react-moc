import AssetCouseConfig from "../dashboards/moc/assetEvaluation/assetCourseConfig";
import AcademyAppConfig from "../dashboards/moc/evaluation/AcademyAppConfig";
import orgCouseConfig from "../dashboards/moc/orgEvaluation/orgCourseConfig";
import riskCouseConfig from "../dashboards/riskRegister/riskEvaluation/riskCourseConfig";
/**
 * The list of application configurations.
 */
const appsConfigs = [
  AcademyAppConfig,
  AssetCouseConfig,
  orgCouseConfig,
  riskCouseConfig,
];
export default appsConfigs;
