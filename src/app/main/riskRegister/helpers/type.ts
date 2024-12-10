export interface IHiraList {
  id: number;
  hiranumber: string;
  source: number;
  projectName: string;
  projectDescription: string;
  siteId: number;
  siteName: string;
  divisionId: number;
  divisionName: string;
  siteInchargeId: number;
  siteInChargeName: string;
  date: string;
  category: number;
  status: number;
  createdAt: string;
  initiatedbyStaffId: number;
  initiatedbyStaffName: string;
  isActive: boolean;
  highRiskCount?: number;
  taskCount?: number;
}

export interface ISite {
  id: number;
  code: string;
  name: string;
  description: string;
  parentId: number;
  lookupType: number;
  parentType: any;
  isActive: boolean;
}

export interface IRiskRegisterDetails {
  id: number;
  hiranumber: string;
  source: number;
  projectName: string;
  projectDescription: string;
  siteId: number;
  siteName: string;
  divisionId: number;
  divisionName: string;
  siteInchargeId: number;
  siteInChargeName: string;
  intiatedByStaffId: number;
  initiatedbyStaffName: string;
  status: number;
  date: string;
  category: number;
  activities: Activity[];
  isActive: boolean;
  teamList: TeamList[];
  createdAt: string;
  closedAt: string;
}

export interface Activity {
  id: number;
  riskRegisterId: number;
  activityName: string;
  assignedToStaffId: number;
  assignedToStaffName: string;
  startedDate: string;
  completedDate?: string;
  isComplete: boolean;
}

export interface TeamList {
  teamType: number;
  staffId: number;
  staffName: string;
}

export interface SessionList {
  id: number;
  riskRegisterId: number;
  riskRegisterEvaluationId: number;
  startedAt: string;
  endedAt: any;
  timeoutMin: number;
  responsewaitTime: number;
  startedByStaffId: number;
  startedByStaffName: string;
  comments: any;
  isSessionEnded: boolean;
  isExpired: boolean;
  status: number;
  teamList: SessionTeamList[];
  isActive: boolean;
}

export interface SessionTeamList {
  teamType: number;
  staffId: number;
  staffName: string;
  approvalStatus: number;
  updatedAt: null | string;
  comments: null | string;
}

export interface LabelValue {
  label: string;
  value: string;
}

export interface LookUpType {
  value: number;
  text: string;
  isReadOnly: boolean;
}

export type ISelectedControlMeasures = {
  id: number;
  title: string;
};

export interface ITask {
  riskRegisterId?: number;
  taskId?: number;
  taskName: string;
  subTaskName: string;
  hazardousSituation: string;
  consequence: string;
  hazardType: number;
  time: number;
  frequencyDetails: number;
  frequencyScoring: number;
  likelihoodScoring: number;
  severityScoring: number;
  potentialRisk: number;
  controlMeasures: IControlMeasures[];
  // humanControlMeasures: ISelectedControlMeasures[];
  // technicalControlMeasures: ISelectedControlMeasures[];
  // organizationalControlMeasures: ISelectedControlMeasures[];
  modifiedTime: number;
  modifiedFrequencyDetails: number;
  residualFrequencyScoring: number;
  residualLikelihoodScoring: number;
  residualSeverityScoring: number;
  residualRisk: number;
  residualRiskClassification: number;
  status: number;
  residualRiskClassificationDisplay: string;
  approvals?: IApprovals[];
}

export interface IControlMeasures {
  id: number;
  type: number;
  controlMeasure: string;
  updatedAt: any;
  updatedBy: any;
  updatedByStaffName: any;
}

export interface IApprovals {
  id: number;
  riskRegisterId: number;
  riskRegisterTaskId: number;
  step: number;
  role: number;
  comments: any;
  actionType: number;
  approvalWorkflowVersion: number;
  isActive: boolean;
  staffId: number;
  staffName: string;
  startedAt: string;
  completedAt: any;
}
