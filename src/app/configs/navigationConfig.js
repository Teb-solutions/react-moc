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
        feature: "TASK",
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
        id: "Staff.request",
        title: "Staff",
        type: "item",
        icon: "heroicons-outline:bell",
        url: "/staff",
      },
      {
        id: "masters.request",
        title: "Masters",
        type: "collapse",
        icon: "widgets",
        translate: "Masters",
        feature: "MST",
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
            id: "masters.changeevaluation",
            title: "Change Evaluation",
            type: "item",
            url: "/masters/changeevaluation",
          },
          {
            id: "masters.particular",
            title: "Particular",
            type: "item",
            url: "/masters/particular",
          },
          {
            id: "masters.particularsubcategory",
            title: "Particular Sub Category ",
            type: "item",
            url: "/masters/particularsubcategory",
          },
          {
            id: "masters.changeimpacthazards",
            title: "Change Impact Hazards",
            type: "item",
            url: "/masters/changeimpacthazards",
          },
          {
            id: "masters.Site",
            title: "Site",
            type: "item",
            url: "/masters/site",
          },
          {
            id: "masters.ImplementationReview",
            title: "Implementation Review",
            type: "item",
            url: "/masters/implementationreview",
          },
          {
            id: "masters.PSSRCategory",
            title: "PSSR Category",
            type: "item",
            url: "/masters/pssrcategory",
          },
          {
            id: "masters.PSSRSubCategory",
            title: "PSSR Sub Category",
            type: "item",
            url: "/masters/pssrsubcategory",
          },
          {
            id: "masters.RiskTime",
            title: "Risk Time",
            type: "item",
            url: "/masters/risktime",
          },
          {
            id: "masters.RiskFrequencyDetails",
            title: "Risk Frequency Details",
            type: "item",
            url: "/masters/riskfrequencydetails",
          },
          {
            id: "masters.RistMatrix",
            title: "Risk Matrix",
            type: "item",
            url: "/masters/riskmatrix",
          },
          {
            id: "masters.DesignationTask",
            title: "Designation Task",
            type: "item",
            url: "/masters/designationtask",
          },
        ],
      },
      {
        id: "security.request",
        title: "Security",
        type: "collapse",
        icon: "heroicons-outline:lock-closed",
        children: [
          {
            id: "security.Role",
            title: "Role",
            type: "item",
            url: "/security/role",
            end: true,
          },
          {
            id: "security.Access",
            title: "Access",
            type: "item",
            url: "/security/access",
            end: true,
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
