import i18next from "i18next";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";
import { decryptFeature } from "../main/sign-in/tabs/featureEncryption";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

// const storedFeature = decryptFeature();
const feature = decryptFeature() || [];

const navigationConfig1 = [
  {
    id: "dashboards",
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
        feature: "REQ",
      },
      {
        id: "risk.request",
        title: " Risk Register",
        type: "item",
        icon: "heroicons-outline:briefcase",
        url: "/risk",
        feature: "REQ",
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
        id: "tasklist.request",
        title: " Tasks List",
        type: "item",
        icon: "heroicons-outline:clipboard-list",
        url: "/tasklist",
        feature: "TASK",
      },
      {
        id: "ticketlist.request",
        title: " Ticket List",
        type: "item",
        icon: "heroicons-outline:ticket",
        url: "/ticketlist",
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
        icon: "heroicons-outline:user-group",
        url: "/staff",
        feature: "STA",
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
            feature: "MST",
          },
          {
            id: "masters.Designation",
            title: "Designation",
            type: "item",
            url: "/masters/designation",
            feature: "MST",
          },
          {
            id: "masters.Division",
            title: "Division",
            type: "item",
            url: "/masters/division",
            feature: "MST",
          },
          {
            id: "masters.Function",
            title: "Function",
            type: "item",
            url: "/masters/function",
            end: true,
            feature: "MST",
          },
          {
            id: "masters.Location",
            title: "Location",
            type: "item",
            url: "/masters/location",
            feature: "MST",
          },
          {
            id: "masters.activity",
            title: "Activity",
            type: "item",
            url: "/masters/activity",
            feature: "MST",
          },
          {
            id: "masters.highrisk",
            title: "High Risk Activity",
            type: "item",
            url: "/masters/highriskactivity",
            feature: "MST",
          },
          {
            id: "masters.changeevaluation",
            title: "Change Evaluation",
            type: "item",
            url: "/masters/changeevaluation",
            feature: "MST",
          },
          {
            id: "masters.particular",
            title: "Particular",
            type: "item",
            url: "/masters/particular",
            feature: "MST",
          },
          {
            id: "masters.particularsubcategory",
            title: "Particular Sub Category ",
            type: "item",
            url: "/masters/particularsubcategory",
            feature: "MST",
          },
          {
            id: "masters.changeimpacthazards",
            title: "Change Impact Hazards",
            type: "item",
            url: "/masters/changeimpacthazards",
            feature: "MST",
          },
          {
            id: "masters.Site",
            title: "Site",
            type: "item",
            url: "/masters/site",
            feature: "MST",
          },
          {
            id: "masters.ImplementationReview",
            title: "Implementation Review",
            type: "item",
            url: "/masters/implementationreview",
            feature: "MST",
          },
          {
            id: "masters.PSSRCategory",
            title: "PSSR Category",
            type: "item",
            url: "/masters/pssrcategory",
            feature: "MST",
          },
          {
            id: "masters.PSSRSubCategory",
            title: "PSSR Sub Category",
            type: "item",
            url: "/masters/pssrsubcategory",
            feature: "MST",
          },
          {
            id: "masters.RiskTime",
            title: "Risk Time",
            type: "item",
            url: "/masters/risktime",
            feature: "MST",
          },
          {
            id: "masters.RiskFrequencyDetails",
            title: "Risk Frequency Details",
            type: "item",
            url: "/masters/riskfrequencydetails",
            feature: "MST",
          },
          {
            id: "masters.RistMatrix",
            title: "Risk Matrix",
            type: "item",
            url: "/masters/riskmatrix",
            feature: "MST",
          },
          {
            id: "masters.DesignationTask",
            title: "Designation Task",
            type: "item",
            url: "/masters/designationtask",
            feature: "MST",
          },
        ],
      },
      {
        id: "security.request",
        title: "Security",
        type: "collapse",
        icon: "heroicons-outline:lock-closed",
        feature: "RLE,ACC",
        children: [
          {
            id: "security.Role",
            title: "Role",
            type: "item",
            url: "/security/role",
            end: true,
            feature: "RLE",
          },
          {
            id: "security.Access",
            title: "Access",
            type: "item",
            url: "/security/access",
            end: true,
            feature: "ACC",
          },
        ],
      },
    ],
  },
];

const shouldIncludeItem = (item) => {
  const defaultItems = [
    "dashboards.project",
    "session.request",
    "notifications.request",
    "ticketlist.request",
  ];

  if (defaultItems.includes(item.id)) {
    return true;
  }

  if (item.feature) {
    const itemFeatures = item.feature.split(",");
    return itemFeatures.some((f) => feature.includes(f.trim()));
  }

  if (item.children) {
    return item.children.some(shouldIncludeItem);
  }

  return false;
};

const filterNavigation = (config) => {
  return config
    .map((group) => ({
      ...group,
      children: group.children
        .map((item) => {
          if (item.children) {
            return {
              ...item,
              children: item.children.filter(shouldIncludeItem),
            };
          }
          return item;
        })
        .filter(shouldIncludeItem),
    }))
    .filter((group) => group.children.length > 0);
};

const navigationConfig = filterNavigation(navigationConfig1);

export default navigationConfig;
