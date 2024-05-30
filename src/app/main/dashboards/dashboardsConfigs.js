import AnalyticsDashboardAppConfig from './analytics/AnalyticsDashboardAppConfig';
import ProjectDashboardAppConfig from './project/ProjectDashboardAppConfig';
import FinanceDashboardAppConfig from './finance/FinanceDashboardAppConfig';
import CryptoDashboardAppConfig from './crypto/CryptoDashboardAppConfig';
import MocConfig from './moc/MocConfig';
/**
 * Dashboards
 */
const dashboardsConfigs = [
	AnalyticsDashboardAppConfig,
	ProjectDashboardAppConfig,
	FinanceDashboardAppConfig,
	CryptoDashboardAppConfig,
	MocConfig
];
export default dashboardsConfigs;
