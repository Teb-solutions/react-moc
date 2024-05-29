import i18next from "i18next";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);
/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig = [
  {
    id: "dashboards",
    // title: 'Dashboards',
    // subtitle: 'Unique dashboard designs',
    type: "group",
    icon: "heroicons-outline:home",
    translate: "DASHBOARDS",
    children: [
      {
        id: "dashboards.project",
        title: " Dashboard ",
        type: "item",
        icon: "heroicons-outline:chart-pie",
        url: "/dashboards/project",
      },
      // {
      // 	id: 'dashboards.analytics',
      // 	title: 'Analytics',
      // 	type: 'item',
      // 	icon: 'heroicons-outline:chart-pie',
      // 	url: '/dashboards/analytics'
      // },
      // {
      // 	id: 'dashboards.finance',
      // 	title: 'Finance',
      // 	type: 'item',
      // 	icon: 'heroicons-outline:cash',
      // 	url: '/dashboards/finance'
      // },
      // {
      // 	id: 'dashboards.crypto',
      // 	title: 'Crypto',
      // 	type: 'item',
      // 	icon: 'heroicons-outline:currency-dollar',
      // 	url: '/dashboards/crypto'
      // }
    ],
  },
];
export default navigationConfig;
