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
      {
        id: "moc.request",
        title: " MOC Requests",
        type: "item",
        icon: "heroicons-outline:collection",
        url: "/moc",
      },
      {
        id: "task.request",
        title: " Tasks",
        type: "item",
        icon: "heroicons-outline:clipboard-check",
        url: "/task",
      },

      {
        id: "session.request",
        title: " Session List",
        type: "item",
        icon: "heroicons-outline:clipboard-check",
        url: "/session",
      },
      {
        id: "notifications.request",
        title: "Notifications",
        type: "item",
        icon: "heroicons-outline:bell",
        url: "/notifications",
      },
      {
        id: "masters.request",
        title: "Masters",
        type: "collapse",
        icon: "widgets",
        translate: "Masters",
        children: [
          {
            id: "masters.Department",
            title: "Department",
            type: "item",
            url: "/masters/department",
            end: true,
          },
          {
            id: "masters.Designation",
            title: "Designation",
            type: "item",
            url: "/masters/designation",
          },
          {
            id: "masters.Division",
            title: "Division",
            type: "item",
            url: "/masters/division",
          },
          {
            id: "masters.Function",
            title: "Function",
            type: "item",
            url: "/masters/function",
            end: true,
          },
          {
            id: "masters.Location",
            title: "Location",
            type: "item",
            url: "/masters/location",
          },
          {
            id: "masters.activity",
            title: "Activity",
            type: "item",
            url: "/masters/activity",
          },
          {
            id: "masters.highrisk",
            title: "High Risk Activity",
            type: "item",
            url: "/masters/highriskactivity",
          },
          {
            id: "masters.Location",
            title: "Location",
            type: "item",
            url: "/masters/location",
          },
          {
            id: "masters.Location",
            title: "Location",
            type: "item",
            url: "/masters/location",
          },
          {
            id: "masters.Location",
            title: "Location",
            type: "item",
            url: "/masters/location",
          },
          {
            id: "masters.Location",
            title: "Location",
            type: "item",
            url: "/masters/location",
          },
          {
            id: "masters.Location",
            title: "Location",
            type: "item",
            url: "/masters/location",
          },
          {
            id: "masters.Location",
            title: "Location",
            type: "item",
            url: "/masters/location",
          },
        ],
      },
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
