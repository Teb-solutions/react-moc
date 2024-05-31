import { lazy } from 'react';

const MocApp = lazy(() => import('./Moc'));
// const DocApp = lazy(() => import('./docevaluation/Doc'));
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
			path: 'moc',
			element: <MocApp />
		}
	]
};
export default MocConfig;
