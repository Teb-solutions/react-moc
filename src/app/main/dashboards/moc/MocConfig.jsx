import { lazy } from 'react';

const MocApp = lazy(() => import('./Moc'));
/**
 * The ProjectDashboardApp configuration.
 */
const MocConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'moc/requests',
			element: <MocApp />
		}
	]
};
export default MocConfig;
