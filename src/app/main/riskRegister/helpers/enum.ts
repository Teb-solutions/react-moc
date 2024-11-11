import { Delete } from "@mui/icons-material";

export enum RiskCategory {
  Transport = 1,
  Routine,
  Non_Routine,
}

export enum RiskRegisterTeamRole {
  DivTransport = 1,
  TransportHse,
  TaskRepresentative,
  HODTransport,
  OperationsInCharge,
  MaintenanceInCharge,
  HSEInCharge,
  SICHOF,
  ProjectInCharge,
  TransportInCharge,
  SiteInCharge,
}

export const RiskRegisterTeamRoleDisplayNames: {
  [key in RiskRegisterTeamRole]: string;
} = {
  [RiskRegisterTeamRole.DivTransport]: "Div Transport",
  [RiskRegisterTeamRole.TransportHse]: "Transport Hse In Charge",
  [RiskRegisterTeamRole.TaskRepresentative]: "Task Representative",
  [RiskRegisterTeamRole.HODTransport]: "HOD/HO Transport HS",
  [RiskRegisterTeamRole.OperationsInCharge]: "Operations In Charge",
  [RiskRegisterTeamRole.MaintenanceInCharge]: "Maintenance In Charge",
  [RiskRegisterTeamRole.HSEInCharge]: "HSE In Charge",
  [RiskRegisterTeamRole.SICHOF]: "SIC/HOF",
  [RiskRegisterTeamRole.ProjectInCharge]: "Project In Charge",
  [RiskRegisterTeamRole.TransportInCharge]: "Transport In Charge",
  [RiskRegisterTeamRole.SiteInCharge]: "Site In Charge",
};

export const RiskCategoryToTeamRoleMapping: {
  [key in RiskCategory]: RiskRegisterTeamRole[];
} = {
  [RiskCategory.Transport]: [
    RiskRegisterTeamRole.DivTransport,
    RiskRegisterTeamRole.TransportHse,
    RiskRegisterTeamRole.TaskRepresentative,
    RiskRegisterTeamRole.HODTransport,
  ],
  [RiskCategory.Routine]: [
    RiskRegisterTeamRole.HSEInCharge,
    RiskRegisterTeamRole.TaskRepresentative,
    RiskRegisterTeamRole.MaintenanceInCharge,
    RiskRegisterTeamRole.SICHOF,
  ],
  [RiskCategory.Non_Routine]: [
    RiskRegisterTeamRole.HSEInCharge,
    RiskRegisterTeamRole.MaintenanceInCharge,
    RiskRegisterTeamRole.TransportInCharge,
    RiskRegisterTeamRole.ProjectInCharge,
  ],
};

export enum RiskActionType {
  None = 0,
  Done = 1,
  Approve = 2,
  Reject = 3,
  SendBack = 4,
  Notify = 5,
}

export enum TaskPopupType {
  Approve = 1,
  Delete,
  Audit,
}
